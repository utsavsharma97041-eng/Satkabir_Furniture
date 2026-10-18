import React, { useState, useEffect } from 'react';
import { FurnitureProduct, CartItem, ProductAlertSubscription, ProductAlertType } from '../types/furniture';
import { storageService } from '../services/storageService';
import {
  Sliders,
  ShoppingBag,
  Star,
  Maximize2,
  Heart,
  Check,
  ShieldCheck,
  Bell,
  Mail,
  CheckCircle2,
  TrendingDown,
  Package,
  AlertCircle,
  X,
  SlidersHorizontal,
} from 'lucide-react';

interface ProductCardProps {
  product: FurnitureProduct;
  isWishlisted: boolean;
  currentUserEmail?: string;
  onToggleWishlist: (id: string) => void;
  onSelectProduct: (product: FurnitureProduct) => void;
  onCustomizeProduct: (productId: string) => void;
  onQuickAddToCart: (item: CartItem) => void;
  onOpenNotifyModal?: (product: FurnitureProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  currentUserEmail,
  onToggleWishlist,
  onSelectProduct,
  onCustomizeProduct,
  onQuickAddToCart,
  onOpenNotifyModal,
}) => {
  // Inline 'Notify Me' state
  const [showInlineNotify, setShowInlineNotify] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifyPriceDrop, setNotifyPriceDrop] = useState(true);
  const [notifyRestock, setNotifyRestock] = useState(true);
  const [isSubmittingAlert, setIsSubmittingAlert] = useState(false);
  const [alertSuccessMsg, setAlertSuccessMsg] = useState('');
  const [alertErrorMsg, setAlertErrorMsg] = useState('');
  const [isAlertSubscribed, setIsAlertSubscribed] = useState(false);

  // Sync alert subscription status from storage
  useEffect(() => {
    const savedEmail = currentUserEmail || storageService.getSavedAlertEmail();
    if (savedEmail) {
      setNotifyEmail(savedEmail);
      setIsAlertSubscribed(storageService.isProductAlerted(product.id, savedEmail));
    } else {
      setIsAlertSubscribed(storageService.isProductAlerted(product.id));
    }
  }, [product.id, currentUserEmail]);

  const isOutOfStock = product.stockCount <= 0;
  const isLowStock = product.stockCount > 0 && product.stockCount <= 3;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) {
      // If out of stock, clicking quick-add opens the Notify Me inline prompt
      setShowInlineNotify(true);
      return;
    }

    const standardItem: CartItem = {
      id: `std-${product.id}-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      imageUrl: product.imageUrl,
      category: product.category,
      unitPrice: product.price,
      quantity: 1,
      isCustomized: false,
    };
    onQuickAddToCart(standardItem);
  };

  const handleToggleNotify = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenNotifyModal) {
      onOpenNotifyModal(product);
    } else {
      setShowInlineNotify(!showInlineNotify);
    }
  };

  const handleInlineNotifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAlertErrorMsg('');

    if (!notifyEmail.trim()) {
      setAlertErrorMsg('Please enter an email address.');
      return;
    }

    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(notifyEmail.trim());
    if (!isValid) {
      setAlertErrorMsg('Invalid email format.');
      return;
    }

    if (!notifyPriceDrop && !notifyRestock) {
      setAlertErrorMsg('Select at least one alert option.');
      return;
    }

    setIsSubmittingAlert(true);
    try {
      let alertType: ProductAlertType = 'both';
      if (notifyPriceDrop && !notifyRestock) alertType = 'price_drop';
      else if (!notifyPriceDrop && notifyRestock) alertType = 'back_in_stock';

      const alertPayload: ProductAlertSubscription = {
        id: `alert-${product.id}-${Date.now()}`,
        productId: product.id,
        productName: product.name,
        productImageUrl: product.imageUrl,
        userEmail: notifyEmail.trim().toLowerCase(),
        alertType,
        currentPrice: product.price,
        stockCountAtSubscription: product.stockCount,
        createdAt: new Date().toISOString(),
        status: 'active',
        notifyOnPriceDrop: notifyPriceDrop,
        notifyOnRestock: notifyRestock,
      };

      await storageService.addProductAlert(alertPayload);
      setIsAlertSubscribed(true);
      setAlertSuccessMsg(`Subscribed! We'll alert ${notifyEmail.trim()}`);
      setTimeout(() => {
        setShowInlineNotify(false);
        setAlertSuccessMsg('');
      }, 3000);
    } catch (err) {
      setAlertErrorMsg('Failed to save alert. Try again.');
    } finally {
      setIsSubmittingAlert(false);
    }
  };

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="group bg-white rounded-2xl border border-[#dec099]/70 hover:border-[#b98144] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative"
    >
      {/* Top Image & Badges */}
      <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 opacity-60" />

        {/* Category & Timber Badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          <span className="px-2.5 py-1 rounded-md bg-[#301a11]/90 backdrop-blur-xs text-[#f5ede1] text-[10px] font-bold tracking-wide uppercase shadow-xs">
            {product.woodType.split('(')[0]}
          </span>
          {product.bestseller && (
            <span className="px-2 py-0.5 rounded-md bg-[#b98144] text-white text-[9px] font-extrabold uppercase shadow-xs">
              Bestseller
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[9px] font-extrabold uppercase shadow-xs">
              Sold Out
            </span>
          )}
        </div>

        {/* Top Right Actions: Notify Me Bell & Wishlist Button */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {/* Notify Me Button */}
          <button
            onClick={handleToggleNotify}
            className={`p-2 rounded-full backdrop-blur-md transition-all shadow-xs ${
              isAlertSubscribed
                ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-400'
                : 'bg-white/80 text-stone-600 hover:bg-white hover:text-stone-900'
            }`}
            title={
              isAlertSubscribed
                ? 'Alert Active: Price Drop & Restock'
                : 'Notify Me: Get Price Drop & Restock Alerts'
            }
          >
            <Bell
              className={`w-4 h-4 ${
                isAlertSubscribed ? 'fill-amber-500 text-amber-700' : ''
              }`}
            />
          </button>

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-all shadow-xs ${
              isWishlisted
                ? 'bg-rose-50 text-rose-600'
                : 'bg-white/80 text-stone-600 hover:bg-white hover:text-stone-900'
            }`}
            title="Save to Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600' : ''}`} />
          </button>
        </div>

        {/* Dimensions Pill Bottom Left */}
        <div className="absolute bottom-3 left-3 text-[10px] text-white/90 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-md font-mono flex items-center gap-1">
          <Maximize2 className="w-3 h-3 text-[#dec099]" />
          <span>
            {product.dimensions.length}"L × {product.dimensions.width}"W × {product.dimensions.height}"H
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] font-semibold text-[#b98144] uppercase tracking-wider">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
              <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
              <span>{product.rating}</span>
              <span className="text-stone-400 font-normal">({product.reviewCount})</span>
            </div>
          </div>

          <h3 className="font-serif font-bold text-stone-900 text-base sm:text-lg group-hover:text-[#7e4b2c] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {product.hindiName && (
            <p className="text-[11px] text-stone-400 font-medium mb-1">
              {product.hindiName}
            </p>
          )}

          <p className="text-xs text-stone-500 line-clamp-2 mt-1">
            {product.description}
          </p>

          {/* Stock Notification Strip */}
          <div className="mt-2 flex items-center justify-between gap-2">
            {isOutOfStock ? (
              <span className="text-[11px] font-bold text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Only {product.stockCount} left
              </span>
            ) : (
              <span className="text-[11px] font-medium text-emerald-700 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> In Stock
              </span>
            )}

            {/* Quick 'Notify Me' text action */}
            <button
              onClick={handleToggleNotify}
              className={`text-[11px] font-semibold flex items-center gap-1 transition-colors px-2 py-0.5 rounded ${
                isAlertSubscribed
                  ? 'text-amber-800 bg-amber-50 hover:bg-amber-100'
                  : 'text-[#7e4b2c] hover:text-[#523314] hover:bg-[#faf8f5]'
              }`}
              title="Get price drop & restock alerts"
            >
              <Bell className="w-3 h-3" />
              <span>{isAlertSubscribed ? 'Alert Active ✓' : 'Notify Me'}</span>
            </button>
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-3 mt-3 border-t border-stone-100">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-lg sm:text-xl font-sans font-extrabold text-[#7e4b2c]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-stone-400 line-through ml-2">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Save {product.discountPercentage}%
            </span>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2">
            {/* Direct Customizer Launch */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCustomizeProduct(product.id);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#f5ede1] hover:bg-[#dec099] text-[#683d28] font-bold text-xs transition border border-[#cb9f6a] shadow-xs active:scale-98"
            >
              <Sliders className="w-3.5 h-3.5 text-[#7e4b2c]" />
              <span>Customize Piece</span>
            </button>

            {/* If out of stock, primary action is Notify Me */}
            {isOutOfStock ? (
              <button
                onClick={handleToggleNotify}
                className="py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs active:scale-98"
                title="Notify Me When In Stock"
              >
                <Bell className="w-4 h-4 text-[#dec099]" />
                <span>Notify</span>
              </button>
            ) : (
              /* Quick Buy standard */
              <button
                onClick={handleQuickAdd}
                className="p-2.5 rounded-xl bg-[#7e4b2c] hover:bg-[#683d28] text-white transition shadow-xs active:scale-98"
                title="Add Standard Item to Cart"
              >
                <ShoppingBag className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Inline Quick 'Notify Me' Drawer Popover on Product Card */}
      {showInlineNotify && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute inset-x-2 bottom-2 bg-[#301a11] text-[#f5ede1] p-4 rounded-2xl shadow-2xl border border-[#dec099] z-20 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-[#dec099]" />
              <span className="font-serif font-bold text-xs text-white">
                Notify Me: Price & Stock
              </span>
            </div>
            <button
              onClick={() => setShowInlineNotify(false)}
              className="text-stone-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11px] text-[#dec099]/90 mb-3">
            Enter your email to receive an alert if the price drops below ₹
            {product.price.toLocaleString('en-IN')} or when restocked.
          </p>

          {alertSuccessMsg ? (
            <div className="bg-emerald-900/60 border border-emerald-500/50 text-emerald-200 p-2.5 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{alertSuccessMsg}</span>
            </div>
          ) : (
            <form onSubmit={handleInlineNotifySubmit} className="space-y-2.5">
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={notifyEmail}
                  onChange={(e) => {
                    setNotifyEmail(e.target.value);
                    setAlertErrorMsg('');
                  }}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#dec099]"
                  required
                />
              </div>

              {/* Quick toggle chips */}
              <div className="flex items-center gap-2 text-[10px]">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyPriceDrop}
                    onChange={(e) => setNotifyPriceDrop(e.target.checked)}
                    className="rounded text-[#7e4b2c] focus:ring-0 h-3 w-3"
                  />
                  <span>Price Drop</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyRestock}
                    onChange={(e) => setNotifyRestock(e.target.checked)}
                    className="rounded text-[#7e4b2c] focus:ring-0 h-3 w-3"
                  />
                  <span>Back in Stock</span>
                </label>
              </div>

              {alertErrorMsg && (
                <p className="text-[10px] text-rose-300">{alertErrorMsg}</p>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  disabled={isSubmittingAlert}
                  className="flex-1 py-1.5 px-3 rounded-xl bg-[#7e4b2c] hover:bg-[#9e6435] text-white text-xs font-bold transition flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  <Bell className="w-3 h-3 text-[#dec099]" />
                  <span>{isSubmittingAlert ? 'Saving...' : 'Set Alert'}</span>
                </button>
                {onOpenNotifyModal && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowInlineNotify(false);
                      onOpenNotifyModal(product);
                    }}
                    className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#f5ede1] text-[10px] transition"
                    title="Open full options"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
