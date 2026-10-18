import React, { useState } from 'react';
import { CartItem, Order } from '../types/furniture';
import { storageService } from '../services/storageService';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Truck,
  CreditCard,
  QrCode,
  MapPin,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderSuccess,
}) => {
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Rajasthan');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<
    'UPI' | 'Credit/Debit Card' | 'Netbanking' | 'Part Cash on Delivery (20% Advance)'
  >('UPI');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);
  const shippingFee = 0; // Free white glove assembly
  const totalAmount = subtotal;

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !address || !city || !pincode) return;
    setStep('payment');
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);

    const newOrderId = `SKF-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: newOrderId,
      createdAt: new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      items,
      totalAmount,
      subtotal,
      shippingFee,
      discountAmount: 0,
      customer: {
        fullName,
        email,
        phone,
        address,
        city,
        state,
        pincode,
      },
      paymentMethod,
      paymentStatus: paymentMethod === 'Part Cash on Delivery (20% Advance)' ? 'Advance Paid' : 'Paid',
      orderStatus: 'Confirmed',
      trackingUpdates: [
        {
          date: new Date().toLocaleDateString('en-IN') + ' ' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          stage: 'Order Confirmed',
          note: 'Order specifications & customized dimensions logged into workshop carpentry schedule.',
        },
        {
          date: 'Scheduled within 24h',
          stage: 'Timber Selection',
          note: 'Master timber craftsman will select Grade-A kiln-seasoned wood logs.',
        },
      ],
    };

    setTimeout(() => {
      storageService.addOrder(newOrder);
      storageService.clearCart();
      setPlacedOrder(newOrder);
      setIsProcessing(false);
      setStep('success');

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
      });

      onOrderSuccess(newOrder);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#dec099] p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'success' && placedOrder ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-300">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>

            <h2 className="font-serif text-2xl font-bold text-[#301a11] mb-1">
              Order Confirmed & Sent to Workshop!
            </h2>
            <p className="text-xs text-stone-600 mb-4">
              Thank you for choosing Satkkabir Furniture Udhyog. Your custom craftsmanship order is scheduled:
            </p>

            <div className="inline-block px-5 py-2.5 bg-[#f5ede1] rounded-xl border border-[#cb9f6a] text-xl font-mono font-extrabold text-[#7e4b2c] mb-6">
              Order ID: {placedOrder.id}
            </div>

            <div className="bg-stone-50 p-4 rounded-xl text-xs text-left max-w-lg mx-auto space-y-2 border border-stone-200 mb-6">
              <div className="flex justify-between border-b pb-2">
                <span className="text-stone-500">Delivery To:</span>
                <span className="font-semibold text-stone-900">
                  {placedOrder.customer.fullName}, {placedOrder.customer.city} ({placedOrder.customer.pincode})
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-stone-500">Payment:</span>
                <span className="font-semibold text-emerald-800">
                  {placedOrder.paymentMethod} (₹{placedOrder.totalAmount.toLocaleString('en-IN')})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Status:</span>
                <span className="font-bold text-[#7e4b2c]">
                  Workshop Carpentry Queue Active
                </span>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[#7e4b2c] hover:bg-[#683d28] text-white font-semibold text-xs transition"
              >
                Track Order & Return to Store
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Step Wizard Header */}
            <div className="flex items-center justify-between mb-6 border-b border-stone-200 pb-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#301a11]">
                  {step === 'details' ? '1. Shipping & Delivery Address' : '2. Payment & Confirmation'}
                </h2>
                <p className="text-xs text-stone-500">
                  White glove delivery with in-room assembly by certified carpenters
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className={`px-2.5 py-1 rounded-full ${step === 'details' ? 'bg-[#7e4b2c] text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                  1. Address
                </span>
                <span className="text-stone-300">→</span>
                <span className={`px-2.5 py-1 rounded-full ${step === 'payment' ? 'bg-[#7e4b2c] text-white' : 'bg-stone-100 text-stone-500'}`}>
                  2. Payment
                </span>
              </div>
            </div>

            {/* STEP 1: Details */}
            {step === 'details' && (
              <form onSubmit={handleDetailsSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rameshwar Patel"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#7e4b2c]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Mobile / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98XXX XXXXX"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#7e4b2c]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#7e4b2c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    House / Flat / Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House No., Building, Street Name, Floor Number"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#7e4b2c]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Jaipur"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#7e4b2c]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      State *
                    </label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#7e4b2c] bg-white"
                    >
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Delhi NCR">Delhi NCR</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Other States">Other States</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="6 digits (e.g. 302001)"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#7e4b2c]"
                    />
                  </div>
                </div>

                <div className="p-3 bg-[#f5ede1] rounded-xl border border-[#cb9f6a]/60 text-xs text-stone-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#7e4b2c]" />
                    <span>Free White-Glove Installation to {city || 'Your Address'}</span>
                  </div>
                  <span className="text-emerald-700 font-bold">100% Covered</span>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#7e4b2c] hover:bg-[#683d28] text-white text-xs font-semibold flex items-center gap-2 shadow-md transition"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Payment */}
            {step === 'payment' && (
              <div className="space-y-4">
                <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-xs">
                  <div className="flex justify-between text-stone-600 mb-1">
                    <span>Delivering To:</span>
                    <strong className="text-stone-900">{fullName}, {city} ({pincode})</strong>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Total Order Value:</span>
                    <strong className="text-base font-serif text-[#7e4b2c]">
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </strong>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-2">
                    Select Payment Method:
                  </label>

                  <div className="space-y-2.5">
                    {[
                      {
                        id: 'UPI',
                        name: 'Instant UPI (Google Pay, PhonePe, Paytm, QR)',
                        desc: 'Zero transaction fee, immediate workshop scheduling ticket.',
                        icon: QrCode,
                      },
                      {
                        id: 'Part Cash on Delivery (20% Advance)',
                        name: '20% Custom Token Advance + 80% on Inspection at Delivery',
                        desc: 'Pay token now to begin carpentry wood cutting; remaining balance when delivered & assembled in your room.',
                        icon: Truck,
                      },
                      {
                        id: 'Credit/Debit Card',
                        name: 'Credit or Debit Card (Visa, Mastercard, RuPay)',
                        desc: 'Secure 256-bit encrypted card gateway.',
                        icon: CreditCard,
                      },
                      {
                        id: 'Netbanking',
                        name: 'Net Banking (All Major Indian Banks)',
                        desc: 'SBI, HDFC, ICICI, Axis, PNB, Bank of Baroda, etc.',
                        icon: Lock,
                      },
                    ].map((pm) => {
                      const isSelected = paymentMethod === pm.id;
                      const Icon = pm.icon;
                      return (
                        <div
                          key={pm.id}
                          onClick={() => setPaymentMethod(pm.id as any)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                            isSelected
                              ? 'border-[#7e4b2c] bg-[#fbf8f3] ring-2 ring-[#7e4b2c]/20 shadow-xs'
                              : 'border-stone-200 hover:border-stone-300 bg-white'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                              isSelected ? 'border-[#7e4b2c] bg-[#7e4b2c]' : 'border-stone-300'
                            }`}
                          >
                            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-1.5">
                              <Icon className="w-4 h-4 text-[#7e4b2c]" />
                              <span className="text-xs font-bold text-stone-900">{pm.name}</span>
                            </div>
                            <p className="text-[11px] text-stone-500 mt-0.5">{pm.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-500 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Your purchase is protected by Satkkabir Furniture Udhyog 10-Year Solid Timber Warranty & Factory Assurance.
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep('details')}
                    className="text-xs font-semibold text-stone-600 hover:text-stone-900"
                  >
                    ← Back to Address
                  </button>
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handlePlaceOrder}
                    className="px-6 py-2.5 rounded-xl bg-[#7e4b2c] hover:bg-[#683d28] text-white text-xs font-bold transition shadow-md flex items-center gap-2"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>
                      {isProcessing
                        ? 'Confirming with Workshop...'
                        : paymentMethod === 'Part Cash on Delivery (20% Advance)'
                        ? `Pay Advance Token (₹${Math.round(totalAmount * 0.2).toLocaleString('en-IN')})`
                        : `Pay ₹${totalAmount.toLocaleString('en-IN')}`}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
