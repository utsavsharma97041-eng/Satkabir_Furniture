import React, { useState } from 'react';
import { CartItem } from '../types/furniture';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Tag,
  Check,
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
  onLaunchCustomizer: (productId?: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onLaunchCustomizer,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const discountAmount = Math.round(subtotal * (appliedDiscount / 100));
  const finalTotal = Math.max(subtotal - discountAmount, 0);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    const code = couponCode.trim().toUpperCase();
    if (code === 'SATKKABIR10' || code === 'FURNITURE10') {
      setAppliedDiscount(10);
      setCouponSuccess('10% Inaugural Woodcraft Discount Applied!');
    } else if (code === 'ROYAL5') {
      setAppliedDiscount(5);
      setCouponSuccess('5% Craft Discount Applied!');
    } else {
      setCouponError('Invalid coupon. Try SATKKABIR10');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#faf8f5] shadow-2xl flex flex-col border-l border-[#dec099]">
          {/* Header */}
          <div className="p-4 bg-white border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#7e4b2c]" />
              <h2 className="font-serif font-bold text-lg text-[#301a11]">
                Your Shopping Cart ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <p className="font-serif text-lg text-stone-700 mb-1">Your cart is empty</p>
                <p className="text-xs text-stone-500 mb-6 max-w-xs mx-auto">
                  Explore our handcrafted Sheesham & Teak solid wood catalog or build your custom pieces.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onLaunchCustomizer();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#7e4b2c] hover:bg-[#683d28] text-white text-xs font-semibold shadow-xs transition"
                >
                  Open Custom Modification Studio
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-3.5 border border-[#dec099]/70 shadow-xs relative flex flex-col justify-between gap-3"
                >
                  <div className="flex gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-20 h-20 rounded-lg object-cover border border-stone-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-stone-900 leading-snug line-clamp-1">
                          {item.productName}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-stone-400 hover:text-red-600 transition"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-[11px] text-stone-500">{item.category}</p>

                      {/* Customization Details Badge */}
                      {item.isCustomized && item.customizationDetails && (
                        <div className="mt-2 p-2 bg-[#fcfaf7] rounded-lg border border-[#cb9f6a]/40 text-[10px] text-stone-700 space-y-1">
                          <div className="flex items-center gap-1 font-semibold text-[#7e4b2c]">
                            <Sparkles className="w-3 h-3 text-[#b98144]" />
                            <span>Custom Modification Specifications:</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1 text-[10px] text-stone-600">
                            <div>
                              <span className="text-stone-400">Dimensions: </span>
                              <strong>
                                {item.customizationDetails.dimensions.length}" × {item.customizationDetails.dimensions.width}" × {item.customizationDetails.dimensions.height}"
                              </strong>
                            </div>
                            <div>
                              <span className="text-stone-400">Wood: </span>
                              <strong className="truncate block">
                                {item.customizationDetails.woodType.split('(')[0]}
                              </strong>
                            </div>
                            <div>
                              <span className="text-stone-400">Polish: </span>
                              <strong>{item.customizationDetails.finish}</strong>
                            </div>
                            {item.customizationDetails.fabric && (
                              <div>
                                <span className="text-stone-400">Fabric: </span>
                                <strong>{item.customizationDetails.fabric.split('-')[0]}</strong>
                              </div>
                            )}
                          </div>

                          {item.customizationDetails.addons.length > 0 && (
                            <div className="text-[10px] text-stone-500 pt-1 border-t border-stone-100">
                              <span className="font-semibold text-stone-700">Add-ons: </span>
                              {item.customizationDetails.addons.map((a) => a.name).join(', ')}
                            </div>
                          )}

                          {item.customizationDetails.customNotes && (
                            <div className="text-[10px] text-amber-900 bg-amber-50 p-1 rounded italic">
                              "{item.customizationDetails.customNotes}"
                            </div>
                          )}
                        </div>
                      )}

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm font-extrabold text-[#7e4b2c]">
                          ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                        </span>

                        <div className="flex items-center gap-2 border border-stone-200 rounded-lg bg-stone-50 p-1">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="p-1 rounded hover:bg-stone-200 text-stone-600 transition"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-stone-800 min-w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="p-1 rounded hover:bg-stone-200 text-stone-600 transition"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-4 bg-white border-t border-[#dec099]/80 space-y-3">
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon code (try SATKKABIR10)"
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#7e4b2c] uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#f5ede1] hover:bg-[#dec099] text-[#7e4b2c] font-bold text-xs rounded-lg transition"
                >
                  Apply
                </button>
              </form>

              {couponSuccess && (
                <p className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
                  <Check className="w-3 h-3" /> {couponSuccess}
                </p>
              )}
              {couponError && <p className="text-[11px] text-red-600">{couponError}</p>}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-stone-900">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount ({appliedDiscount}%):</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Delivery & Assembly:</span>
                  <span className="text-emerald-700 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#301a11] pt-1.5 border-t border-stone-200">
                  <span>Grand Total:</span>
                  <span className="text-lg font-serif font-extrabold text-[#7e4b2c]">
                    ₹{finalTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="pt-1">
                <button
                  onClick={() => {
                    onClose();
                    onProceedToCheckout();
                  }}
                  className="w-full py-3 rounded-xl bg-[#7e4b2c] hover:bg-[#683d28] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition"
                >
                  <span>Proceed to White-Glove Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>10-Year Timber Warranty • Free Installation Included</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
