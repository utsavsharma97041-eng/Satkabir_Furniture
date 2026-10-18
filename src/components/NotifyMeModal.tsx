import React, { useState, useEffect } from 'react';
import { FurnitureProduct, ProductAlertSubscription, ProductAlertType } from '../types/furniture';
import { storageService } from '../services/storageService';
import {
  Bell,
  X,
  CheckCircle2,
  TrendingDown,
  Package,
  Mail,
  ShieldCheck,
  AlertCircle,
  Clock,
  Sparkles,
  Trash2,
} from 'lucide-react';

interface NotifyMeModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: FurnitureProduct | null;
  currentUserEmail?: string;
  onAlertSaved?: (alert: ProductAlertSubscription) => void;
}

export const NotifyMeModal: React.FC<NotifyMeModalProps> = ({
  isOpen,
  onClose,
  product,
  currentUserEmail,
  onAlertSaved,
}) => {
  const [email, setEmail] = useState('');
  const [notifyOnPriceDrop, setNotifyOnPriceDrop] = useState(true);
  const [notifyOnRestock, setNotifyOnRestock] = useState(true);
  const [targetPrice, setTargetPrice] = useState<number | ''>('');
  const [useTargetPrice, setUseTargetPrice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [existingAlert, setExistingAlert] = useState<ProductAlertSubscription | null>(null);

  // Initialize email & check for existing alert when modal opens or product changes
  useEffect(() => {
    if (!isOpen || !product) {
      setIsSuccess(false);
      setErrorMessage('');
      return;
    }

    const savedEmail = currentUserEmail || storageService.getSavedAlertEmail();
    if (savedEmail) {
      setEmail(savedEmail);
    }

    // Default target price suggestion: 10% lower than current price
    const suggestedTarget = Math.round((product.price * 0.9) / 500) * 500;
    setTargetPrice(suggestedTarget);

    // If stock is 0, restock alert is primary
    if (product.stockCount <= 0) {
      setNotifyOnRestock(true);
    }

    // Check if user already subscribed
    const alerts = storageService.getProductAlerts(savedEmail || undefined);
    const found = alerts.find((a) => a.productId === product.id && a.status === 'active');
    if (found) {
      setExistingAlert(found);
      setNotifyOnPriceDrop(found.notifyOnPriceDrop);
      setNotifyOnRestock(found.notifyOnRestock);
      if (found.targetPrice) {
        setUseTargetPrice(true);
        setTargetPrice(found.targetPrice);
      }
    } else {
      setExistingAlert(null);
    }
  }, [isOpen, product, currentUserEmail]);

  if (!isOpen || !product) return null;

  const isOutOfStock = product.stockCount <= 0;
  const isLowStock = product.stockCount > 0 && product.stockCount <= 3;

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your email address to receive notifications.');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address (e.g., name@example.com).');
      return;
    }

    if (!notifyOnPriceDrop && !notifyOnRestock) {
      setErrorMessage('Please select at least one alert type (Price Drop or Back in Stock).');
      return;
    }

    setIsSubmitting(true);

    try {
      let alertType: ProductAlertType = 'both';
      if (notifyOnPriceDrop && !notifyOnRestock) alertType = 'price_drop';
      else if (!notifyOnPriceDrop && notifyOnRestock) alertType = 'back_in_stock';

      const alertPayload: ProductAlertSubscription = {
        id: existingAlert?.id || `alert-${product.id}-${Date.now()}`,
        productId: product.id,
        productName: product.name,
        productImageUrl: product.imageUrl,
        userEmail: email.trim().toLowerCase(),
        alertType,
        currentPrice: product.price,
        targetPrice: useTargetPrice && typeof targetPrice === 'number' ? targetPrice : undefined,
        stockCountAtSubscription: product.stockCount,
        createdAt: new Date().toISOString(),
        status: 'active',
        notifyOnPriceDrop,
        notifyOnRestock,
      };

      await storageService.addProductAlert(alertPayload);
      setExistingAlert(alertPayload);
      setIsSuccess(true);
      if (onAlertSaved) {
        onAlertSaved(alertPayload);
      }
    } catch (err) {
      console.error('Failed to save alert:', err);
      setErrorMessage('Could not register notification alert. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveAlert = async () => {
    if (!existingAlert) return;
    setIsSubmitting(true);
    try {
      await storageService.removeProductAlert(existingAlert.id);
      setExistingAlert(null);
      setIsSuccess(false);
      setErrorMessage('');
      onClose();
    } catch (err) {
      console.error('Failed to remove alert:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#dec099] flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Strip */}
        <div className="bg-[#301a11] text-[#f5ede1] p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#f5ede1] transition"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#7e4b2c] border border-[#cb9f6a]/40 flex items-center justify-center text-[#dec099] shadow-md shrink-0">
              <Bell className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#dec099] bg-[#7e4b2c]/60 px-2 py-0.5 rounded">
                  Stock & Price Watch
                </span>
                {existingAlert && (
                  <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" /> Subscribed
                  </span>
                )}
              </div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-white mt-1">
                Notify Me: Price Drop & Restock
              </h2>
              <p className="text-xs text-[#dec099]/90">
                Direct factory workshop alerts from Satkkabir Furniture Udhyog
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Product Mini Spec Card */}
          <div className="flex items-center gap-4 p-3.5 bg-[#faf8f5] rounded-2xl border border-[#dec099]/60">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-[#dec099]/80 shrink-0 shadow-xs"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#b98144]">
                {product.category} &bull; {product.woodType.split('(')[0]}
              </span>
              <h4 className="font-serif font-bold text-stone-900 text-sm sm:text-base truncate">
                {product.name}
              </h4>

              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-base font-extrabold text-[#7e4b2c]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-stone-400 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  Save {product.discountPercentage}%
                </span>
              </div>

              {/* Stock status indicator */}
              <div className="mt-1.5 flex items-center gap-1.5 text-xs">
                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-bold text-[11px] border border-rose-200">
                    <Clock className="w-3 h-3" /> Currently Out of Stock
                  </span>
                ) : isLowStock ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-bold text-[11px] border border-amber-200">
                    <AlertCircle className="w-3 h-3" /> Only {product.stockCount} units remaining
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-medium text-[11px]">
                    <CheckCircle2 className="w-3 h-3" /> In Stock ({product.stockCount} ready in workshop)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Success State View */}
          {isSuccess ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-emerald-950 text-base">
                  Alert Active & Confirmed!
                </h3>
                <p className="text-xs text-emerald-800 mt-1 max-w-sm mx-auto">
                  We will email <strong>{email}</strong> instantly when the price drops below{' '}
                  {useTargetPrice && typeof targetPrice === 'number'
                    ? `₹${targetPrice.toLocaleString('en-IN')}`
                    : `₹${product.price.toLocaleString('en-IN')}`}{' '}
                  {notifyOnRestock && 'or when new handcrafted pieces arrive in the workshop'}.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition shadow-xs"
                >
                  Done
                </button>
                <button
                  type="button"
                  onClick={() => setIsSuccess(false)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white border border-emerald-300 text-emerald-900 font-semibold text-xs hover:bg-emerald-100/50 transition"
                >
                  Edit Alert Preferences
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Notification Preferences */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-stone-800 block">
                  Select What You Want To Be Notified About:
                </label>

                {/* Option 1: Price Drop Alert */}
                <div
                  onClick={() => setNotifyOnPriceDrop(!notifyOnPriceDrop)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    notifyOnPriceDrop
                      ? 'bg-[#fdfaf6] border-[#cb9f6a] shadow-xs'
                      : 'bg-white border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={notifyOnPriceDrop}
                    onChange={(e) => setNotifyOnPriceDrop(e.target.checked)}
                    className="mt-1 h-4 w-4 text-[#7e4b2c] rounded border-stone-300 focus:ring-[#7e4b2c]"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900">
                      <TrendingDown className="w-4 h-4 text-emerald-600" />
                      <span>Price Drop Alert</span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Get an automated notification if the factory price drops below{' '}
                      <span className="font-semibold text-stone-800">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      .
                    </p>

                    {/* Optional Target Price threshold */}
                    {notifyOnPriceDrop && (
                      <div
                        className="mt-2.5 pt-2 border-t border-[#dec099]/40 flex items-center justify-between gap-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <label className="flex items-center gap-1.5 text-[11px] font-medium text-stone-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={useTargetPrice}
                            onChange={(e) => setUseTargetPrice(e.target.checked)}
                            className="rounded text-[#7e4b2c] focus:ring-[#7e4b2c]"
                          />
                          <span>Specific target price:</span>
                        </label>

                        {useTargetPrice && (
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-[#7e4b2c]">₹</span>
                            <input
                              type="number"
                              value={targetPrice}
                              onChange={(e) =>
                                setTargetPrice(e.target.value ? Number(e.target.value) : '')
                              }
                              placeholder="e.g. 35000"
                              max={product.price - 100}
                              className="w-24 px-2 py-1 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#7e4b2c]"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Option 2: Back in Stock Alert */}
                <div
                  onClick={() => setNotifyOnRestock(!notifyOnRestock)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    notifyOnRestock
                      ? 'bg-[#fdfaf6] border-[#cb9f6a] shadow-xs'
                      : 'bg-white border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={notifyOnRestock}
                    onChange={(e) => setNotifyOnRestock(e.target.checked)}
                    className="mt-1 h-4 w-4 text-[#7e4b2c] rounded border-stone-300 focus:ring-[#7e4b2c]"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900">
                      <Package className="w-4 h-4 text-[#7e4b2c]" />
                      <span>Back in Stock & Restock Alert</span>
                      {isOutOfStock && (
                        <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded font-extrabold uppercase">
                          Currently Sold Out
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Receive an alert immediately when our carpentered batch is seasoned, polished, and ready for dispatch.
                    </p>
                  </div>
                </div>
              </div>

              {/* Email Input Field */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-bold text-stone-800 flex items-center justify-between">
                  <span>Your Email Address</span>
                  <span className="text-[10px] text-stone-400 font-normal">
                    Never shared or spammed
                  </span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="Enter your email (e.g. rahul@gmail.com)"
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#7e4b2c] bg-[#faf8f5]"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Guarantee badge */}
              <div className="flex items-center gap-2 text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Real-time direct factory inventory alert. Unsubscribe anytime with 1-click.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                {existingAlert && (
                  <button
                    type="button"
                    onClick={handleRemoveAlert}
                    disabled={isSubmitting}
                    className="py-3 px-3 rounded-xl bg-stone-100 hover:bg-rose-50 text-stone-600 hover:text-rose-600 transition text-xs font-semibold flex items-center justify-center gap-1.5 border border-stone-200"
                    title="Remove active alert"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Delete Alert</span>
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#7e4b2c] hover:bg-[#683d28] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-50"
                >
                  <Bell className="w-4 h-4 text-[#dec099]" />
                  <span>
                    {isSubmitting
                      ? 'Registering Alert...'
                      : existingAlert
                      ? 'Update Notification Alert'
                      : 'Notify Me'}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
