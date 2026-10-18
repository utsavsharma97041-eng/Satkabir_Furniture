/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { FurnitureProduct, CartItem, WoodType, Order, CustomInquiry } from './types/furniture';
import { storageService } from './services/storageService';
import { auth, loginWithGoogle, logoutUser } from './services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CustomizerStudio } from './components/CustomizerStudio';
import { BespokeRequestModal } from './components/BespokeRequestModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { SellerAdminDashboard } from './components/SellerAdminDashboard';
import { WoodGuideModal } from './components/WoodGuideModal';
import { ThreeFurnitureStudio } from './components/ThreeFurnitureStudio';
import { CarpentryWorkshopGame } from './components/CarpentryWorkshopGame';
import { AIAssistantModal } from './components/AIAssistantModal';
import { ScienceTimberModal } from './components/ScienceTimberModal';
import { NotifyMeModal } from './components/NotifyMeModal';
import { ProductAlertSubscription } from './types/furniture';
import { Footer } from './components/Footer';
import {
  Sliders,
  Search,
  Sparkles,
  Filter,
  CheckCircle2,
  Hammer,
  ArrowRight,
  ShieldCheck,
  Package,
  Box,
  Gamepad2,
  Bot,
  Atom,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const CATEGORIES = [
  'All',
  'Living Room',
  'Bedroom',
  'Dining & Kitchen',
  'Pooja Mandir',
  'Study & Office',
  'Storage & Decor',
];

export default function App() {
  const [products, setProducts] = useState<FurnitureProduct[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Navigation & View States
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedWoodFilter, setSelectedWoodFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Modals & Panels
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [customizerProductId, setCustomizerProductId] = useState<string | undefined>(undefined);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isBespokeOpen, setIsBespokeOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [trackerOrderId, setTrackerOrderId] = useState<string | undefined>(undefined);
  const [isWoodGuideOpen, setIsWoodGuideOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState<FurnitureProduct | null>(null);

  // New Skills & Interactive Modals
  const [isThreeStudioOpen, setIsThreeStudioOpen] = useState(false);
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isScienceOpen, setIsScienceOpen] = useState(false);

  // Seller / Workshop Mode Toggle
  const [isSellerMode, setIsSellerMode] = useState(false);

  // Notify Me Price Drop & Restock Modal State
  const [notifyProduct, setNotifyProduct] = useState<FurnitureProduct | null>(null);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);

  // Notification Banner
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenNotifyModal = (product: FurnitureProduct) => {
    setNotifyProduct(product);
    setIsNotifyModalOpen(true);
  };

  const handleAlertSaved = (alert: ProductAlertSubscription) => {
    showNotification(`🔔 Alert active for ${alert.productName}! We will email ${alert.userEmail} on price drop or restock.`);
  };

  // Initial Data & Auth Load
  useEffect(() => {
    setProducts(storageService.getProducts());
    setCart(storageService.getCart());
    setWishlist(storageService.getWishlist());

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const user = await loginWithGoogle();
    if (user) {
      showNotification(`Welcome, ${user.displayName || 'Customer'}! Signed in with Google.`);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    showNotification('Signed out safely.');
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
        const matchesWood =
          selectedWoodFilter === 'All' || p.woodType.includes(selectedWoodFilter);
        const matchesSearch =
          !searchQuery ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.hindiName && p.hindiName.includes(searchQuery));
        return matchesCategory && matchesWood && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, activeCategory, selectedWoodFilter, searchQuery, sortBy]);

  // Cart Handlers
  const handleAddToCart = (item: CartItem) => {
    const updated = storageService.addToCart(item);
    setCart(updated);
    showNotification(
      item.isCustomized
        ? `Added customized ${item.productName} to your cart!`
        : `Added ${item.productName} to your cart!`
    );
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    const updated = storageService.updateCartQuantity(id, delta);
    setCart(updated);
  };

  const handleRemoveFromCart = (id: string) => {
    const updated = storageService.removeFromCart(id);
    setCart(updated);
  };

  const handleToggleWishlist = (id: string) => {
    const updated = storageService.toggleWishlist(id);
    setWishlist(updated);
  };

  // Launch Customizer with product
  const handleOpenCustomizer = (productId?: string) => {
    setCustomizerProductId(productId);
    setIsCustomizerOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSuccess = (order: Order) => {
    setCart([]);
    setIsCheckoutOpen(false);
    setTrackerOrderId(order.id);
    setIsTrackerOpen(true);
    showNotification(`Order ${order.id} confirmed! White-glove workshop status active.`);
  };

  const handleInquirySuccess = (inquiry: CustomInquiry) => {
    showNotification(`Custom blueprint ticket ${inquiry.id} registered with our carpenters.`);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#241c15] flex flex-col font-sans selection:bg-[#c28e46]/20 selection:text-[#523314]">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 bg-[#301a11] text-[#f5ede1] px-4 py-3 rounded-xl shadow-2xl border border-[#cb9f6a] flex items-center gap-2.5 text-xs animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#dec099]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Navigation */}
      <Navbar
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenCustomizer={() => handleOpenCustomizer()}
        onOpenBespoke={() => setIsBespokeOpen(true)}
        onOpenTracker={() => setIsTrackerOpen(true)}
        onOpenWoodGuide={() => setIsWoodGuideOpen(true)}
        onOpenThreeStudio={() => setIsThreeStudioOpen(true)}
        onOpenGame={() => setIsGameOpen(true)}
        onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
        onOpenScience={() => setIsScienceOpen(true)}
        onToggleSellerPortal={() => {
          setIsSellerMode(!isSellerMode);
          setIsCustomizerOpen(false);
        }}
        isSellerMode={isSellerMode}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setIsCustomizerOpen(false);
        }}
      />

      {/* CONTENT SWITCH: Seller Workshop Mode vs Customer Store */}
      {isSellerMode ? (
        <SellerAdminDashboard
          products={products}
          onProductsChange={(updated) => setProducts(updated)}
          onExitAdmin={() => setIsSellerMode(false)}
        />
      ) : isCustomizerOpen ? (
        /* INTERACTIVE CUSTOM MODIFICATION STUDIO VIEW */
        <CustomizerStudio
          products={products}
          initialProductId={customizerProductId}
          onAddToCart={handleAddToCart}
          onClose={() => setIsCustomizerOpen(false)}
        />
      ) : (
        /* STANDARD ONLINE STOREFRONT VIEW */
        <main className="flex-1">
          {/* Hero Banner */}
          <HeroBanner
            onOpenCustomizer={() => handleOpenCustomizer()}
            onOpenBespoke={() => setIsBespokeOpen(true)}
            onExploreCatalog={() => {
              const el = document.getElementById('catalog-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* Interactive Feature Quick Action Strip */}
          <div className="bg-[#f5ede1] border-b border-[#dec099] py-5 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#7e4b2c] text-[#f5ede1] flex items-center justify-center shadow-md shrink-0">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#301a11]">
                    Interactive Custom Modification & 3D Studio
                  </h3>
                  <p className="text-xs text-stone-600">
                    Modify dimensions, solid wood species, velvet fabrics, or explore the 3D procedural exploded view.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsThreeStudioOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-white border border-[#cb9f6a] text-xs font-bold text-[#683d28] hover:bg-[#faf7f2] transition flex items-center gap-1.5 shadow-xs"
                >
                  <Box className="w-3.5 h-3.5 text-[#b98144]" />
                  <span>3D Exploded View</span>
                </button>
                <button
                  onClick={() => setIsGameOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-white border border-[#cb9f6a] text-xs font-bold text-[#683d28] hover:bg-[#faf7f2] transition flex items-center gap-1.5 shadow-xs"
                >
                  <Gamepad2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Workshop Game</span>
                </button>
                <button
                  onClick={() => setIsAIAssistantOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-white border border-[#cb9f6a] text-xs font-bold text-[#683d28] hover:bg-[#faf7f2] transition flex items-center gap-1.5 shadow-xs"
                >
                  <Bot className="w-3.5 h-3.5 text-[#7e4b2c]" />
                  <span>AI Ustaad Ji</span>
                </button>
                <button
                  onClick={() => handleOpenCustomizer()}
                  className="px-4 py-2 rounded-xl bg-[#7e4b2c] hover:bg-[#683d28] text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                >
                  <span>Launch Customizer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Catalog & Filter Section */}
          <div id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Category Pills Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-6">
              {CATEGORIES.map((cat) => {
                const isSelected = activeCategory === cat;
                const count =
                  cat === 'All'
                    ? products.length
                    : products.filter((p) => p.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                      isSelected
                        ? 'bg-[#7e4b2c] text-white border-[#7e4b2c] shadow-xs'
                        : 'bg-white text-stone-700 border-[#dec099]/70 hover:bg-[#f5ede1]'
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search & Refinement Bar */}
            <div className="bg-white p-4 rounded-2xl border border-[#dec099]/80 shadow-xs mb-8 flex flex-wrap items-center justify-between gap-4">
              {/* Search input */}
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Sheesham beds, Teakwood sofas, Pooja Mandir, Dining sets..."
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#7e4b2c]"
                />
              </div>

              {/* Filters & Sorting */}
              <div className="flex items-center gap-3">
                {/* Wood Type filter */}
                <div className="flex items-center gap-1.5 text-xs text-stone-600">
                  <span className="font-semibold hidden sm:inline">Timber:</span>
                  <select
                    value={selectedWoodFilter}
                    onChange={(e) => setSelectedWoodFilter(e.target.value)}
                    className="text-xs p-2 rounded-xl border border-stone-200 bg-[#faf8f5] focus:outline-none focus:ring-2 focus:ring-[#7e4b2c]"
                  >
                    <option value="All">All Timbers</option>
                    <option value="Sheesham">Sheesham Wood (Rosewood)</option>
                    <option value="Teak">CP Teak Wood (Sagwan)</option>
                    <option value="Mango">Mango Hardwood</option>
                  </select>
                </div>

                {/* Sort By */}
                <div className="flex items-center gap-1.5 text-xs text-stone-600">
                  <span className="font-semibold hidden sm:inline">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="text-xs p-2 rounded-xl border border-stone-200 bg-[#faf8f5] focus:outline-none focus:ring-2 focus:ring-[#7e4b2c]"
                  >
                    <option value="featured">Featured Craftsmanship</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Customer Rating</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-stone-300">
                <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h3 className="font-serif text-lg font-bold text-stone-700">No furniture found</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">
                  We can manufacture any custom design from scratch! Use our Custom Studio or submit your room blueprint.
                </p>
                <button
                  onClick={() => handleOpenCustomizer()}
                  className="px-4 py-2 bg-[#7e4b2c] text-white text-xs font-semibold rounded-xl"
                >
                  Open Custom Modification Studio
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isWishlisted={wishlist.includes(product.id)}
                    currentUserEmail={currentUser?.email || undefined}
                    onToggleWishlist={handleToggleWishlist}
                    onSelectProduct={(p) => setSelectedProductDetail(p)}
                    onCustomizeProduct={(id) => handleOpenCustomizer(id)}
                    onQuickAddToCart={handleAddToCart}
                    onOpenNotifyModal={handleOpenNotifyModal}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      )}

      {/* Global Modals */}
      <ProductDetailModal
        product={selectedProductDetail}
        currentUser={currentUser}
        onRequireLogin={handleLogin}
        onClose={() => setSelectedProductDetail(null)}
        onCustomize={(id) => handleOpenCustomizer(id)}
        onAddToCart={handleAddToCart}
        onOpenNotifyModal={handleOpenNotifyModal}
      />

      {/* Product Price Drop & Restock Notification Modal */}
      <NotifyMeModal
        isOpen={isNotifyModalOpen}
        onClose={() => {
          setIsNotifyModalOpen(false);
          setNotifyProduct(null);
        }}
        product={notifyProduct}
        currentUserEmail={currentUser?.email || undefined}
        onAlertSaved={handleAlertSaved}
      />

      <BespokeRequestModal
        isOpen={isBespokeOpen}
        onClose={() => setIsBespokeOpen(false)}
        onSuccess={handleInquirySuccess}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        onLaunchCustomizer={() => {
          setIsCartOpen(false);
          handleOpenCustomizer();
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        onOrderSuccess={handleOrderSuccess}
      />

      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        initialOrderId={trackerOrderId}
      />

      <WoodGuideModal
        isOpen={isWoodGuideOpen}
        onClose={() => setIsWoodGuideOpen(false)}
      />

      {/* Three.js 3D Studio Modal */}
      <ThreeFurnitureStudio
        isOpen={isThreeStudioOpen}
        onClose={() => setIsThreeStudioOpen(false)}
      />

      {/* Interactive Carpentry Game */}
      <CarpentryWorkshopGame
        isOpen={isGameOpen}
        onClose={() => setIsGameOpen(false)}
      />

      {/* Gemini AI Assistant (Chat, Search, Maps, Transcribe) */}
      <AIAssistantModal
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        onOpenCustomizer={() => {
          setIsAIAssistantOpen(false);
          handleOpenCustomizer();
        }}
      />

      {/* Science & Dendrology Lab */}
      <ScienceTimberModal
        isOpen={isScienceOpen}
        onClose={() => setIsScienceOpen(false)}
      />

      {/* Footer */}
      <Footer
        onOpenCustomizer={() => handleOpenCustomizer()}
        onOpenBespoke={() => setIsBespokeOpen(true)}
        onOpenTracker={() => setIsTrackerOpen(true)}
        onOpenWoodGuide={() => setIsWoodGuideOpen(true)}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setIsCustomizerOpen(false);
          setIsSellerMode(false);
          window.scrollTo({ top: 300, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
