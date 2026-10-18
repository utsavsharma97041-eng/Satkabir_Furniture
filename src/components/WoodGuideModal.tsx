import React from 'react';
import { X, Compass, ShieldCheck, Sparkles, Check, Droplets, Sun } from 'lucide-react';

interface WoodGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WoodGuideModal: React.FC<WoodGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#dec099] p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-2 rounded-full hover:bg-stone-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#b98144] mb-1">
          <Compass className="w-4 h-4" />
          <span>Artisan Timber Knowledge</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#301a11] mb-2">
          Solid Wood & Timber Species Guide
        </h2>
        <p className="text-xs text-stone-600 mb-6 max-w-xl">
          At <strong>Satkkabir Furniture Udhyog</strong>, all logs are kiln-dried (moisture content 8%–12%) and vacuum pressure impregnated for termite resistance. Here is how our solid timbers compare:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-[#faf7f2] border border-[#cb9f6a]/60 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-[#301a11]">
                Sheesham Wood (Indian Rosewood)
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#7e4b2c] text-white">
                Best for Beds & Dining
              </span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Renowned for its dramatic, organic dark and golden brown swirl veins. High tensile strength, extremely dense (850 kg/m³), and naturally immune to dry-wood termites. It doesn't split, warp, or crack when kiln-seasoned.
            </p>
            <div className="text-[11px] text-stone-500 space-y-1 pt-1 border-t border-[#dec099]/40">
              <div className="flex justify-between">
                <span>Grain Pattern:</span> <strong className="text-stone-800">Bold dark knots & high contrast</strong>
              </div>
              <div className="flex justify-between">
                <span>Hardness:</span> <strong className="text-stone-800">Very High (Janka 1,780 lbf)</strong>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#faf7f2] border border-[#cb9f6a]/60 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-[#301a11]">
                CP Teak Wood (Sagwan)
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#b98144] text-white">
                Royal Heirloom Choice
              </span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              The king of timber in India. Rich in natural silica and teak essential oils that repel water, humidity, and fungus completely. Retains golden luster over generations and has the smoothest surface for intricate carvings.
            </p>
            <div className="text-[11px] text-stone-500 space-y-1 pt-1 border-t border-[#dec099]/40">
              <div className="flex justify-between">
                <span>Grain Pattern:</span> <strong className="text-stone-800">Straight, uniform golden teak grain</strong>
              </div>
              <div className="flex justify-between">
                <span>Water Resistance:</span> <strong className="text-emerald-700">100% Waterproof Natural Oils</strong>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#faf7f2] border border-[#cb9f6a]/60 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-[#301a11]">
                Mango Hardwood
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-200 text-stone-800">
                Eco-Sustainable
              </span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Harvested only after the mango tree finishes its fruit-bearing lifecycle. Features warm golden-amber streaks and light rustic character. Dense yet easy to shape, making it lightweight for study desks and accent coffee tables.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#faf7f2] border border-[#cb9f6a]/60 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-[#301a11]">
                Rosewood Special Heartwood
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#523314] text-white">
                Ultra-Luxury
              </span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Selected from centuries-old core heartwood logs with deep purple-black hues. Exceptionally resonant acoustic properties, mirror-shine finish capability, and authentic heirloom value passed down generations.
            </p>
          </div>
        </div>

        {/* Maintenance Guide */}
        <div className="bg-[#f5ede1] p-4 rounded-2xl border border-[#cb9f6a] text-xs text-stone-700 space-y-2">
          <span className="font-bold text-[#301a11] text-sm block">
            Carpentry Care & Longevity Advice:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="flex items-start gap-2">
              <Droplets className="w-4 h-4 text-[#7e4b2c] shrink-0 mt-0.5" />
              <span>Clean with dry cotton micro-fiber cloth. Avoid harsh chemical floor detergents.</span>
            </div>
            <div className="flex items-start gap-2">
              <Sun className="w-4 h-4 text-[#b98144] shrink-0 mt-0.5" />
              <span>Keep at least 6 inches away from direct AC blast vents and intense scorching sunlight.</span>
            </div>
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span>Re-buff with natural beeswax or linseed polish once every 3–5 years for lifelong glow.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
