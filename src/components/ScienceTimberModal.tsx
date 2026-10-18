import React, { useState } from 'react';
import {
  X,
  Compass,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Droplets,
  Activity,
  Atom,
} from 'lucide-react';

interface ScienceTimberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WoodSpeciesData {
  commonName: string;
  hindiName: string;
  scientificName: string;
  family: string;
  jankaHardness: number; // lbf
  airDryDensity: number; // kg/m³
  cellulosePct: number;
  ligninPct: number;
  hemicellulosePct: number;
  extractivesPct: number;
  keyPhytoCompound: {
    name: string;
    formula: string;
    pubChemCid: string;
    pubChemUrl: string;
    biologicalRole: string;
  };
  anatomyDescription: string;
}

const SCIENTIFIC_WOOD_SPECIES: Record<string, WoodSpeciesData> = {
  Sheesham: {
    commonName: 'Sheesham / Indian Rosewood',
    hindiName: 'शीशम (टाहली)',
    scientificName: 'Dalbergia sissoo Roxb.',
    family: 'Fabaceae (Legume family)',
    jankaHardness: 1780,
    airDryDensity: 850,
    cellulosePct: 44.5,
    ligninPct: 28.2,
    hemicellulosePct: 22.8,
    extractivesPct: 4.5,
    keyPhytoCompound: {
      name: 'Dalbergin (Neoflavonoid)',
      formula: 'C16H12O4',
      pubChemCid: '5281775',
      pubChemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/5281775',
      biologicalRole: 'Natural fungal inhibitor and antioxidant giving deep purple-brown ribbon veins and termite immunity.',
    },
    anatomyDescription:
      'Diffuse-porous hardwood with medium-to-large vessels, abundant aliform and confluent paratracheal parenchyma, and heavily lignified thick-walled fibers creating exceptional tensile and compressive structural strength.',
  },
  Teak: {
    commonName: 'CP Teakwood / Sagwan',
    hindiName: 'सागवान (सागौन)',
    scientificName: 'Tectona grandis L.f.',
    family: 'Lamiaceae (Mint / Teak family)',
    jankaHardness: 1155,
    airDryDensity: 720,
    cellulosePct: 42.1,
    ligninPct: 31.4,
    hemicellulosePct: 20.5,
    extractivesPct: 6.0,
    keyPhytoCompound: {
      name: 'Lapachol (Naphthoquinone)',
      formula: 'C15H14O3',
      pubChemCid: '4044',
      pubChemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/4044',
      biologicalRole: 'Naturally occurring bioactive naphthoquinone providing total immunity to subterranean termites and marine borers.',
    },
    anatomyDescription:
      'Ring-porous to semi-ring-porous wood with earlywood pores completely occluded by glistening tyloses and hydrophobic natural silica oils, preventing water absorption or warping even in monsoon conditions.',
  },
  Mango: {
    commonName: 'Mango Hardwood',
    hindiName: 'आम की लकड़ी',
    scientificName: 'Mangifera indica L.',
    family: 'Anacardiaceae (Cashew family)',
    jankaHardness: 1070,
    airDryDensity: 680,
    cellulosePct: 46.8,
    ligninPct: 24.5,
    hemicellulosePct: 24.2,
    extractivesPct: 4.5,
    keyPhytoCompound: {
      name: 'Mangiferin (C-glucosylxanthone)',
      formula: 'C19H18O11',
      pubChemCid: '5281647',
      pubChemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/5281647',
      biologicalRole: 'Natural polyphenolic antimicrobial agent imparting light golden-amber warm streaks.',
    },
    anatomyDescription:
      'Diffuse-porous with moderately large solitary pores, broad xylem rays, and interlocked fiber grain providing lightweight yet rigid dimensional stability.',
  },
};

export const ScienceTimberModal: React.FC<ScienceTimberModalProps> = ({ isOpen, onClose }) => {
  const [selectedSpecies, setSelectedSpecies] = useState<'Sheesham' | 'Teak' | 'Mango'>('Sheesham');

  if (!isOpen) return null;

  const data = SCIENTIFIC_WOOD_SPECIES[selectedSpecies];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#dec099] p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-2 rounded-full hover:bg-stone-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
          <Atom className="w-4 h-4 text-emerald-600" />
          <span>Botanical Dendrology & Wood Biochemistry</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#301a11] mb-2">
          Timber Science & Molecular Anatomy
        </h2>
        <p className="text-xs text-stone-500 mb-6 max-w-xl">
          Scientific dendrological analysis of Indian hardwoods used at <strong>Satkkabir Furniture Udhyog</strong>. Explaining microscopic cellular structures and natural phytochemical compounds that guarantee 10+ years durability.
        </p>

        {/* Species Switcher Pills */}
        <div className="flex gap-2 mb-6">
          {(['Sheesham', 'Teak', 'Mango'] as const).map((sp) => (
            <button
              key={sp}
              onClick={() => setSelectedSpecies(sp)}
              className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                selectedSpecies === sp
                  ? 'bg-[#7e4b2c] text-white border-[#7e4b2c] shadow-sm'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <span>{sp}</span>
              <span className="text-[10px] opacity-75 hidden sm:inline">
                ({SCIENTIFIC_WOOD_SPECIES[sp].hindiName})
              </span>
            </button>
          ))}
        </div>

        {/* Main Scientific Content Card */}
        <div className="space-y-6">
          {/* Botanical Overview */}
          <div className="bg-[#faf7f2] p-4 sm:p-5 rounded-2xl border border-[#cb9f6a]/60">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-stone-200/80 pb-3 mb-3">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#301a11]">{data.commonName}</h3>
                <p className="text-xs font-serif italic text-[#7e4b2c]">{data.scientificName}</p>
              </div>
              <span className="text-xs font-mono font-bold bg-[#f5ede1] text-[#683d28] px-3 py-1 rounded-full border border-[#cb9f6a]/60">
                Family: {data.family}
              </span>
            </div>

            <p className="text-xs text-stone-700 leading-relaxed mb-4">
              <strong>Xylem & Cellular Anatomy:</strong> {data.anatomyDescription}
            </p>

            {/* Physical Engineering Properties */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
              <div className="bg-white p-3 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-400 block">Janka Hardness</span>
                <strong className="text-sm font-mono text-[#7e4b2c]">{data.jankaHardness} lbf</strong>
                <span className="text-[9px] text-stone-500 block">Indentation test</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-400 block">Air-Dry Density</span>
                <strong className="text-sm font-mono text-[#7e4b2c]">{data.airDryDensity} kg/m³</strong>
                <span className="text-[9px] text-stone-500 block">Kiln conditioned</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-400 block">Cellulose Core</span>
                <strong className="text-sm font-mono text-emerald-800">{data.cellulosePct}%</strong>
                <span className="text-[9px] text-stone-500 block">Linear glucose chain</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-400 block">Natural Lignin</span>
                <strong className="text-sm font-mono text-emerald-800">{data.ligninPct}%</strong>
                <span className="text-[9px] text-stone-500 block">Rigid phenolic binder</span>
              </div>
            </div>
          </div>

          {/* PubChem Chemical Compound Investigation */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wide text-[#b98144] flex items-center gap-1.5">
                <Atom className="w-4 h-4" />
                Key Natural Phyto-Chemical Extractive
              </span>
              <a
                href={data.keyPhytoCompound.pubChemUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#7e4b2c] hover:underline flex items-center gap-1 font-semibold"
              >
                <span>PubChem CID: {data.keyPhytoCompound.pubChemCid}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-stone-50 rounded-xl">
              <div>
                <strong className="text-sm font-bold text-stone-900 block">
                  {data.keyPhytoCompound.name}
                </strong>
                <span className="text-xs font-mono text-stone-500">
                  Chemical Formula: {data.keyPhytoCompound.formula}
                </span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                Natural Preservative
              </span>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              <strong>Biological Defense Mechanism:</strong> {data.keyPhytoCompound.biologicalRole}
            </p>
          </div>

          {/* Satkkabir Kiln-Seasoning Verification Standard */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong>Scientific Kiln-Drying Protocol (IS 1141:1993 Standard):</strong>
              <p className="mt-0.5 text-emerald-800">
                All timber at Satkkabir Furniture Udhyog undergoes controlled steam seasoning reducing free cell-lumen moisture and bound cell-wall moisture to exactly <strong>8% to 12% equilibrium moisture content (EMC)</strong>, ensuring zero warping across hot summers and rainy monsoons.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
