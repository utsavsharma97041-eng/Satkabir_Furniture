import React, { useState } from 'react';
import { FurnitureProduct, CartItem } from '../types/furniture';
import { ReviewComponent } from './ReviewComponent';
import { PriceTrendChart } from './PriceTrendChart';
import {
  X,
  Sliders,
  ShoppingBag,
  Star,
  ShieldCheck,
  Truck,
  Layers,
  Sparkles,
  Share2,
  CheckCircle2,
  Maximize2,
  Hammer,
  Bell,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProductDetailModalProps {
  product: FurnitureProduct | null;
  currentUser?: any;
  onRequireLogin?: () => void;
  onClose: () => void;
  onCustomize: (productId: string) => void;
  onAddToCart: (item: CartItem) => void;
  onOpenNotifyModal?: (product: FurnitureProduct) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  currentUser,
  onRequireLogin,
  onClose,
  onCustomize,
  onAddToCart,
  onOpenNotifyModal,
}) => {
  if (!product) return null;

  const [activeImage, setActiveImage] = useState(product.imageUrl);
  const allImages = [product.imageUrl, ...(product.additionalImages || [])];

  const handleAddStandardToCart = () => {
    const item: CartItem = {
      id: `std-${product.id}-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      imageUrl: product.imageUrl,
      category: product.category,
      unitPrice: product.price,
      quantity: 1,
      isCustomized: false,
    };
    onAddToCart(item);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });
    onClose();
  };

  const handleLaunchCustomizer = () => {
    onCustomize(product.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#dec099] p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-2 rounded-full hover:bg-stone-100 transition z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left: Gallery (6 cols) */}
          <div className="md:col-span-6 space-y-4">
            <div className="aspect-4/3 rounded-2xl overflow-hidden border border-[#dec099]/80 shadow-inner bg-stone-100">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
            </div>

            {/* Thumbnail switcher */}
            {allImages.length > 1 && (
              <div className="flex gap-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition ${
                      activeImage === img ? 'border-[#7e4b2c] ring-2 ring-[#7e4b2c]/20' : 'border-stone-200'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Timber Specs Box */}
            <div className="p-4 bg-[#fcfaf7] rounded-xl border border-[#cb9f6a]/60 space-y-2 text-xs text-stone-700">
              <span className="font-bold text-[#683d28] uppercase text-[10px] tracking-wider block">
                Satkkabir Workshop Timber Verification:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-stone-400 text-[11px] block">Timber Type:</span>
                  <strong>{product.woodType}</strong>
                </div>
                <div>
                  <span className="text-stone-400 text-[11px] block">Default Finish:</span>
                  <strong>{product.finish}</strong>
                </div>
                <div>
                  <span className="text-stone-400 text-[11px] block">Structural Weight:</span>
                  <strong>~{product.weightKg} kg (Solid Heavy)</strong>
                </div>
                <div>
                  <span className="text-stone-400 text-[11px] block">Warranty:</span>
                  <strong>{product.warrantyYears} Years Solid Core</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Info & Actions (6 cols) */}
          <div className="md:col-span-6 space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-[#f5ede1] text-[#7e4b2c] text-[11px] font-bold uppercase tracking-wider">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-stone-700">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>{product.rating}</span>
                  <span className="text-stone-400">({product.reviewCount} Reviews)</span>
                </div>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#301a11]">
                {product.name}
              </h2>
              {product.hindiName && (
                <p className="text-sm font-medium text-[#b98144] mt-0.5">
                  {product.hindiName}
                </p>
              )}
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 p-3 bg-[#faf7f2] rounded-xl border border-[#dec099]/60">
              <span className="text-2xl sm:text-3xl font-sans font-extrabold text-[#7e4b2c]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="text-sm text-stone-400 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                Save {product.discountPercentage}%
              </span>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {product.description}
            </p>

            {/* Standard Dimensions Box */}
            <div className="p-3.5 rounded-xl border border-stone-200 bg-white">
              <div className="flex items-center justify-between text-xs font-bold text-stone-800 mb-2">
                <span className="flex items-center gap-1.5">
                  <Maximize2 className="w-4 h-4 text-[#7e4b2c]" />
                  Standard Workshop Dimensions:
                </span>
                <span className="text-[#b98144] font-medium text-[11px]">Can be customized</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-stone-50 p-2 rounded-lg border border-stone-100">
                  <span className="text-stone-400 text-[10px] block">Length</span>
                  <strong>{product.dimensions.length}" ({Math.round(product.dimensions.length / 12 * 10) / 10} ft)</strong>
                </div>
                <div className="bg-stone-50 p-2 rounded-lg border border-stone-100">
                  <span className="text-stone-400 text-[10px] block">Width / Depth</span>
                  <strong>{product.dimensions.width}" ({Math.round(product.dimensions.width / 12 * 10) / 10} ft)</strong>
                </div>
                <div className="bg-stone-50 p-2 rounded-lg border border-stone-100">
                  <span className="text-stone-400 text-[10px] block">Height</span>
                  <strong>{product.dimensions.height}" ({Math.round(product.dimensions.height / 12 * 10) / 10} ft)</strong>
                </div>
              </div>
            </div>

            {/* Features Checklist */}
            <div className="space-y-1.5 text-xs text-stone-600">
              {product.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Actions: Direct Customization Studio Launcher & Standard Buy */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleLaunchCustomizer}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#7e4b2c] to-[#9e6435] hover:from-[#683d28] hover:to-[#7e4b2c] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer ring-2 ring-[#dec099]/80"
              >
                <Sliders className="w-4 h-4 text-[#f5ede1]" />
                <span>Open in Custom Modification Studio (Modify Size & Wood)</span>
              </button>

              <button
                onClick={handleAddStandardToCart}
                className="w-full py-3 px-4 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 font-semibold text-xs flex items-center justify-center gap-2 transition"
              >
                <ShoppingBag className="w-4 h-4 text-[#7e4b2c]" />
                <span>Buy As-Is with Standard Specs</span>
              </button>

              {/* Notify Me on Price Drops & Restocks */}
              <button
                onClick={() => onOpenNotifyModal && onOpenNotifyModal(product)}
                className="w-full py-2.5 px-4 rounded-xl bg-[#faf7f2] hover:bg-[#f5ede1] text-[#7e4b2c] border border-[#cb9f6a]/70 font-semibold text-xs flex items-center justify-center gap-2 transition"
              >
                <Bell className="w-4 h-4 text-[#dec099]" />
                <span>Notify Me: Alert on Price Drops & Restocks</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-400 pt-2 border-t border-stone-100">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                Free In-Room Assembly
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#b98144]" />
                Direct Udhyog Factory Warranty
              </span>
            </div>
          </div>
        </div>

        {/* 6-Month Price Trend & Market Fluctuation Analysis */}
        <div className="pt-8 border-t border-stone-200">
          <PriceTrendChart
            currentPrice={product.price}
            originalPrice={product.originalPrice}
            productName={product.name}
          />
        </div>

        {/* Integrated Customer Reviews Section */}
        <ReviewComponent
          productId={product.id}
          productName={product.name}
          currentUser={currentUser}
          onRequireLogin={onRequireLogin || (() => {})}
        />
      </div>
    </div>
  );
};
