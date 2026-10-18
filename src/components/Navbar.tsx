import React from 'react';
import {
  ShoppingBag,
  Sliders,
  FileText,
  Search,
  Hammer,
  Heart,
  ShieldCheck,
  Store,
  Compass,
  Box,
  Gamepad2,
  Bot,
  Atom,
  LogIn,
  LogOut,
  User as UserIcon,
} from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  currentUser: any;
  onLogin: () => void;
  onLogout: () => void;
  onOpenCart: () => void;
  onOpenCustomizer: (productId?: string) => void;
  onOpenBespoke: () => void;
  onOpenTracker: () => void;
  onOpenWoodGuide: () => void;
  onOpenThreeStudio: () => void;
  onOpenGame: () => void;
  onOpenAIAssistant: () => void;
  onOpenScience: () => void;
  onToggleSellerPortal: () => void;
  isSellerMode: boolean;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  wishlistCount,
  currentUser,
  onLogin,
  onLogout,
  onOpenCart,
  onOpenCustomizer,
  onOpenBespoke,
  onOpenTracker,
  onOpenWoodGuide,
  onOpenThreeStudio,
  onOpenGame,
  onOpenAIAssistant,
  onOpenScience,
  onToggleSellerPortal,
  isSellerMode,
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#faf8f5]/95 backdrop-blur-md border-b border-[#dec099]/70 transition-all">
      {/* Top Heritage Notice Bar */}
      <div className="bg-[#301a11] text-[#f5ede1] text-[11px] py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c28e46]" />
            <span className="font-medium">
              सत्कबीर फर्नीचर उद्योग • Direct Factory Workshop Prices • 100% Solid Kiln-Seasoned Hardwood
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-[11px] overflow-x-auto">
            <button
              onClick={onOpenThreeStudio}
              className="hover:text-[#cb9f6a] transition flex items-center gap-1 cursor-pointer whitespace-nowrap text-amber-300 font-bold"
            >
              <Box className="w-3.5 h-3.5" />
              <span>Three.js 3D View</span>
            </button>
            <button
              onClick={onOpenGame}
              className="hover:text-[#cb9f6a] transition flex items-center gap-1 cursor-pointer whitespace-nowrap text-emerald-300 font-bold"
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Workshop Game</span>
            </button>
            <button
              onClick={onOpenAIAssistant}
              className="hover:text-[#cb9f6a] transition flex items-center gap-1 cursor-pointer whitespace-nowrap text-sky-300 font-bold"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>AI Ustaad Ji</span>
            </button>
            <button
              onClick={onOpenScience}
              className="hover:text-[#cb9f6a] transition flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <Atom className="w-3.5 h-3.5" />
              <span>Timber Science</span>
            </button>
            <button
              onClick={onOpenTracker}
              className="hover:text-[#cb9f6a] transition flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <Hammer className="w-3 h-3" />
              <span>Track Order</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <div
          onClick={() => {
            if (isSellerMode) onToggleSellerPortal();
            onSelectCategory('All');
          }}
          className="cursor-pointer flex items-center gap-3 select-none shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7e4b2c] via-[#543323] to-[#301a11] text-[#dec099] flex items-center justify-center shadow-md border border-[#c28e46]/40">
            <Hammer className="w-5 h-5 text-[#f5ede1]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-xl sm:text-2xl font-black tracking-tight text-[#301a11]">
                Satkkabir
              </span>
              <span className="font-serif text-lg sm:text-xl font-normal italic text-[#9e6435]">
                Furniture Udhyog
              </span>
            </div>
            <p className="text-[10px] text-stone-500 font-medium tracking-wider uppercase -mt-0.5">
              Handcrafted Solid Wood • Custom Modification Studio
            </p>
          </div>
        </div>

        {/* Center / Right Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Flagship Custom Modification System Button */}
          <button
            onClick={() => onOpenCustomizer()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#7e4b2c] hover:bg-[#683d28] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer ring-2 ring-[#c28e46]/30"
          >
            <Sliders className="w-4 h-4 text-[#dec099]" />
            <span className="hidden sm:inline">Custom Modification Studio</span>
            <span className="sm:hidden">Customizer</span>
          </button>

          {/* Bespoke Blueprint Upload Button */}
          <button
            onClick={onOpenBespoke}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#cb9f6a] bg-[#fbf8f3] hover:bg-[#f5ede1] text-[#683d28] text-xs font-semibold transition cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-[#b98144]" />
            <span>Submit Blueprint</span>
          </button>

          {/* Seller / Workshop Mode Toggle */}
          <button
            onClick={onToggleSellerPortal}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition border cursor-pointer ${
              isSellerMode
                ? 'bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-400/40'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-300'
            }`}
            title="Switch between Customer Store and Seller / Workshop Admin"
          >
            <Store className="w-3.5 h-3.5 text-[#7e4b2c]" />
            <span className="hidden lg:inline">{isSellerMode ? 'Storefront' : 'Seller Portal'}</span>
          </button>

          {/* Firebase Google Auth Button */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 bg-[#f5ede1] p-1 rounded-xl border border-[#cb9f6a]">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'User'}
                  className="w-7 h-7 rounded-lg object-cover border border-white"
                />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-[#7e4b2c] text-white flex items-center justify-center text-xs font-bold">
                  {currentUser.displayName ? currentUser.displayName[0] : 'U'}
                </div>
              )}
              <span className="text-[11px] font-bold text-[#683d28] hidden xl:inline pr-1">
                {currentUser.displayName?.split(' ')[0] || 'User'}
              </span>
              <button
                onClick={onLogout}
                className="p-1 rounded-lg hover:bg-stone-200 text-stone-600 transition"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#dec099] hover:bg-[#faf7f2] text-xs font-semibold text-stone-700 shadow-xs transition"
              title="Sign In with Google"
            >
              <LogIn className="w-3.5 h-3.5 text-[#7e4b2c]" />
              <span className="hidden md:inline">Google Sign-in</span>
            </button>
          )}

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-xl bg-white border border-[#dec099] text-[#301a11] hover:bg-[#fbf8f3] transition shadow-xs cursor-pointer"
            title="View Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 text-[#7e4b2c]" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#b98144] text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
