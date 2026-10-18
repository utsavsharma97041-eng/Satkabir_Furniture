import React, { useState } from 'react';
import { FurnitureProduct, CustomInquiry, Order, WoodType, PolishFinish } from '../types/furniture';
import { storageService } from '../services/storageService';
import {
  Store,
  Plus,
  Trash2,
  Edit3,
  CheckCircle,
  FileText,
  Phone,
  MessageSquare,
  TrendingUp,
  Package,
  Layers,
  Sparkles,
  ArrowUpRight,
  Hammer,
  RotateCcw,
  Search,
} from 'lucide-react';

interface SellerAdminDashboardProps {
  products: FurnitureProduct[];
  onProductsChange: (products: FurnitureProduct[]) => void;
  onExitAdmin: () => void;
}

export const SellerAdminDashboard: React.FC<SellerAdminDashboardProps> = ({
  products,
  onProductsChange,
  onExitAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'customInquiries' | 'orders'>('customInquiries');
  const [inquiries, setInquiries] = useState<CustomInquiry[]>(storageService.getInquiries());
  const [orders, setOrders] = useState<Order[]>(storageService.getOrders());

  // Add Product Form Modal State
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<FurnitureProduct | null>(null);

  // New product form states
  const [name, setName] = useState('');
  const [hindiName, setHindiName] = useState('');
  const [category, setCategory] = useState<FurnitureProduct['category']>('Living Room');
  const [price, setPrice] = useState<number>(24000);
  const [originalPrice, setOriginalPrice] = useState<number>(31000);
  const [woodType, setWoodType] = useState<WoodType>('Sheesham Wood (Indian Rosewood)');
  const [finish, setFinish] = useState<PolishFinish>('Honey Teak Matte');
  const [lengthInches, setLengthInches] = useState<number>(60);
  const [widthInches, setWidthInches] = useState<number>(30);
  const [heightInches, setHeightInches] = useState<number>(32);
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [stockCount, setStockCount] = useState<number>(5);

  // Metrics
  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const activeCarpentry = inquiries.filter((i) => i.status === 'In Carpentry Workshop' || i.status === 'Blueprint Approved').length;

  const handleCreateOrUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    if (editingProduct) {
      const updated: FurnitureProduct = {
        ...editingProduct,
        name,
        hindiName: hindiName || undefined,
        category,
        price,
        originalPrice: Math.max(originalPrice, price),
        woodType,
        finish,
        dimensions: {
          length: lengthInches,
          width: widthInches,
          height: heightInches,
          unit: 'inches',
        },
        imageUrl: imageUrl || editingProduct.imageUrl,
        description,
        stockCount,
      };
      const updatedList = storageService.updateProduct(updated);
      onProductsChange(updatedList);
      setEditingProduct(null);
    } else {
      const newProd: FurnitureProduct = {
        id: `skf-custom-${Date.now()}`,
        name,
        hindiName: hindiName || undefined,
        category,
        price,
        originalPrice: originalPrice || Math.round(price * 1.25),
        discountPercentage: Math.round(((originalPrice - price) / originalPrice) * 100) || 20,
        rating: 5.0,
        reviewCount: 1,
        imageUrl:
          imageUrl ||
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200&auto=format&fit=crop',
        description: description || 'Master crafted in seasoned solid timber.',
        woodType,
        availableWoodTypes: ['Sheesham Wood (Indian Rosewood)', 'CP Teak Wood (Sagwan)'],
        finish,
        availableFinishes: ['Honey Teak Matte', 'Rich Walnut Satin', 'Natural Teak Gloss'],
        availableFabrics: ['Royal Velvet - Emerald Green', 'Pure Organic Linen - Warm Beige'],
        dimensions: {
          length: lengthInches,
          width: widthInches,
          height: heightInches,
          unit: 'inches',
        },
        weightKg: 45,
        isCustomizable: true,
        warrantyYears: 10,
        stockCount,
        craftingTimeDays: 7,
        features: [
          '100% Solid Kiln-Dried Timber',
          'Handcrafted in Satkkabir Furniture Workshop',
          'Termite & Borer Proof Seasoning',
        ],
      };
      const updatedList = storageService.addProduct(newProd);
      onProductsChange(updatedList);
      setIsAddingProduct(false);
    }

    // Reset fields
    setName('');
    setHindiName('');
    setPrice(24000);
    setOriginalPrice(31000);
    setImageUrl('');
    setDescription('');
  };

  const startEditProduct = (prod: FurnitureProduct) => {
    setEditingProduct(prod);
    setName(prod.name);
    setHindiName(prod.hindiName || '');
    setCategory(prod.category);
    setPrice(prod.price);
    setOriginalPrice(prod.originalPrice);
    setWoodType(prod.woodType);
    setFinish(prod.finish);
    setLengthInches(prod.dimensions.length);
    setWidthInches(prod.dimensions.width);
    setHeightInches(prod.dimensions.height);
    setImageUrl(prod.imageUrl);
    setDescription(prod.description);
    setStockCount(prod.stockCount);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to remove this product from the online store?')) {
      const updated = storageService.deleteProduct(id);
      onProductsChange(updated);
    }
  };

  const handleUpdateInquiryStatus = (
    inquiry: CustomInquiry,
    newStatus: CustomInquiry['status']
  ) => {
    const updated = { ...inquiry, status: newStatus };
    const list = storageService.updateInquiry(updated);
    setInquiries(list);
  };

  const handleUpdateOrderStatus = (order: Order, newStatus: Order['orderStatus']) => {
    const updated = {
      ...order,
      orderStatus: newStatus,
      trackingUpdates: [
        ...order.trackingUpdates,
        {
          date: new Date().toLocaleDateString('en-IN') + ' ' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          stage: newStatus,
          note: `Stage progressed by Workshop Manager to: ${newStatus}`,
        },
      ],
    };
    const list = storageService.updateOrder(updated);
    setOrders(list);
  };

  const openWhatsAppToClient = (phone: string, clientName: string, inquiryId: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const message = `Namaste ${clientName} ji, this is from Satkkabir Furniture Udhyog regarding your custom furniture request (${inquiryId}). We have reviewed your dimensions and blueprint specifications. When is a good time to discuss the wood selection and dispatch schedule?`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="bg-[#fcfaf7] min-h-screen py-8 px-4 sm:px-6 lg:px-8 text-[#241c15]">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header Bar */}
        <div className="bg-white p-5 rounded-2xl border border-[#dec099]/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#7e4b2c] text-white flex items-center justify-center shadow-md">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl font-bold text-[#301a11]">
                  Satkkabir Furniture Udhyog • Seller & Workshop Portal
                </h1>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                  Owner Admin Mode
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Manage online catalog, review custom modification blueprints, and track carpentry production orders.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (confirm('Reset catalog products back to factory showcase data?')) {
                  const resetList = storageService.resetProductsToDefault();
                  onProductsChange(resetList);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl transition"
              title="Reset initial catalog items"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Catalog</span>
            </button>
            <button
              onClick={onExitAdmin}
              className="px-4 py-2 rounded-xl bg-[#7e4b2c] hover:bg-[#683d28] text-white text-xs font-semibold shadow-xs transition"
            >
              View Customer Storefront
            </button>
          </div>
        </div>

        {/* Workshop Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-[#dec099]/60 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="text-xs font-medium">Catalog Products</span>
              <Package className="w-4 h-4 text-[#b98144]" />
            </div>
            <span className="text-2xl font-serif font-bold text-[#301a11]">
              {products.length}
            </span>
            <span className="text-[11px] text-emerald-700 block mt-0.5 font-medium">
              100% Solid Timber Listed
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#dec099]/60 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="text-xs font-medium">Custom Inquiries</span>
              <FileText className="w-4 h-4 text-[#7e4b2c]" />
            </div>
            <span className="text-2xl font-serif font-bold text-[#7e4b2c]">
              {inquiries.length}
            </span>
            <span className="text-[11px] text-amber-700 block mt-0.5 font-medium">
              {activeCarpentry} Active in Workshop
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#dec099]/60 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="text-xs font-medium">Online Orders</span>
              <Layers className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-2xl font-serif font-bold text-emerald-800">
              {orders.length}
            </span>
            <span className="text-[11px] text-stone-500 block mt-0.5">
              White-Glove Delivery
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#dec099]/60 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="text-xs font-medium">Gross Bookings</span>
              <TrendingUp className="w-4 h-4 text-[#b98144]" />
            </div>
            <span className="text-xl font-serif font-bold text-[#301a11]">
              ₹{(totalRevenue / 1000).toFixed(1)}k
            </span>
            <span className="text-[11px] text-emerald-700 block mt-0.5 font-medium">
              Direct Workshop Revenue
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#dec099]/70 gap-2 sm:gap-6 bg-white px-4 rounded-xl border">
          <button
            onClick={() => setActiveTab('customInquiries')}
            className={`flex items-center gap-2 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'customInquiries'
                ? 'border-[#7e4b2c] text-[#7e4b2c]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#b98144]" />
            <span>Custom Modification Requests ({inquiries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'products'
                ? 'border-[#7e4b2c] text-[#7e4b2c]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Product Catalog ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'orders'
                ? 'border-[#7e4b2c] text-[#7e4b2c]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Store Orders ({orders.length})</span>
          </button>
        </div>

        {/* TAB 1: CUSTOM MODIFICATION INQUIRIES */}
        {activeTab === 'customInquiries' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#301a11]">
                  Customer Custom Blueprints & Modification Requests
                </h3>
                <p className="text-xs text-stone-500">
                  Orders submitted through the customizer studio and bespoke blueprint submission form.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="bg-white p-5 rounded-2xl border border-[#dec099]/80 shadow-xs flex flex-col md:flex-row justify-between gap-4"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-[#f5ede1] text-[#7e4b2c] px-2.5 py-1 rounded-md border border-[#cb9f6a]/60">
                        {inq.id}
                      </span>
                      <h4 className="text-sm font-bold text-[#301a11]">
                        {inq.productType}
                      </h4>
                      <span className="text-[11px] text-stone-400">
                        • {inq.createdAt}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-stone-600 bg-[#fcfaf7] p-3 rounded-xl border border-stone-100">
                      <div>
                        <span className="text-stone-400 text-[10px] block">Customer</span>
                        <strong className="text-stone-900">{inq.customerName}</strong>
                      </div>
                      <div>
                        <span className="text-stone-400 text-[10px] block">Contact</span>
                        <span className="font-medium text-stone-800">{inq.customerPhone}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 text-[10px] block">Wood Preference</span>
                        <span className="font-semibold text-[#7e4b2c]">
                          {inq.woodPreference.split('(')[0]}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-400 text-[10px] block">Target Budget</span>
                        <span className="font-extrabold text-stone-900">
                          ₹{inq.budgetInr.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-stone-700 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                      <strong>Client Specs:</strong> {inq.description}
                    </p>

                    {inq.approxDimensions && (
                      <div className="text-xs text-stone-600">
                        <span className="font-semibold text-stone-700">Dimensions: </span>
                        <span>{inq.approxDimensions}</span>
                      </div>
                    )}

                    {inq.referenceImageUrl && (
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[11px] font-semibold text-stone-500">Blueprint Sketch:</span>
                        <a
                          href={inq.referenceImageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-[#7e4b2c] underline flex items-center gap-1 font-medium"
                        >
                          View Full Image <ArrowUpRight className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Actions & Status Workflow */}
                  <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-stone-200 pt-3 md:pt-0 md:pl-4 flex flex-col justify-between gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                        Carpentry Status:
                      </label>
                      <select
                        value={inq.status}
                        onChange={(e) =>
                          handleUpdateInquiryStatus(inq, e.target.value as CustomInquiry['status'])
                        }
                        className="w-full text-xs font-semibold p-2 rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#7e4b2c]"
                      >
                        <option value="In Review">In Review</option>
                        <option value="Blueprint Approved">Blueprint Approved</option>
                        <option value="In Carpentry Workshop">In Carpentry Workshop</option>
                        <option value="Wood Carving & Polishing">Wood Carving & Polishing</option>
                        <option value="Ready for Dispatch">Ready for Dispatch</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => openWhatsAppToClient(inq.customerPhone, inq.customerName, inq.id)}
                        className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat on WhatsApp</span>
                      </button>
                      <a
                        href={`tel:${inq.customerPhone}`}
                        className="w-full py-2 px-3 rounded-lg border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call Customer</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCT CATALOG MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#301a11]">
                  Satkkabir Furniture Udhyog Product Catalog
                </h3>
                <p className="text-xs text-stone-500">
                  Add new handcrafted solid wood models or update pricing and stock.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsAddingProduct(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#7e4b2c] hover:bg-[#683d28] text-white text-xs font-semibold rounded-xl shadow-xs transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Furniture Product</span>
              </button>
            </div>

            {/* Product Table */}
            <div className="bg-white rounded-2xl border border-[#dec099]/80 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-600">
                  <thead className="bg-[#f5ede1] text-[#301a11] uppercase font-bold text-[10px] tracking-wider border-b border-[#dec099]/60">
                    <tr>
                      <th className="p-3.5">Product & Photo</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Wood Species</th>
                      <th className="p-3.5">Standard Dimensions</th>
                      <th className="p-3.5">Selling Price</th>
                      <th className="p-3.5">Stock</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-stone-50/70 transition">
                        <td className="p-3.5 flex items-center gap-3">
                          <img
                            src={prod.imageUrl}
                            alt={prod.name}
                            className="w-12 h-12 rounded-lg object-cover border border-stone-200"
                          />
                          <div>
                            <span className="font-bold text-stone-900 block">{prod.name}</span>
                            {prod.hindiName && (
                              <span className="text-[11px] text-[#b98144]">{prod.hindiName}</span>
                            )}
                          </div>
                        </td>
                        <td className="p-3.5 font-medium">{prod.category}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded bg-[#f5ede1] text-[#7e4b2c] font-semibold text-[10px]">
                            {prod.woodType.split('(')[0]}
                          </span>
                        </td>
                        <td className="p-3.5 text-stone-500">
                          {prod.dimensions.length}"L × {prod.dimensions.width}"W × {prod.dimensions.height}"H
                        </td>
                        <td className="p-3.5">
                          <span className="font-extrabold text-stone-900">
                            ₹{prod.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-stone-400 block line-through">
                            ₹{prod.originalPrice.toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${prod.stockCount > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                            {prod.stockCount} in stock
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-1">
                          <button
                            onClick={() => startEditProduct(prod)}
                            className="p-1.5 text-stone-500 hover:text-[#7e4b2c] hover:bg-stone-100 rounded-lg transition"
                            title="Edit Product"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-stone-100 rounded-lg transition"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STORE ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#301a11]">
              Customer Store Orders
            </h3>
            <div className="space-y-3">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white p-5 rounded-2xl border border-[#dec099]/80 shadow-xs flex flex-col md:flex-row justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-[#f5ede1] text-[#7e4b2c] px-2.5 py-1 rounded-md">
                        {ord.id}
                      </span>
                      <span className="text-xs text-stone-500">{ord.createdAt}</span>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {ord.paymentStatus} via {ord.paymentMethod}
                      </span>
                    </div>

                    <div className="text-xs text-stone-700">
                      <strong>Customer:</strong> {ord.customer.fullName} • {ord.customer.phone} • {ord.customer.city} ({ord.customer.pincode})
                    </div>

                    <div className="space-y-1.5 pt-1">
                      {ord.items.map((item, i) => (
                        <div key={i} className="text-xs bg-stone-50 p-2 rounded-lg flex justify-between">
                          <span>
                            <strong>{item.quantity}x</strong> {item.productName}
                            {item.isCustomized && ' (Bespoke Modified)'}
                          </span>
                          <span className="font-bold text-[#7e4b2c]">
                            ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-stone-200 pt-3 md:pt-0 md:pl-4 space-y-3">
                    <div>
                      <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                        Advance Workshop Stage:
                      </span>
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleUpdateOrderStatus(ord, e.target.value as any)}
                        className="w-full text-xs font-semibold p-2 rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#7e4b2c]"
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Timber Selection">Timber Selection</option>
                        <option value="Workshop Carpentry">Workshop Carpentry</option>
                        <option value="Polishing & Upholstery">Polishing & Upholstery</option>
                        <option value="Quality Check">Quality Check</option>
                        <option value="Out for White Glove Delivery">Out for White Glove Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>

                    <div className="text-xs bg-[#f5ede1] p-2.5 rounded-lg border border-[#cb9f6a]/60">
                      <span className="text-stone-500 block text-[10px]">Grand Order Value</span>
                      <span className="text-base font-serif font-bold text-[#7e4b2c]">
                        ₹{ord.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal: Add or Edit Product */}
        {(isAddingProduct || editingProduct) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#dec099] p-6">
              <h2 className="font-serif text-xl font-bold text-[#301a11] mb-1">
                {editingProduct ? 'Edit Furniture Listing' : 'Add New Furniture Product to Online Store'}
              </h2>
              <p className="text-xs text-stone-500 mb-4">
                Enter craftsmanship specs, standard dimensions, and pricing for your workshop piece.
              </p>

              <form onSubmit={handleCreateOrUpdateProduct} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Product English Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Royal Jodhpur Sheesham Bed"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#7e4b2c]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Hindi Name (Optional)</label>
                    <input
                      type="text"
                      value={hindiName}
                      onChange={(e) => setHindiName(e.target.value)}
                      placeholder="e.g. रॉयल शीशम बेड"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#7e4b2c]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Category *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#7e4b2c] bg-white"
                    >
                      <option value="Living Room">Living Room</option>
                      <option value="Bedroom">Bedroom</option>
                      <option value="Dining & Kitchen">Dining & Kitchen</option>
                      <option value="Pooja Mandir">Pooja Mandir</option>
                      <option value="Study & Office">Study & Office</option>
                      <option value="Storage & Decor">Storage & Decor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Wood Species *</label>
                    <select
                      value={woodType}
                      onChange={(e) => setWoodType(e.target.value as WoodType)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#7e4b2c] bg-white"
                    >
                      <option value="Sheesham Wood (Indian Rosewood)">Sheesham Wood (Indian Rosewood)</option>
                      <option value="CP Teak Wood (Sagwan)">CP Teak Wood (Sagwan)</option>
                      <option value="Mango Wood">Mango Wood</option>
                      <option value="Rosewood (Shisham Special)">Rosewood (Shisham Special)</option>
                      <option value="Acacia Hardwood">Acacia Hardwood</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Selling Price (₹ INR) *</label>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#7e4b2c]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Original Price / MRP (₹)</label>
                    <input
                      type="number"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#7e4b2c]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Length (in)</label>
                    <input
                      type="number"
                      value={lengthInches}
                      onChange={(e) => setLengthInches(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Width/Depth (in)</label>
                    <input
                      type="number"
                      value={widthInches}
                      onChange={(e) => setWidthInches(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Height (in)</label>
                    <input
                      type="number"
                      value={heightInches}
                      onChange={(e) => setHeightInches(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Image URL (Unsplash or direct image)</label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#7e4b2c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Description & Craftsmanship</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Seasoning details, timber grade, joinery type..."
                    className="w-full p-2.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#7e4b2c]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingProduct(false);
                      setEditingProduct(null);
                    }}
                    className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#7e4b2c] hover:bg-[#683d28] text-white text-xs font-semibold shadow-xs"
                  >
                    {editingProduct ? 'Save Product Changes' : 'Publish to Store'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
