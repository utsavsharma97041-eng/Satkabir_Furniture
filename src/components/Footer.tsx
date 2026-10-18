import React from 'react';
import { Hammer, Phone, Mail, MapPin, ShieldCheck, Heart, Sparkles, MessageSquare } from 'lucide-react';

interface FooterProps {
  onOpenCustomizer: () => void;
  onOpenBespoke: () => void;
  onOpenTracker: () => void;
  onOpenWoodGuide: () => void;
  onSelectCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenCustomizer,
  onOpenBespoke,
  onOpenTracker,
  onOpenWoodGuide,
  onSelectCategory,
}) => {
  return (
    <footer className="bg-[#241711] text-[#dec099] border-t border-[#7e4b2c]/40 mt-16">
      {/* Workshop Promise Strip */}
      <div className="border-b border-[#523314] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3d2417] text-[#c28e46] flex items-center justify-center shrink-0 border border-[#7e4b2c]/60">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-white">10-Year Solid Core Warranty</h4>
              <p className="text-xs text-[#dec099]/70 mt-0.5">
                Full structural timber coverage against termites, borers, and joint failure.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3d2417] text-[#c28e46] flex items-center justify-center shrink-0 border border-[#7e4b2c]/60">
              <Hammer className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-white">Direct Workshop Pricing</h4>
              <p className="text-xs text-[#dec099]/70 mt-0.5">
                Manufactured in our own sawmill & carpentry bays. Zero retail showroom markups.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3d2417] text-[#c28e46] flex items-center justify-center shrink-0 border border-[#7e4b2c]/60">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-white">Custom Size Guaranteed</h4>
              <p className="text-xs text-[#dec099]/70 mt-0.5">
                Precision laser cutting to fit exact wall measurements, pillars, and room angles.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3d2417] text-[#c28e46] flex items-center justify-center shrink-0 border border-[#7e4b2c]/60">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-white">Carpenter Direct WhatsApp</h4>
              <p className="text-xs text-[#dec099]/70 mt-0.5">
                Send room photos & receive instant CAD blueprint estimates within hours.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#523314] text-[#dec099] flex items-center justify-center border border-[#7e4b2c]">
                <Hammer className="w-5 h-5" />
              </div>
              <span className="font-serif text-xl font-bold text-white tracking-wide">
                Satkkabir Furniture Udhyog
              </span>
            </div>
            <p className="text-xs text-[#dec099]/80 leading-relaxed max-w-sm">
              सत्कबीर फर्नीचर उद्योग — Dedicated to the timeless art of Indian solid wood carpentry. We transform raw kiln-seasoned Sheesham and Teak into handcrafted heirloom furnishings customized precisely for your home.
            </p>
            <div className="space-y-1.5 text-xs text-[#dec099]/90 pt-1">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#c28e46]" />
                <span>Satkkabir Furniture Udhyog, Main Industrial Furniture Cluster, Workshop Bay 4-7</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#c28e46]" />
                <span>+91 98290 12345 • Master Craftsman Direct Line</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#c28e46]" />
                <span>craft@satkkabirfurniture.com</span>
              </p>
            </div>
          </div>

          {/* Quick Categories (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider">
              Furniture Collections
            </h4>
            <ul className="space-y-2 text-xs text-[#dec099]/80">
              <li>
                <button
                  onClick={() => onSelectCategory('Living Room')}
                  className="hover:text-white transition"
                >
                  Living Room Suites & Teak Sofas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Bedroom')}
                  className="hover:text-white transition"
                >
                  Solid Sheesham King & Queen Beds
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Dining & Kitchen')}
                  className="hover:text-white transition"
                >
                  6-Seater & 8-Seater Dining Sets
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Pooja Mandir')}
                  className="hover:text-white transition"
                >
                  Carved Teakwood Pooja Mandirs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Study & Office')}
                  className="hover:text-white transition"
                >
                  Executive Desks & Bookshelves
                </button>
              </li>
            </ul>
          </div>

          {/* Custom Studio & Tools (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider">
              Custom Modification Services
            </h4>
            <ul className="space-y-2 text-xs text-[#dec099]/80">
              <li>
                <button
                  onClick={onOpenCustomizer}
                  className="text-[#c28e46] hover:text-[#e3b478] font-semibold transition flex items-center gap-1.5"
                >
                  <span>Interactive 2.5D Customizer Studio</span>
                  <span>→</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenBespoke}
                  className="hover:text-white transition"
                >
                  Submit Bespoke Blueprint or Photo
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTracker}
                  className="hover:text-white transition"
                >
                  Track Workshop Carpentry Order
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenWoodGuide}
                  className="hover:text-white transition"
                >
                  Solid Sheesham vs Teak Timber Guide
                </button>
              </li>
            </ul>

            <div className="pt-3">
              <span className="text-[11px] text-[#dec099]/60 block mb-1">
                Direct WhatsApp Consultation:
              </span>
              <a
                href="https://wa.me/919829012345?text=Hello%20Satkkabir%20Furniture%20Udhyog,%20I%20want%20to%20discuss%20custom%20furniture."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold transition"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>+91 98290 12345 (WhatsApp)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-[#523314] flex flex-wrap items-center justify-between gap-4 text-xs text-[#dec099]/60">
          <p>© {new Date().getFullYear()} Satkkabir Furniture Udhyog. All rights reserved. Handcrafted in India.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>100% Seasoned Hardwood</span>
            <span>•</span>
            <span>Kiln Dried Quality Passed</span>
            <span>•</span>
            <span>White Glove Delivery Across India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
