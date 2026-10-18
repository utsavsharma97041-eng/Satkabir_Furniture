import React, { useState, useEffect, useMemo } from 'react';
import {
  FurnitureProduct,
  WoodType,
  PolishFinish,
  FabricType,
  CartItem,
} from '../types/furniture';
import { CUSTOM_ADDONS } from '../data/mockFurniture';
import { InteractiveFurnitureCanvas } from './InteractiveFurnitureCanvas';
import {
  Sliders,
  Sparkles,
  ShoppingBag,
  Share2,
  Check,
  Info,
  Layers,
  ShieldCheck,
  Clock,
  Printer,
  ChevronRight,
  Maximize,
  Hammer,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CustomizerStudioProps {
  products: FurnitureProduct[];
  initialProductId?: string;
  onAddToCart: (item: CartItem) => void;
  onClose?: () => void;
}

const WOOD_RATES: Record<WoodType, { multiplier: number; description: string; density: string; tag: string }> = {
  'Sheesham Wood (Indian Rosewood)': {
    multiplier: 1.0,
    description: 'High-density timber with distinct rich dark swirl grain. Naturally termite-resistant.',
    density: '850 kg/m³',
    tag: 'Signature Choice',
  },
  'CP Teak Wood (Sagwan)': {
    multiplier: 1.28,
    description: 'Golden-yellow to dark brown royal timber with high natural oil content. 100% water immune.',
    density: '720 kg/m³',
    tag: 'Royal Heirloom',
  },
  'Mango Wood': {
    multiplier: 0.88,
    description: 'Eco-sustainable hardwood with golden warmth and rustic character. Lightweight & sturdy.',
    density: '680 kg/m³',
    tag: 'Rustic Value',
  },
  'Rosewood (Shisham Special)': {
    multiplier: 1.35,
    description: 'Deep purple-brown core heartwood with luxury acoustic depth and mirror-finish capability.',
    density: '900 kg/m³',
    tag: 'Ultra-Luxury',
  },
  'Acacia Hardwood': {
    multiplier: 0.92,
    description: 'Dense heavy grain with high compressive strength, ideal for heavy utilitarian frameworks.',
    density: '760 kg/m³',
    tag: 'High Durability',
  },
};

const POLISH_OPTIONS: { name: PolishFinish; color: string; desc: string }[] = [
  { name: 'Honey Teak Matte', color: '#c28e46', desc: 'Warm natural honey glow with non-reflective matte seal' },
  { name: 'Rich Walnut Satin', color: '#5a3825', desc: 'Deep royal chocolate brown with soft silk sheen' },
  { name: 'Natural Teak Gloss', color: '#d49b4f', desc: 'Clear lacquer revealing original raw golden wood veins' },
  { name: 'Dark Mahogany', color: '#44211a', desc: 'Sophisticated wine-tinted dark heartwood finish' },
  { name: 'Distressed Antique Brown', color: '#6e5138', desc: 'Hand-rubbed vintage heritage haveli look' },
  { name: 'Raw Organic Waxed', color: '#d9be9b', desc: 'Beeswax hand polish preserving natural wood tactile texture' },
];

const FABRIC_OPTIONS: { name: FabricType; color: string; type: string }[] = [
  { name: 'Royal Velvet - Emerald Green', color: '#134e3f', type: 'Luxury Velvet' },
  { name: 'Royal Velvet - Royal Navy', color: '#1e3a5f', type: 'Luxury Velvet' },
  { name: 'Royal Velvet - Mustard Gold', color: '#c89224', type: 'Luxury Velvet' },
  { name: 'Pure Organic Linen - Warm Beige', color: '#dcd1c2', type: 'Breathable Linen' },
  { name: 'Premium Leatherette - Tan Cognac', color: '#9a5327', type: 'Waterproof Leather' },
  { name: 'Premium Leatherette - Espresso', color: '#382318', type: 'Dark Leatherette' },
  { name: 'Textured Jute Blend - Natural Grey', color: '#8e8b82', type: 'Earthy Jute Blend' },
  { name: 'No Fabric / Pure Wood', color: '#8b5a2b', type: 'All-Wood Carving' },
];

export const CustomizerStudio: React.FC<CustomizerStudioProps> = ({
  products,
  initialProductId,
  onAddToCart,
  onClose,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(
    initialProductId || products[0]?.id || ''
  );

  const activeProduct = useMemo(
    () => products.find((p) => p.id === selectedProductId) || products[0],
    [products, selectedProductId]
  );

  // Customization state
  const [woodType, setWoodType] = useState<WoodType>(activeProduct?.woodType || 'Sheesham Wood (Indian Rosewood)');
  const [finish, setFinish] = useState<PolishFinish>(activeProduct?.finish || 'Honey Teak Matte');
  const [fabric, setFabric] = useState<FabricType>(
    activeProduct?.availableFabrics?.[0] || 'No Fabric / Pure Wood'
  );

  const [lengthInches, setLengthInches] = useState<number>(activeProduct?.dimensions.length || 72);
  const [widthInches, setWidthInches] = useState<number>(activeProduct?.dimensions.width || 36);
  const [heightInches, setHeightInches] = useState<number>(activeProduct?.dimensions.height || 36);

  const [carvingStyle, setCarvingStyle] = useState<
    'Modern Minimalist' | 'Traditional Floral Carving' | 'Geometric Jali Work' | 'Royal Heritage Brass Inlay'
  >('Modern Minimalist');

  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [customNotes, setCustomNotes] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'dimensions' | 'wood' | 'fabric' | 'hardware'>('dimensions');
  const [addedSuccess, setAddedSuccess] = useState(false);

  // When product changes, reset to its defaults
  useEffect(() => {
    if (activeProduct) {
      setWoodType(activeProduct.woodType);
      setFinish(activeProduct.finish);
      setFabric(activeProduct.availableFabrics?.[0] || 'No Fabric / Pure Wood');
      setLengthInches(activeProduct.dimensions.length);
      setWidthInches(activeProduct.dimensions.width);
      setHeightInches(activeProduct.dimensions.height);
      setSelectedAddons([]);
      setAddedSuccess(false);
    }
  }, [activeProduct]);

  // Dynamic Price Calculation
  const priceBreakdown = useMemo(() => {
    if (!activeProduct) return { basePrice: 0, timberDelta: 0, woodTypeDelta: 0, addonsSum: 0, total: 0 };

    const baseL = activeProduct.dimensions.length || 1;
    const baseW = activeProduct.dimensions.width || 1;
    const baseH = activeProduct.dimensions.height || 1;

    const baseVolume = baseL * baseW * baseH;
    const currentVolume = lengthInches * widthInches * heightInches;
    const volumeRatio = currentVolume / baseVolume;

    // Timber volume impact (scaled 40% of base price varies with timber volume)
    const timberDelta = Math.round(activeProduct.price * 0.45 * (volumeRatio - 1));

    // Wood rate multiplier
    const woodRateInfo = WOOD_RATES[woodType] || { multiplier: 1.0 };
    const woodTypeDelta = Math.round(activeProduct.price * (woodRateInfo.multiplier - 1));

    // Addons cost
    const addonsSum = selectedAddons.reduce((acc, addonId) => {
      const match = CUSTOM_ADDONS.find((a) => a.id === addonId);
      return acc + (match ? match.price : 0);
    }, 0);

    // Carving style cost
    let carvingCost = 0;
    if (carvingStyle === 'Traditional Floral Carving') carvingCost = 2500;
    if (carvingStyle === 'Geometric Jali Work') carvingCost = 1800;
    if (carvingStyle === 'Royal Heritage Brass Inlay') carvingCost = 3500;

    const total = Math.max(
      Math.round(activeProduct.price + timberDelta + woodTypeDelta + addonsSum + carvingCost),
      activeProduct.price * 0.6
    );

    return {
      basePrice: activeProduct.price,
      timberDelta,
      woodTypeDelta,
      addonsSum: addonsSum + carvingCost,
      total,
    };
  }, [activeProduct, lengthInches, widthInches, heightInches, woodType, selectedAddons, carvingStyle]);

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddToCart = () => {
    if (!activeProduct) return;

    const selectedAddonObjects = selectedAddons.map((id) => {
      const a = CUSTOM_ADDONS.find((item) => item.id === id)!;
      return { id: a.id, name: a.name, price: a.price };
    });

    const customizedCartItem: CartItem = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      productId: activeProduct.id,
      productName: `${activeProduct.name} (Custom Modified)`,
      imageUrl: activeProduct.imageUrl,
      category: activeProduct.category,
      unitPrice: priceBreakdown.total,
      quantity: 1,
      isCustomized: true,
      customizationDetails: {
        woodType,
        finish,
        fabric,
        dimensions: {
          length: lengthInches,
          width: widthInches,
          height: heightInches,
        },
        addons: selectedAddonObjects,
        carvingStyle,
        customNotes: customNotes.trim() || undefined,
      },
    };

    onAddToCart(customizedCartItem);
    setAddedSuccess(true);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
    });
    setTimeout(() => setAddedSuccess(false), 4000);
  };

  const shareViaWhatsApp = () => {
    const text = `*Custom Modification Request - Satkkabir Furniture Udhyog*
Product: ${activeProduct.name}
Wood Type: ${woodType}
Finish: ${finish}
Fabric: ${fabric}
Dimensions: ${lengthInches}" L × ${widthInches}" W × ${heightInches}" H
Carving: ${carvingStyle}
Add-ons: ${selectedAddons.length > 0 ? selectedAddons.join(', ') : 'None'}
Estimated Price: ₹${priceBreakdown.total.toLocaleString('en-IN')}
Notes: ${customNotes || 'N/A'}`;

    const url = `https://wa.me/919829012345?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const printSpecSheet = () => {
    window.print();
  };

  // Quick preset sizes according to category
  const renderPresets = () => {
    if (activeProduct.category === 'Bedroom') {
      return (
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="text-xs text-stone-500 self-center mr-1">Quick Presets:</span>
          <button
            onClick={() => {
              setLengthInches(78);
              setWidthInches(60);
              setHeightInches(44);
            }}
            className="text-xs px-2.5 py-1 rounded bg-[#f5ede1] hover:bg-[#dec099] transition text-[#683d28]"
          >
            Queen (60"×78")
          </button>
          <button
            onClick={() => {
              setLengthInches(82);
              setWidthInches(76);
              setHeightInches(48);
            }}
            className="text-xs px-2.5 py-1 rounded bg-[#f5ede1] hover:bg-[#dec099] transition text-[#683d28]"
          >
            King (76"×82")
          </button>
          <button
            onClick={() => {
              setLengthInches(84);
              setWidthInches(80);
              setHeightInches(52);
            }}
            className="text-xs px-2.5 py-1 rounded bg-[#f5ede1] hover:bg-[#dec099] transition text-[#683d28]"
          >
            Super Grand King (80"×84")
          </button>
        </div>
      );
    }
    if (activeProduct.category === 'Dining & Kitchen') {
      return (
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="text-xs text-stone-500 self-center mr-1">Quick Presets:</span>
          <button
            onClick={() => {
              setLengthInches(48);
              setWidthInches(36);
              setHeightInches(30);
            }}
            className="text-xs px-2.5 py-1 rounded bg-[#f5ede1] hover:bg-[#dec099] transition text-[#683d28]"
          >
            4-Seater (48"×36")
          </button>
          <button
            onClick={() => {
              setLengthInches(68);
              setWidthInches(38);
              setHeightInches(30);
            }}
            className="text-xs px-2.5 py-1 rounded bg-[#f5ede1] hover:bg-[#dec099] transition text-[#683d28]"
          >
            6-Seater (68"×38")
          </button>
          <button
            onClick={() => {
              setLengthInches(96);
              setWidthInches(42);
              setHeightInches(30);
            }}
            className="text-xs px-2.5 py-1 rounded bg-[#f5ede1] hover:bg-[#dec099] transition text-[#683d28]"
          >
            8-Seater (96"×42")
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#faf8f5] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500 uppercase tracking-wider mb-1">
              <span>Satkkabir Furniture Udhyog</span>
              <span>/</span>
              <span className="text-[#b98144] font-semibold">Carpentry Customization Studio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#301a11]">
              Custom Modification & Bespoke Studio
            </h1>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl">
              Modify dimensions, timber grade, polish, fabrics, and hardware fittings. Our master craftsmen build exactly to your room measurements.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={printSpecSheet}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#dec099] bg-white text-xs font-medium text-stone-700 hover:bg-[#fbf8f3] transition shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-stone-500" />
              <span>Print Specs</span>
            </button>
            <button
              onClick={shareViaWhatsApp}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp Craft Team</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-3 py-2 rounded-lg bg-stone-200 hover:bg-stone-300 text-xs font-semibold text-stone-700"
              >
                Back to Store
              </button>
            )}
          </div>
        </div>

        {/* Model Selector Pill Bar */}
        <div className="bg-white p-3 rounded-xl border border-[#dec099]/70 shadow-xs mb-6">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-[#683d28] uppercase tracking-wide flex items-center gap-1.5">
              <Hammer className="w-3.5 h-3.5 text-[#b98144]" />
              Choose Base Furniture Template to Modify:
            </span>
            <span className="text-xs text-stone-500">
              Showing {products.length} Handcrafted Base Designs
            </span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {products.map((prod) => (
              <button
                key={prod.id}
                onClick={() => setSelectedProductId(prod.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                  prod.id === activeProduct.id
                    ? 'bg-[#7e4b2c] text-white border-[#7e4b2c] shadow-sm'
                    : 'bg-[#fcfbf9] text-stone-700 border-[#dec099]/50 hover:bg-[#f5ede1]'
                }`}
              >
                <img
                  src={prod.imageUrl}
                  alt={prod.name}
                  className="w-6 h-6 rounded object-cover border border-white/20"
                />
                <span>{prod.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded ${
                    prod.id === activeProduct.id ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  ₹{(prod.price / 1000).toFixed(1)}k
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Studio Grid: Visual Canvas & Customizer Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive 2.5D Canvas & Real-time Live Preview (5 cols) */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
            <div className="bg-white p-4 rounded-2xl border border-[#dec099]/80 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#683d28] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#b98144]" />
                  Real-time Visual Configurator
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Live CAD Preview
                </span>
              </div>

              {/* Visual SVG Canvas */}
              <InteractiveFurnitureCanvas
                category={activeProduct.category}
                woodType={woodType}
                finish={finish}
                fabric={fabric}
                dimensions={{
                  length: lengthInches,
                  width: widthInches,
                  height: heightInches,
                  unit: 'inches',
                }}
                carvingStyle={carvingStyle}
                selectedAddons={selectedAddons}
              />

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  100% Solid Kiln-Dried Wood
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#b98144]" />
                  Workshop Crafting: ~{activeProduct.craftingTimeDays + 3} Days
                </span>
              </div>
            </div>

            {/* Live Pricing Breakdown Card */}
            <div className="bg-[#fcfaf7] p-5 rounded-2xl border border-[#cb9f6a]/60 shadow-sm">
              <h3 className="font-serif font-bold text-lg text-[#301a11] mb-3 flex items-center justify-between">
                <span>Custom Build Estimation</span>
                <span className="text-2xl font-sans font-extrabold text-[#7e4b2c]">
                  ₹{priceBreakdown.total.toLocaleString('en-IN')}
                </span>
              </h3>

              <div className="space-y-2 text-xs border-y border-[#dec099]/60 py-3 mb-3">
                <div className="flex justify-between text-stone-600">
                  <span>Base Model ({activeProduct.name}):</span>
                  <span className="font-medium text-stone-900">
                    ₹{priceBreakdown.basePrice.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between text-stone-600">
                  <span className="flex items-center gap-1">
                    Timber Volume Adjustment:
                    <span className="text-[10px] text-stone-400">({lengthInches}"×{widthInches}"×{heightInches}")</span>
                  </span>
                  <span className={`font-semibold ${priceBreakdown.timberDelta >= 0 ? 'text-stone-800' : 'text-emerald-700'}`}>
                    {priceBreakdown.timberDelta >= 0 ? `+₹${priceBreakdown.timberDelta.toLocaleString('en-IN')}` : `-₹${Math.abs(priceBreakdown.timberDelta).toLocaleString('en-IN')}`}
                  </span>
                </div>

                <div className="flex justify-between text-stone-600">
                  <span>Selected Timber ({woodType.split('(')[0]}):</span>
                  <span className="font-semibold text-stone-800">
                    {priceBreakdown.woodTypeDelta >= 0
                      ? `+₹${priceBreakdown.woodTypeDelta.toLocaleString('en-IN')}`
                      : `-₹${Math.abs(priceBreakdown.woodTypeDelta).toLocaleString('en-IN')}`}
                  </span>
                </div>

                {priceBreakdown.addonsSum > 0 && (
                  <div className="flex justify-between text-stone-600">
                    <span>Hardware, Inlays & Carvings:</span>
                    <span className="font-semibold text-emerald-800">
                      +₹{priceBreakdown.addonsSum.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-stone-600">
                  <span>Finishing & Heat/Water Protection:</span>
                  <span className="text-emerald-700 font-semibold">Included (Complimentary)</span>
                </div>

                <div className="flex justify-between text-stone-600">
                  <span>White Glove Assembly & Placement:</span>
                  <span className="text-emerald-700 font-semibold">FREE</span>
                </div>
              </div>

              {addedSuccess && (
                <div className="mb-3 p-2.5 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-700" />
                  Customized build successfully added to your Cart!
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#7e4b2c] hover:bg-[#683d28] text-white font-semibold text-sm transition-all shadow-md active:scale-98 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add Custom Piece to Cart</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Customization Controls & Sliders (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#dec099]/80 shadow-md">
            {/* Customizer Tabs */}
            <div className="flex border-b border-stone-200 mb-6 gap-2 sm:gap-4 overflow-x-auto">
              <button
                onClick={() => setActiveTab('dimensions')}
                className={`flex items-center gap-2 pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'dimensions'
                    ? 'border-[#7e4b2c] text-[#7e4b2c]'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>1. Dimensions & Scale</span>
              </button>
              <button
                onClick={() => setActiveTab('wood')}
                className={`flex items-center gap-2 pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'wood'
                    ? 'border-[#7e4b2c] text-[#7e4b2c]'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <Hammer className="w-4 h-4" />
                <span>2. Wood & Polish Finish</span>
              </button>
              <button
                onClick={() => setActiveTab('fabric')}
                className={`flex items-center gap-2 pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'fabric'
                    ? 'border-[#7e4b2c] text-[#7e4b2c]'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>3. Upholstery & Carving</span>
              </button>
              <button
                onClick={() => setActiveTab('hardware')}
                className={`flex items-center gap-2 pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'hardware'
                    ? 'border-[#7e4b2c] text-[#7e4b2c]'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>4. Hardware Add-ons</span>
              </button>
            </div>

            {/* TAB 1: Dimensions & Scale */}
            {activeTab === 'dimensions' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#301a11] mb-1">
                    Custom Dimension Adjustments
                  </h3>
                  <p className="text-xs text-stone-500 mb-4">
                    Adjust length, depth, and height to match your specific room layout. Pricing adjusts automatically with timber board-feet volume.
                  </p>
                  {renderPresets()}
                </div>

                {/* Length Slider */}
                <div className="bg-[#fcfaf7] p-4 rounded-xl border border-[#dec099]/60">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-[#683d28]">
                      Length (Frontage):
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono font-extrabold text-[#7e4b2c]">
                        {lengthInches} inches
                      </span>
                      <span className="text-xs text-stone-500 font-medium bg-white px-2 py-0.5 rounded border border-stone-200">
                        {(lengthInches / 12).toFixed(1)} ft
                      </span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={24}
                    max={120}
                    step={1}
                    value={lengthInches}
                    onChange={(e) => setLengthInches(Number(e.target.value))}
                    className="w-full accent-[#7e4b2c] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-stone-400 mt-1">
                    <span>24" (2.0 ft)</span>
                    <span className="text-[#b98144] font-medium">Standard: {activeProduct.dimensions.length}"</span>
                    <span>120" (10.0 ft)</span>
                  </div>
                </div>

                {/* Width / Depth Slider */}
                <div className="bg-[#fcfaf7] p-4 rounded-xl border border-[#dec099]/60">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-[#683d28]">
                      Width / Depth:
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono font-extrabold text-[#7e4b2c]">
                        {widthInches} inches
                      </span>
                      <span className="text-xs text-stone-500 font-medium bg-white px-2 py-0.5 rounded border border-stone-200">
                        {(widthInches / 12).toFixed(1)} ft
                      </span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={16}
                    max={96}
                    step={1}
                    value={widthInches}
                    onChange={(e) => setWidthInches(Number(e.target.value))}
                    className="w-full accent-[#7e4b2c] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-stone-400 mt-1">
                    <span>16" (1.3 ft)</span>
                    <span className="text-[#b98144] font-medium">Standard: {activeProduct.dimensions.width}"</span>
                    <span>96" (8.0 ft)</span>
                  </div>
                </div>

                {/* Height Slider */}
                <div className="bg-[#fcfaf7] p-4 rounded-xl border border-[#dec099]/60">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-[#683d28]">
                      Height:
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono font-extrabold text-[#7e4b2c]">
                        {heightInches} inches
                      </span>
                      <span className="text-xs text-stone-500 font-medium bg-white px-2 py-0.5 rounded border border-stone-200">
                        {(heightInches / 12).toFixed(1)} ft
                      </span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={14}
                    max={90}
                    step={1}
                    value={heightInches}
                    onChange={(e) => setHeightInches(Number(e.target.value))}
                    className="w-full accent-[#7e4b2c] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-stone-400 mt-1">
                    <span>14" (1.1 ft)</span>
                    <span className="text-[#b98144] font-medium">Standard: {activeProduct.dimensions.height}"</span>
                    <span>90" (7.5 ft)</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>Carpentry Precision Guarantee:</strong> All custom orders are laser-measured and kiln-dried with +/- 0.25 inch tolerance. We verify stair and door clearances prior to cutting wood.
                  </span>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setActiveTab('wood')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#7e4b2c] text-white text-xs font-semibold hover:bg-[#683d28] transition"
                  >
                    <span>Proceed to Wood & Polish</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: Wood & Polish Finish */}
            {activeTab === 'wood' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#301a11] mb-1">
                    Solid Hardwood Species & Grain
                  </h3>
                  <p className="text-xs text-stone-500 mb-4">
                    Choose from 100% natural seasoned timber varieties. Zero chipboard, zero cheap veneer.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {(Object.keys(WOOD_RATES) as WoodType[]).map((type) => {
                      const info = WOOD_RATES[type];
                      const isSelected = woodType === type;
                      return (
                        <div
                          key={type}
                          onClick={() => setWoodType(type)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#7e4b2c] bg-[#fbf8f3] ring-2 ring-[#7e4b2c]/20 shadow-xs'
                              : 'border-stone-200 hover:border-[#dec099] bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-bold text-[#301a11]">{type}</span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                isSelected ? 'bg-[#7e4b2c] text-white' : 'bg-stone-100 text-stone-600'
                              }`}
                            >
                              {info.tag}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 line-clamp-2 mb-2">{info.description}</p>
                          <div className="flex justify-between items-center text-[10px] text-stone-400">
                            <span>Density: {info.density}</span>
                            <span className="font-semibold text-[#b98144]">
                              {info.multiplier === 1.0 ? 'Base Price' : `${info.multiplier > 1 ? '+' : ''}${Math.round((info.multiplier - 1) * 100)}%`}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-base text-[#301a11] mb-1">
                    Hand-Rubbed Polish & Protective Finish
                  </h3>
                  <p className="text-xs text-stone-500 mb-3">
                    Multi-coat sealant protecting against stains, UV color fading, and heat rings.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {POLISH_OPTIONS.map((opt) => {
                      const isSelected = finish === opt.name;
                      return (
                        <button
                          key={opt.name}
                          onClick={() => setFinish(opt.name)}
                          className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'border-[#7e4b2c] bg-[#fbf8f3] ring-2 ring-[#7e4b2c]/20'
                              : 'border-stone-200 hover:border-stone-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2 w-full">
                            <div
                              className="w-5 h-5 rounded-full border border-black/20 shadow-xs shrink-0"
                              style={{ backgroundColor: opt.color }}
                            />
                            <span className="text-xs font-bold text-stone-900 truncate">{opt.name}</span>
                          </div>
                          <p className="text-[10px] text-stone-500 line-clamp-2">{opt.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    onClick={() => setActiveTab('dimensions')}
                    className="text-xs font-medium text-stone-600 hover:text-stone-900"
                  >
                    ← Back to Dimensions
                  </button>
                  <button
                    onClick={() => setActiveTab('fabric')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#7e4b2c] text-white text-xs font-semibold hover:bg-[#683d28] transition"
                  >
                    <span>Proceed to Upholstery & Carving</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: Upholstery & Carving */}
            {activeTab === 'fabric' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#301a11] mb-1">
                    Upholstery Fabric & Colors
                  </h3>
                  <p className="text-xs text-stone-500 mb-3">
                    High rub-count Martindale fabrics with water-repellent and anti-stain treatments.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
                    {FABRIC_OPTIONS.map((f) => {
                      const isSelected = fabric === f.name;
                      return (
                        <button
                          key={f.name}
                          onClick={() => setFabric(f.name)}
                          className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-24 ${
                            isSelected
                              ? 'border-[#7e4b2c] bg-[#fbf8f3] ring-2 ring-[#7e4b2c]/20'
                              : 'border-stone-200 hover:border-stone-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div
                              className="w-5 h-5 rounded-full border border-black/20 shadow-xs"
                              style={{ backgroundColor: f.color }}
                            />
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#7e4b2c]" />}
                          </div>
                          <div>
                            <span className="text-[11px] font-bold text-stone-900 block truncate leading-tight">
                              {f.name.split('-')[0]}
                            </span>
                            <span className="text-[10px] text-stone-500 block truncate">
                              {f.name.split('-')[1] || f.type}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-base text-[#301a11] mb-1">
                    Artisan Carving & Border Motifs
                  </h3>
                  <p className="text-xs text-stone-500 mb-3">
                    Hand-carved patterns by our hereditary Saharanpur and Rajasthani woodcarvers.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        name: 'Modern Minimalist',
                        desc: 'Clean chamfered edges, geometric clean lines without floral relief.',
                        cost: 0,
                      },
                      {
                        name: 'Traditional Floral Carving',
                        desc: 'Hand-carved acanthus and lotus vine motifs along headboards and corner aprons.',
                        cost: 2500,
                      },
                      {
                        name: 'Geometric Jali Work',
                        desc: 'Intricate fretwork lattice panels allowing gentle air and light flow.',
                        cost: 1800,
                      },
                      {
                        name: 'Royal Heritage Brass Inlay',
                        desc: 'Pure beaten brass wire inlaid and flush-sanded into timber surfaces.',
                        cost: 3500,
                      },
                    ].map((style) => {
                      const isSelected = carvingStyle === style.name;
                      return (
                        <div
                          key={style.name}
                          onClick={() => setCarvingStyle(style.name as any)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'border-[#7e4b2c] bg-[#fbf8f3] ring-2 ring-[#7e4b2c]/20'
                              : 'border-stone-200 hover:border-stone-300 bg-white'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-bold text-stone-900">{style.name}</span>
                            <span className="text-[11px] font-semibold text-[#b98144]">
                              {style.cost === 0 ? 'Complimentary' : `+₹${style.cost}`}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500">{style.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    onClick={() => setActiveTab('wood')}
                    className="text-xs font-medium text-stone-600 hover:text-stone-900"
                  >
                    ← Back to Wood
                  </button>
                  <button
                    onClick={() => setActiveTab('hardware')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#7e4b2c] text-white text-xs font-semibold hover:bg-[#683d28] transition"
                  >
                    <span>Proceed to Hardware & Add-ons</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: Hardware Add-ons & Custom Notes */}
            {activeTab === 'hardware' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#301a11] mb-1">
                    Utility & Storage Hardware Add-ons
                  </h3>
                  <p className="text-xs text-stone-500 mb-3">
                    Premium fittings engineered for heavy daily use and long-term durability.
                  </p>

                  <div className="space-y-2.5">
                    {CUSTOM_ADDONS.map((addon) => {
                      const isSelected = selectedAddons.includes(addon.id);
                      return (
                        <div
                          key={addon.id}
                          onClick={() => toggleAddon(addon.id)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-4 ${
                            isSelected
                              ? 'border-[#7e4b2c] bg-[#fbf8f3] ring-2 ring-[#7e4b2c]/20'
                              : 'border-stone-200 hover:border-stone-300 bg-white'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center shrink-0 ${
                                isSelected ? 'bg-[#7e4b2c] border-[#7e4b2c] text-white' : 'border-stone-300 bg-white'
                              }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5" />}
                            </div>
                            <div>
                              <span className="text-xs font-bold text-stone-900 block">{addon.name}</span>
                              <p className="text-[11px] text-stone-500 mt-0.5">{addon.description}</p>
                            </div>
                          </div>
                          <span className="text-xs font-extrabold text-[#7e4b2c] shrink-0">
                            +₹{addon.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-base text-[#301a11] mb-1">
                    Special Workshop Instructions / Room Constraints
                  </h3>
                  <textarea
                    rows={3}
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    placeholder="E.g., Narrow spiral staircase access, requires knockdown KD assembly; Please add extra wiring hole on left side; Match polish with our existing dining chairs..."
                    className="w-full p-3 rounded-xl border border-stone-300 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#7e4b2c]"
                  />
                </div>

                <div className="p-4 bg-[#f5ede1] rounded-xl border border-[#dec099] flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-xs text-stone-600 block">Total Finalized Price:</span>
                    <span className="text-xl font-bold font-serif text-[#301a11]">
                      ₹{priceBreakdown.total.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={shareViaWhatsApp}
                      className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Ask via WhatsApp</span>
                    </button>
                    <button
                      onClick={handleAddToCart}
                      className="px-5 py-2 rounded-lg bg-[#7e4b2c] hover:bg-[#683d28] text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add Custom Build to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
