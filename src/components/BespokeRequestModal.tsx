import React, { useState } from 'react';
import { CustomInquiry, WoodType, PolishFinish } from '../types/furniture';
import { storageService } from '../services/storageService';
import { X, Upload, CheckCircle2, FileText, Sparkles, Phone, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BespokeRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (inquiry: CustomInquiry) => void;
}

export const BespokeRequestModal: React.FC<BespokeRequestModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [city, setCity] = useState('');
  const [productType, setProductType] = useState('Custom Solid Wood Bed with Storage');
  const [woodPreference, setWoodPreference] = useState<WoodType>('Sheesham Wood (Indian Rosewood)');
  const [finishPreference, setFinishPreference] = useState<PolishFinish>('Honey Teak Matte');
  const [approxDimensions, setApproxDimensions] = useState('');
  const [budgetInr, setBudgetInr] = useState<number>(45000);
  const [description, setDescription] = useState('');
  const [referenceImageUrl, setReferenceImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState<CustomInquiry | null>(null);

  if (!isOpen) return null;

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !description) return;

    setIsSubmitting(true);

    const newInquiry: CustomInquiry = {
      id: `INQ-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      customerName,
      customerPhone,
      customerEmail,
      city,
      productType,
      woodPreference,
      finishPreference,
      approxDimensions: approxDimensions || 'Custom dimensions to be finalized via site visit/WhatsApp',
      budgetInr,
      referenceImageUrl: referenceImageUrl || undefined,
      description,
      status: 'In Review',
    };

    storageService.addInquiry(newInquiry);
    setSubmittedInquiry(newInquiry);
    setIsSubmitting(false);

    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.5 },
    });

    onSuccess(newInquiry);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#dec099]/80 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedInquiry ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-300">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#301a11] mb-2">
              Custom Carpentry Blueprint Received!
            </h2>
            <p className="text-sm text-stone-600 max-w-md mx-auto mb-4">
              Your custom modification inquiry has been registered under ticket number:
            </p>
            <div className="inline-block px-4 py-2 bg-[#f5ede1] rounded-xl border border-[#cb9f6a] text-lg font-mono font-bold text-[#7e4b2c] mb-6">
              {submittedInquiry.id}
            </div>
            <div className="bg-stone-50 p-4 rounded-xl text-xs text-stone-600 max-w-md mx-auto text-left space-y-1.5 border border-stone-200 mb-6">
              <p><strong>Client:</strong> {submittedInquiry.customerName}</p>
              <p><strong>Item:</strong> {submittedInquiry.productType}</p>
              <p><strong>Wood:</strong> {submittedInquiry.woodPreference}</p>
              <p><strong>Estimated Budget:</strong> ₹{submittedInquiry.budgetInr.toLocaleString('en-IN')}</p>
              <p className="text-emerald-700 font-semibold pt-1">
                Our Master Carpenter (Ustaad Ji) will contact you on WhatsApp/Phone at {submittedInquiry.customerPhone} within 2-4 hours with a CAD drawing & timber estimate.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-[#7e4b2c] hover:bg-[#683d28] text-white font-semibold text-xs transition"
            >
              Close & Back to Store
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-[#b98144]" />
              <span className="text-xs uppercase font-bold tracking-wider text-[#b98144]">
                Direct Workshop Commission
              </span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#301a11] mb-1">
              Custom Furniture & Blueprint Request
            </h2>
            <p className="text-xs text-stone-500 mb-6">
              Have a custom Pinterest design, architectural blueprint, or irregular room niche? Upload your idea and our workshop will engineer and hand-build it in pure seasoned timber.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Anand Rathi"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#7e4b2c]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    WhatsApp / Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 98XXX XXXXX"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#7e4b2c]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#7e4b2c]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    City / Delivery Location
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Jaipur, Delhi, Mumbai, Bengaluru"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#7e4b2c]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    What are you looking to build? *
                  </label>
                  <select
                    value={productType}
                    onChange={(e) => setProductType(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#7e4b2c] bg-white"
                  >
                    <option value="Custom Solid Wood Bed with Storage">Custom Solid Wood Bed with Storage</option>
                    <option value="Custom L-Shaped Royal Teak Sofa">Custom L-Shaped Royal Teak Sofa</option>
                    <option value="Hand-Carved Mandir / Home Temple">Hand-Carved Mandir / Home Temple</option>
                    <option value="Custom Dining Table Set (4/6/8/10 Seater)">Custom Dining Table Set (4/6/8/10 Seater)</option>
                    <option value="Fitted Floor-to-Ceiling Wardrobe">Fitted Floor-to-Ceiling Wardrobe</option>
                    <option value="Bespoke Executive Solid Wood Desk">Bespoke Executive Solid Wood Desk</option>
                    <option value="Modular TV Unit & Wall Panelling">Modular TV Unit & Wall Panelling</option>
                    <option value="Custom Commercial / Cafe Furniture">Custom Commercial / Cafe Furniture</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Preferred Hardwood Timber *
                  </label>
                  <select
                    value={woodPreference}
                    onChange={(e) => setWoodPreference(e.target.value as WoodType)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#7e4b2c] bg-white"
                  >
                    <option value="Sheesham Wood (Indian Rosewood)">Sheesham Wood (Indian Rosewood - Most Popular)</option>
                    <option value="CP Teak Wood (Sagwan)">CP Teak Wood (Sagwan - Premium Water Resistant)</option>
                    <option value="Mango Wood">Mango Wood (Rustic Golden Warmth)</option>
                    <option value="Rosewood (Shisham Special)">Rosewood (Special Heirloom Selection)</option>
                    <option value="Acacia Hardwood">Acacia Hardwood</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Room / Furniture Dimensions (Rough)
                  </label>
                  <input
                    type="text"
                    value={approxDimensions}
                    onChange={(e) => setApproxDimensions(e.target.value)}
                    placeholder="e.g. 84 inches width x 78 inches length x 48 inches height"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#7e4b2c]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Approximate Budget (₹ INR)
                  </label>
                  <input
                    type="number"
                    step={1000}
                    value={budgetInr}
                    onChange={(e) => setBudgetInr(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#7e4b2c]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Reference Sketch / Blueprint / Room Photo
                </label>
                <div className="border-2 border-dashed border-stone-300 rounded-xl p-4 text-center hover:bg-[#fcfaf7] transition">
                  {referenceImageUrl ? (
                    <div className="flex items-center justify-center gap-4">
                      <img
                        src={referenceImageUrl}
                        alt="Blueprint Preview"
                        className="w-20 h-20 object-cover rounded-lg border border-stone-200"
                      />
                      <div className="text-left">
                        <span className="text-xs font-semibold text-emerald-700 block">Image attached!</span>
                        <button
                          type="button"
                          onClick={() => setReferenceImageUrl('')}
                          className="text-[11px] text-red-600 hover:underline mt-1"
                        >
                          Remove and re-upload
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-6 h-6 text-stone-400 mx-auto mb-1.5" />
                      <label className="cursor-pointer text-xs font-semibold text-[#7e4b2c] hover:underline">
                        Upload CAD drawing, photo or hand sketch
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[10px] text-stone-400 mt-0.5">
                        PNG, JPG, or WEBP up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Describe Detailed Requirements & Modifications *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us what you want customized: specific storage boxes, brass work, headboard tufting, electrical sockets cutout, curved edges..."
                  className="w-full p-2.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#7e4b2c]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#7e4b2c] hover:bg-[#683d28] text-white text-xs font-semibold transition shadow-md flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Custom Blueprint'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
