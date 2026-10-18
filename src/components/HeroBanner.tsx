import React from 'react';
import { Sliders, Sparkles, ShieldCheck, Truck, Hammer, CheckCircle2 } from 'lucide-react';

interface HeroBannerProps {
  onOpenCustomizer: () => void;
  onOpenBespoke: () => void;
  onExploreCatalog: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onOpenCustomizer,
  onOpenBespoke,
  onExploreCatalog,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#f5ede1] via-[#faf7f2] to-[#faf8f5] border-b border-[#dec099]/60 py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      {/* Subtle organic wooden backdrop accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#c28e46]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#7e4b2c]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Headlines & Value Propositions (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fbf8f3] border border-[#cb9f6a] text-xs font-semibold text-[#683d28] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#b98144]" />
            <span>Master Craftsmen of Pure Sheesham & Teakwood Since 1998</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#301a11] leading-tight">
            Handcrafted Solid Wood Furniture, <span className="text-[#9e6435] italic">Tailored to Your Space.</span>
          </h1>

          <p className="text-stone-600 text-sm sm:text-base max-w-xl leading-relaxed">
            Welcome to <strong>Satkkabir Furniture Udhyog</strong>. Buy heirloom-grade solid wood furniture online, or use our interactive <strong>Custom Modification System</strong> to adjust dimensions, timber grade, polish, and fabric to match your exact room floor plan.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenCustomizer}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#7e4b2c] hover:bg-[#683d28] text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all active:scale-98 cursor-pointer ring-2 ring-[#cb9f6a]/40"
            >
              <Sliders className="w-4 h-4 text-[#dec099]" />
              <span>Launch Custom Modification Studio</span>
            </button>

            <button
              onClick={onOpenBespoke}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-[#fbf8f3] text-[#683d28] border border-[#dec099] text-sm font-semibold transition shadow-xs cursor-pointer"
            >
              <Hammer className="w-4 h-4 text-[#b98144]" />
              <span>Submit Custom Blueprint</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-[#dec099]/50 text-xs text-stone-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Seasoned Kiln-Dried Timber</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#b98144] shrink-0" />
              <span>10-Year Termite & Joint Warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#7e4b2c] shrink-0" />
              <span>Free In-Room White Glove Assembly</span>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Showcase Feature Card (5 cols) */}
        <div className="lg:col-span-5">
          <div className="relative rounded-2xl overflow-hidden border-2 border-[#dec099] shadow-2xl bg-white p-2">
            <img
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200&auto=format&fit=crop"
              alt="Satkkabir Furniture Udhyog Handcrafted Living Suite"
              className="w-full h-72 sm:h-84 object-cover rounded-xl"
            />
            <div className="absolute inset-x-4 bottom-4 p-4 rounded-xl bg-black/70 backdrop-blur-md text-white border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#dec099]">
                    Signature Piece
                  </span>
                  <h4 className="font-serif font-bold text-sm">Rajputana Solid Teakwood Suite</h4>
                </div>
                <button
                  onClick={onOpenCustomizer}
                  className="px-3 py-1.5 rounded-lg bg-[#b98144] hover:bg-[#a06c35] text-white text-xs font-semibold transition"
                >
                  Customize
                </button>
              </div>
              <p className="text-[11px] text-stone-200 mt-1 line-clamp-1">
                Custom dimensions, hydraulic under-storage & velvet choices available.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
