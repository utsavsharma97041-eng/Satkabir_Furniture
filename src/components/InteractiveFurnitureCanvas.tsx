import React, { useState } from 'react';
import { WoodType, PolishFinish, FabricType } from '../types/furniture';
import { Eye, Layers, Maximize2, Sparkles, Compass } from 'lucide-react';

interface InteractiveFurnitureCanvasProps {
  category: string;
  woodType: WoodType;
  finish: PolishFinish;
  fabric: FabricType;
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: 'inches';
  };
  carvingStyle?: string;
  selectedAddons: string[];
}

// Color palettes for realistic wood finishes
const FINISH_COLORS: Record<PolishFinish, { main: string; shade: string; highlight: string; grain: string }> = {
  'Honey Teak Matte': {
    main: '#c28e46',
    shade: '#9c6b29',
    highlight: '#e3b478',
    grain: '#7a4e16',
  },
  'Natural Teak Gloss': {
    main: '#d49b4f',
    shade: '#aa712a',
    highlight: '#fad08f',
    grain: '#8c551c',
  },
  'Rich Walnut Satin': {
    main: '#5a3825',
    shade: '#3f2416',
    highlight: '#784e36',
    grain: '#2c170d',
  },
  'Dark Mahogany': {
    main: '#44211a',
    shade: '#2c120e',
    highlight: '#623329',
    grain: '#1d0a07',
  },
  'Distressed Antique Brown': {
    main: '#6e5138',
    shade: '#4a3421',
    highlight: '#8c6b4d',
    grain: '#332214',
  },
  'Raw Organic Waxed': {
    main: '#d9be9b',
    shade: '#b5936b',
    highlight: '#ebd8bf',
    grain: '#8c6c49',
  },
};

// Fabric colors
const FABRIC_COLORS: Record<string, string> = {
  'Royal Velvet - Emerald Green': '#134e3f',
  'Royal Velvet - Royal Navy': '#1e3a5f',
  'Royal Velvet - Mustard Gold': '#c89224',
  'Pure Organic Linen - Warm Beige': '#dcd1c2',
  'Premium Leatherette - Tan Cognac': '#9a5327',
  'Premium Leatherette - Espresso': '#382318',
  'Textured Jute Blend - Natural Grey': '#8e8b82',
  'No Fabric / Pure Wood': 'transparent',
};

export const InteractiveFurnitureCanvas: React.FC<InteractiveFurnitureCanvasProps> = ({
  category,
  finish,
  fabric,
  dimensions,
  carvingStyle,
  selectedAddons,
}) => {
  const [viewAngle, setViewAngle] = useState<'perspective' | 'front' | 'blueprint'>('perspective');
  const [roomBackdrop, setRoomBackdrop] = useState<'minimal' | 'living' | 'dark'>('minimal');
  const [showDimensions, setShowDimensions] = useState(true);

  const colors = FINISH_COLORS[finish] || FINISH_COLORS['Honey Teak Matte'];
  const fabricColor = FABRIC_COLORS[fabric] || '#134e3f';

  const hasHydraulic = selectedAddons.includes('addon-hydraulic');
  const hasBrassInlay = selectedAddons.includes('addon-brass-inlay') || carvingStyle === 'Royal Heritage Brass Inlay';
  const hasDrawers = selectedAddons.includes('addon-drawers');
  const hasLED = selectedAddons.includes('addon-mandir-led');

  // Relative scaling based on user sliders
  const scaleX = Math.min(Math.max(dimensions.length / 70, 0.75), 1.35);
  const scaleY = Math.min(Math.max(dimensions.height / 45, 0.75), 1.35);
  const scaleZ = Math.min(Math.max(dimensions.width / 40, 0.75), 1.35);

  const renderBackdrop = () => {
    if (roomBackdrop === 'dark') {
      return (
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1410] via-[#241c16] to-[#120d0a] pointer-events-none" />
      );
    }
    if (roomBackdrop === 'living') {
      return (
        <div className="absolute inset-0 bg-gradient-to-b from-[#f3ede3] via-[#efe5d6] to-[#dfd1bd] pointer-events-none">
          {/* Subtle architectural wall moulding */}
          <div className="absolute top-0 inset-x-0 h-40 border-b border-[#cfbfa9]/40" />
          <div className="absolute bottom-0 inset-x-0 h-32 bg-[#cca97f]/30 border-t border-[#bfa076]/40" />
        </div>
      );
    }
    // Minimal neutral studio
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-[#fcfbf9] via-[#f7f3ec] to-[#e8decb] pointer-events-none" />
    );
  };

  return (
    <div className="relative w-full h-80 sm:h-96 md:h-[420px] rounded-2xl overflow-hidden border border-[#dec099]/60 shadow-inner flex flex-col justify-between p-4 select-none">
      {renderBackdrop()}

      {/* Top Floating Controls */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#dec099]/50 shadow-sm text-xs font-medium text-[#4a3421]">
          <Compass className="w-3.5 h-3.5 text-[#b98144]" />
          <span>View:</span>
          <button
            onClick={() => setViewAngle('perspective')}
            className={`px-2 py-0.5 rounded-full transition-all ${
              viewAngle === 'perspective' ? 'bg-[#7e4b2c] text-white shadow-xs' : 'hover:bg-[#f5ede1]'
            }`}
          >
            3D Isometric
          </button>
          <button
            onClick={() => setViewAngle('front')}
            className={`px-2 py-0.5 rounded-full transition-all ${
              viewAngle === 'front' ? 'bg-[#7e4b2c] text-white shadow-xs' : 'hover:bg-[#f5ede1]'
            }`}
          >
            Front Elevation
          </button>
          <button
            onClick={() => setViewAngle('blueprint')}
            className={`px-2 py-0.5 rounded-full transition-all ${
              viewAngle === 'blueprint' ? 'bg-[#7e4b2c] text-white shadow-xs' : 'hover:bg-[#f5ede1]'
            }`}
          >
            Blueprint Cad
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Dimension Labels */}
          <button
            onClick={() => setShowDimensions(!showDimensions)}
            className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full border transition-all ${
              showDimensions
                ? 'bg-[#7e4b2c]/10 border-[#7e4b2c] text-[#7e4b2c] font-semibold'
                : 'bg-white/80 border-stone-200 text-stone-600'
            }`}
            title="Toggle Live Dimension Tape"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dimensions</span>
          </button>

          {/* Backdrop selector */}
          <div className="flex items-center bg-white/90 backdrop-blur-md p-1 rounded-full border border-[#dec099]/50 shadow-sm">
            <button
              onClick={() => setRoomBackdrop('minimal')}
              className={`w-5 h-5 rounded-full border ${roomBackdrop === 'minimal' ? 'ring-2 ring-[#7e4b2c]' : ''} bg-[#faf7f2]`}
              title="Studio Lighting"
            />
            <button
              onClick={() => setRoomBackdrop('living')}
              className={`w-5 h-5 rounded-full border ml-1 ${roomBackdrop === 'living' ? 'ring-2 ring-[#7e4b2c]' : ''} bg-[#dfd1bd]`}
              title="Living Room Ambience"
            />
            <button
              onClick={() => setRoomBackdrop('dark')}
              className={`w-5 h-5 rounded-full border ml-1 ${roomBackdrop === 'dark' ? 'ring-2 ring-[#7e4b2c]' : ''} bg-[#2c1d14]`}
              title="Night Warm Glow"
            />
          </div>
        </div>
      </div>

      {/* Main SVG Visualization */}
      <div className="relative z-10 flex-1 flex items-center justify-center my-2">
        <svg
          viewBox="0 0 500 320"
          className="w-full h-full max-h-72 drop-shadow-2xl transition-transform duration-500 ease-out"
          style={{
            transform: `scale(${viewAngle === 'front' ? 1.05 : 1})`,
          }}
        >
          <defs>
            {/* Real wood grain gradient filters */}
            <linearGradient id="woodMain" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.highlight} />
              <stop offset="45%" stopColor={colors.main} />
              <stop offset="100%" stopColor={colors.shade} />
            </linearGradient>

            <linearGradient id="woodDark" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={colors.shade} />
              <stop offset="100%" stopColor={colors.grain} />
            </linearGradient>

            <linearGradient id="brassGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f7e1a0" />
              <stop offset="50%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#aa7c11" />
            </linearGradient>

            <pattern id="woodStripes" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(25)">
              <line x1="0" y1="0" x2="0" y2="20" stroke={colors.grain} strokeWidth="1" opacity="0.3" />
              <line x1="10" y1="0" x2="10" y2="20" stroke={colors.highlight} strokeWidth="0.5" opacity="0.3" />
            </pattern>

            <radialGradient id="shadowFloor" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(0,0,0,0.35)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>
          </defs>

          {/* Floor Shadow */}
          <ellipse cx="250" cy="280" rx={180 * scaleX} ry={24 * scaleZ} fill="url(#shadowFloor)" />

          {/* Render based on Category and View */}
          {category === 'Bedroom' && (
            <g
              transform={
                viewAngle === 'perspective'
                  ? `translate(${250 - 150 * scaleX}, ${140 - 40 * scaleY}) scale(${scaleX}, ${scaleY})`
                  : viewAngle === 'front'
                  ? `translate(${250 - 140 * scaleX}, ${150 - 45 * scaleY}) scale(${scaleX}, ${scaleY})`
                  : `translate(${250 - 130 * scaleX}, ${130 - 30 * scaleY}) scale(${scaleX}, ${scaleY})`
              }
            >
              {/* Headboard */}
              <rect
                x="30"
                y="10"
                width="240"
                height="110"
                rx="6"
                fill="url(#woodMain)"
                stroke={colors.shade}
                strokeWidth="2"
              />
              <rect x="30" y="10" width="240" height="110" fill="url(#woodStripes)" />

              {/* Headboard fabric or carved panel */}
              {fabric !== 'No Fabric / Pure Wood' ? (
                <g>
                  <rect
                    x="45"
                    y="25"
                    width="210"
                    height="80"
                    rx="4"
                    fill={fabricColor}
                    stroke="#ffffff33"
                    strokeWidth="1.5"
                  />
                  {/* Tufted diamond buttons */}
                  <circle cx="80" cy="50" r="3" fill="#ffffff66" />
                  <circle cx="150" cy="50" r="3" fill="#ffffff66" />
                  <circle cx="220" cy="50" r="3" fill="#ffffff66" />
                  <circle cx="115" cy="75" r="3" fill="#ffffff66" />
                  <circle cx="185" cy="75" r="3" fill="#ffffff66" />
                  <line x1="80" y1="50" x2="115" y2="75" stroke="#00000033" strokeWidth="1" strokeDasharray="2,2" />
                  <line x1="150" y1="50" x2="115" y2="75" stroke="#00000033" strokeWidth="1" strokeDasharray="2,2" />
                  <line x1="150" y1="50" x2="185" y2="75" stroke="#00000033" strokeWidth="1" strokeDasharray="2,2" />
                  <line x1="220" y1="50" x2="185" y2="75" stroke="#00000033" strokeWidth="1" strokeDasharray="2,2" />
                </g>
              ) : (
                /* Pure wood recessed geometric jali panels */
                <g>
                  <rect x="45" y="25" width="60" height="80" rx="3" fill={colors.shade} opacity="0.6" />
                  <rect x="120" y="25" width="60" height="80" rx="3" fill={colors.shade} opacity="0.6" />
                  <rect x="195" y="25" width="60" height="80" rx="3" fill={colors.shade} opacity="0.6" />
                </g>
              )}

              {/* Brass inlay corners if selected */}
              {hasBrassInlay && (
                <g fill="url(#brassGlow)">
                  <polygon points="32,12 55,12 55,16 36,16 36,35 32,35" />
                  <polygon points="268,12 245,12 245,16 264,16 264,35 268,35" />
                  <circle cx="150" cy="18" r="4" fill="url(#brassGlow)" />
                </g>
              )}

              {/* Bed Frame & Mattress Base */}
              <polygon
                points="10,120 290,120 270,180 30,180"
                fill="#f4efe7"
                stroke={colors.shade}
                strokeWidth="2"
              />
              {/* Mattress Quilt Lines */}
              <line x1="50" y1="135" x2="250" y2="135" stroke="#d5cfc4" strokeWidth="1.5" />
              <line x1="45" y1="150" x2="255" y2="150" stroke="#d5cfc4" strokeWidth="1.5" />
              <line x1="40" y1="165" x2="260" y2="165" stroke="#d5cfc4" strokeWidth="1.5" />

              {/* Pillows */}
              <rect x="50" y="105" width="85" height="25" rx="6" fill="#ffffff" stroke="#e0ded8" />
              <rect x="165" y="105" width="85" height="25" rx="6" fill="#ffffff" stroke="#e0ded8" />

              {/* Bed Plinth Footboard / Drawers */}
              <rect
                x="30"
                y="180"
                width="240"
                height="45"
                rx="4"
                fill="url(#woodDark)"
                stroke={colors.shade}
                strokeWidth="2"
              />

              {/* Storage Drawer handles or hydraulic symbol */}
              {hasDrawers && (
                <g>
                  <rect x="50" y="190" width="90" height="25" rx="2" fill={colors.main} stroke={colors.shade} />
                  <rect x="85" y="200" width="20" height="4" rx="2" fill="url(#brassGlow)" />
                  <rect x="160" y="190" width="90" height="25" rx="2" fill={colors.main} stroke={colors.shade} />
                  <rect x="195" y="200" width="20" height="4" rx="2" fill="url(#brassGlow)" />
                </g>
              )}

              {hasHydraulic && (
                <g transform="translate(135, 188)">
                  <rect x="0" y="0" width="30" height="15" rx="3" fill="#2d6a4f" />
                  <text x="15" y="11" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">
                    PNEUMATIC
                  </text>
                </g>
              )}

              {/* Solid wood legs */}
              <rect x="25" y="225" width="18" height="25" rx="2" fill="url(#woodDark)" />
              <rect x="257" y="225" width="18" height="25" rx="2" fill="url(#woodDark)" />
            </g>
          )}

          {category === 'Living Room' && (
            <g
              transform={
                viewAngle === 'perspective'
                  ? `translate(${250 - 150 * scaleX}, ${145 - 35 * scaleY}) scale(${scaleX}, ${scaleY})`
                  : `translate(${250 - 145 * scaleX}, ${150 - 40 * scaleY}) scale(${scaleX}, ${scaleY})`
              }
            >
              {/* Sofa Main Solid Wood Frame */}
              <rect
                x="20"
                y="35"
                width="260"
                height="90"
                rx="8"
                fill="url(#woodMain)"
                stroke={colors.shade}
                strokeWidth="2"
              />
              <rect x="20" y="35" width="260" height="90" fill="url(#woodStripes)" />

              {/* Sofa Back Cushions */}
              <rect
                x="35"
                y="45"
                width="70"
                height="65"
                rx="6"
                fill={fabricColor}
                stroke="#ffffff22"
                strokeWidth="1.5"
              />
              <rect
                x="115"
                y="45"
                width="70"
                height="65"
                rx="6"
                fill={fabricColor}
                stroke="#ffffff22"
                strokeWidth="1.5"
              />
              <rect
                x="195"
                y="45"
                width="70"
                height="65"
                rx="6"
                fill={fabricColor}
                stroke="#ffffff22"
                strokeWidth="1.5"
              />

              {/* Deep Seating Base */}
              <rect
                x="20"
                y="115"
                width="260"
                height="50"
                rx="8"
                fill={fabricColor}
                stroke="#00000033"
                strokeWidth="1.5"
              />

              {/* Wooden Armrests */}
              <rect
                x="10"
                y="55"
                width="22"
                height="115"
                rx="6"
                fill="url(#woodMain)"
                stroke={colors.shade}
                strokeWidth="2"
              />
              <rect
                x="268"
                y="55"
                width="22"
                height="115"
                rx="6"
                fill="url(#woodMain)"
                stroke={colors.shade}
                strokeWidth="2"
              />

              {/* Brass details if chosen */}
              {hasBrassInlay && (
                <g fill="url(#brassGlow)">
                  <circle cx="21" cy="70" r="4" />
                  <circle cx="279" cy="70" r="4" />
                  <rect x="15" y="80" width="12" height="2" />
                  <rect x="273" y="80" width="12" height="2" />
                </g>
              )}

              {/* Wooden Tapered Legs */}
              <polygon points="25,170 33,170 38,205 20,205" fill="url(#woodDark)" />
              <polygon points="140,170 148,170 148,205 140,205" fill="url(#woodDark)" />
              <polygon points="267,170 275,170 280,205 262,205" fill="url(#woodDark)" />
            </g>
          )}

          {category === 'Dining & Kitchen' && (
            <g
              transform={`translate(${250 - 150 * scaleX}, ${145 - 35 * scaleY}) scale(${scaleX}, ${scaleY})`}
            >
              {/* Back Chairs */}
              <rect x="40" y="30" width="35" height="70" rx="3" fill="url(#woodDark)" />
              <rect x="135" y="30" width="35" height="70" rx="3" fill="url(#woodDark)" />
              <rect x="225" y="30" width="35" height="70" rx="3" fill="url(#woodDark)" />

              {/* Table Top (Solid 35mm thick) */}
              <polygon
                points="10,100 290,100 270,135 30,135"
                fill="url(#woodMain)"
                stroke={colors.shade}
                strokeWidth="2"
              />
              <polygon points="10,100 290,100 270,135 30,135" fill="url(#woodStripes)" />

              {/* Table Edges & Bevel */}
              <polygon points="30,135 270,135 270,145 30,145" fill="url(#woodDark)" />

              {/* Center Brass strip if selected */}
              {hasBrassInlay && (
                <line x1="30" y1="117" x2="270" y2="117" stroke="url(#brassGlow)" strokeWidth="3" />
              )}

              {/* Table Heavy Square Legs */}
              <rect x="35" y="145" width="22" height="85" rx="3" fill="url(#woodDark)" />
              <rect x="243" y="145" width="22" height="85" rx="3" fill="url(#woodDark)" />
              {/* Stretcher Bar */}
              <rect x="57" y="195" width="186" height="12" rx="2" fill="url(#woodMain)" opacity="0.8" />

              {/* Front Chairs Upholstery */}
              <rect x="65" y="125" width="45" height="30" rx="4" fill={fabricColor} stroke="#ffffff33" />
              <rect x="190" y="125" width="45" height="30" rx="4" fill={fabricColor} stroke="#ffffff33" />
            </g>
          )}

          {category === 'Pooja Mandir' && (
            <g
              transform={`translate(${250 - 100 * scaleX}, ${120 - 45 * scaleY}) scale(${scaleX}, ${scaleY})`}
            >
              {/* Dome / Shikhar Gopuram */}
              <polygon points="100,10 70,50 130,50" fill="url(#woodMain)" stroke={colors.shade} strokeWidth="1.5" />
              {/* Kalash Top */}
              <circle cx="100" cy="8" r="5" fill="url(#brassGlow)" />
              <line x1="100" y1="0" x2="100" y2="5" stroke="url(#brassGlow)" strokeWidth="2" />

              {/* Inner Sanctum */}
              <rect
                x="20"
                y="50"
                width="160"
                height="120"
                rx="6"
                fill="url(#woodMain)"
                stroke={colors.shade}
                strokeWidth="2"
              />

              {/* Backlit glow if LED selected */}
              {hasLED && (
                <ellipse cx="100" cy="100" rx="60" ry="40" fill="#ffd166" opacity="0.4" />
              )}

              {/* Hand-carved Arch Pillar Pillars */}
              <path
                d="M 40,140 L 40,75 Q 100,55 160,75 L 160,140"
                fill="none"
                stroke="url(#woodDark)"
                strokeWidth="4"
              />
              <circle cx="100" cy="90" r="14" fill="none" stroke="url(#brassGlow)" strokeWidth="2" />

              {/* Hanging Bells */}
              <circle cx="65" cy="78" r="4" fill="url(#brassGlow)" />
              <circle cx="135" cy="78" r="4" fill="url(#brassGlow)" />

              {/* Pull-out Bhog Tray Platform */}
              <rect x="25" y="145" width="150" height="12" rx="2" fill="url(#woodDark)" />
              {/* Base Drawers with Brass Knobs */}
              <rect x="20" y="160" width="160" height="40" rx="4" fill="url(#woodMain)" stroke={colors.shade} />
              <rect x="35" y="168" width="55" height="24" rx="2" fill={colors.shade} />
              <circle cx="62" cy="180" r="3" fill="url(#brassGlow)" />
              <rect x="110" y="168" width="55" height="24" rx="2" fill={colors.shade} />
              <circle cx="137" cy="180" r="3" fill="url(#brassGlow)" />

              {/* Mandir Pedestal Legs */}
              <rect x="25" y="200" width="18" height="15" rx="3" fill="url(#woodDark)" />
              <rect x="157" y="200" width="18" height="15" rx="3" fill="url(#woodDark)" />
            </g>
          )}

          {category !== 'Bedroom' &&
            category !== 'Living Room' &&
            category !== 'Dining & Kitchen' &&
            category !== 'Pooja Mandir' && (
              <g
                transform={`translate(${250 - 130 * scaleX}, ${140 - 35 * scaleY}) scale(${scaleX}, ${scaleY})`}
              >
                {/* Generic Study / Storage / Wardrobe representation */}
                <rect
                  x="20"
                  y="20"
                  width="220"
                  height="160"
                  rx="6"
                  fill="url(#woodMain)"
                  stroke={colors.shade}
                  strokeWidth="2"
                />
                <rect x="20" y="20" width="220" height="160" fill="url(#woodStripes)" />

                {/* Drawers / Panels */}
                <rect x="35" y="35" width="90" height="60" rx="4" fill={colors.shade} />
                <rect x="135" y="35" width="90" height="60" rx="4" fill={colors.shade} />
                <rect x="35" y="105" width="190" height="60" rx="4" fill={colors.shade} />

                {/* Brass Handles */}
                <rect x="75" y="60" width="14" height="4" rx="2" fill="url(#brassGlow)" />
                <rect x="175" y="60" width="14" height="4" rx="2" fill="url(#brassGlow)" />
                <rect x="125" y="130" width="20" height="4" rx="2" fill="url(#brassGlow)" />

                {/* Legs */}
                <rect x="30" y="180" width="18" height="25" rx="2" fill="url(#woodDark)" />
                <rect x="212" y="180" width="18" height="25" rx="2" fill="url(#woodDark)" />
              </g>
            )}

          {/* Blueprint Measurement Overlay Lines */}
          {showDimensions && (
            <g className="text-[10px] font-mono select-none" fill="#4a3421">
              {/* Length indicator (horizontal bottom) */}
              <line x1="70" y1="290" x2="430" y2="290" stroke="#7e4b2c" strokeWidth="1.5" strokeDasharray="3,3" />
              <polygon points="70,290 78,287 78,293" fill="#7e4b2c" />
              <polygon points="430,290 422,287 422,293" fill="#7e4b2c" />
              <rect x="215" y="278" width="70" height="18" rx="4" fill="#ffffff" stroke="#7e4b2c" strokeWidth="1" />
              <text x="250" y="291" textAnchor="middle" fontWeight="bold" fontSize="9" fill="#7e4b2c">
                L: {dimensions.length}" ({Math.round((dimensions.length / 12) * 10) / 10} ft)
              </text>

              {/* Height indicator (vertical right) */}
              <line x1="455" y1="60" x2="455" y2="260" stroke="#7e4b2c" strokeWidth="1.5" strokeDasharray="3,3" />
              <polygon points="455,60 452,68 458,68" fill="#7e4b2c" />
              <polygon points="455,260 452,252 458,252" fill="#7e4b2c" />
              <rect x="420" y="150" width="70" height="18" rx="4" fill="#ffffff" stroke="#7e4b2c" strokeWidth="1" />
              <text x="455" y="163" textAnchor="middle" fontWeight="bold" fontSize="9" fill="#7e4b2c">
                H: {dimensions.height}" ({Math.round((dimensions.height / 12) * 10) / 10} ft)
              </text>

              {/* Depth / Width indicator (top left) */}
              <line x1="50" y1="40" x2="110" y2="80" stroke="#7e4b2c" strokeWidth="1.5" strokeDasharray="3,3" />
              <rect x="50" y="48" width="65" height="18" rx="4" fill="#ffffff" stroke="#7e4b2c" strokeWidth="1" />
              <text x="82" y="61" textAnchor="middle" fontWeight="bold" fontSize="9" fill="#7e4b2c">
                W: {dimensions.width}"
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Bottom Real-Time Attributes Badges */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#dec099]/40 text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#7e4b2c]/10 text-[#683d28] font-semibold border border-[#7e4b2c]/20">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block border border-black/20"
              style={{ backgroundColor: colors.main }}
            />
            {finish}
          </span>
          {fabric !== 'No Fabric / Pure Wood' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 font-medium border border-stone-200">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block border border-black/20"
                style={{ backgroundColor: fabricColor }}
              />
              {fabric.split('-')[0]}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-stone-600 font-medium">
          {hasBrassInlay && (
            <span className="inline-flex items-center gap-1 text-[#b98144] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Brass Inlay
            </span>
          )}
          {hasHydraulic && (
            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
              <Layers className="w-3.5 h-3.5" />
              Hydraulic Storage
            </span>
          )}
          <span className="text-[11px] bg-white/80 px-2 py-0.5 rounded text-stone-500 border border-stone-200">
            Scale: {Math.round(scaleX * 100)}% L × {Math.round(scaleY * 100)}% H
          </span>
        </div>
      </div>
    </div>
  );
};
