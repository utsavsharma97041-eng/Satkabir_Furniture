import React, { useState } from 'react';
import { Order } from '../types/furniture';
import { storageService } from '../services/storageService';
import {
  X,
  Search,
  CheckCircle2,
  Clock,
  Hammer,
  Truck,
  Sparkles,
  Phone,
  Layers,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderId?: string;
}

const STAGES = [
  { key: 'Confirmed', label: 'Order Confirmed', desc: 'Custom blueprints & specifications verified by workshop head' },
  { key: 'Timber Selection', label: 'Timber Selection & Kiln-Seasoning', desc: 'Kiln-dried pure wood logs selected with moisture check' },
  { key: 'Workshop Carpentry', label: 'Carpentry & Structural Joinery', desc: 'Mortise & tenon framing, CNC cut joints, storage hydraulic mounting' },
  { key: 'Polishing & Upholstery', label: 'Hand Sanding, Polish & Fabric', desc: 'Fine sanding, multi-coat Italian PU lacquer & fabric tufting' },
  { key: 'Quality Check', label: '15-Point Quality Assurance', desc: 'Creak test, weight load test (500kg), and surface finish check' },
  { key: 'Out for White Glove Delivery', label: 'Dispatched & Assembly', desc: 'White-glove transit with expert carpenters for room assembly' },
];

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  initialOrderId,
}) => {
  const [searchId, setSearchId] = useState(initialOrderId || 'SKF-8942');
  const [orders] = useState<Order[]>(storageService.getOrders());
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(() => {
    const all = storageService.getOrders();
    return all.find((o) => o.id.toLowerCase() === (initialOrderId || 'SKF-8942').toLowerCase()) || all[0] || null;
  });

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchId.trim().toUpperCase();
    const match = orders.find((o) => o.id.toUpperCase() === query);
    setSelectedOrder(match || null);
  };

  const getStageIndex = (stage: string) => {
    const idx = STAGES.findIndex((s) => s.key === stage);
    return idx === -1 ? 2 : idx;
  };

  const currentStageIndex = selectedOrder ? getStageIndex(selectedOrder.orderStatus) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#dec099] p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-1.5 text-xs uppercase font-bold tracking-wider text-[#b98144] mb-1">
            <Hammer className="w-4 h-4" />
            <span>Workshop Live Telemetry</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#301a11]">
            Track Your Custom Furniture Build
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time status updates directly from Satkkabir Furniture Udhyog carpentry workshop bays.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Order ID (e.g. SKF-8942)"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#7e4b2c] font-mono uppercase"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#7e4b2c] hover:bg-[#683d28] text-white text-xs font-semibold rounded-xl transition"
          >
            Track Status
          </button>
        </form>

        {/* Recent Orders quick picker */}
        {orders.length > 1 && (
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
            <span className="text-[11px] text-stone-400 whitespace-nowrap">Your Orders:</span>
            {orders.map((o) => (
              <button
                key={o.id}
                onClick={() => {
                  setSearchId(o.id);
                  setSelectedOrder(o);
                }}
                className={`text-xs px-2.5 py-1 rounded-lg border font-mono transition ${
                  selectedOrder?.id === o.id
                    ? 'bg-[#7e4b2c] text-white border-[#7e4b2c]'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {o.id} ({o.customer.fullName.split(' ')[0]})
              </button>
            ))}
          </div>
        )}

        {selectedOrder ? (
          <div className="space-y-6">
            {/* Order Card Overview */}
            <div className="p-4 bg-[#fcfaf7] rounded-xl border border-[#cb9f6a]/60">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/80 pb-3 mb-3">
                <div>
                  <span className="text-[11px] text-stone-500 block">Order Number</span>
                  <span className="text-base font-mono font-extrabold text-[#7e4b2c]">
                    {selectedOrder.id}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-stone-500 block">Booked Date</span>
                  <span className="text-xs font-semibold text-stone-800">
                    {selectedOrder.createdAt}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-stone-500 block">Total Investment</span>
                  <span className="text-xs font-bold text-stone-900">
                    ₹{selectedOrder.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Items in this order */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wide">
                  Items in Fabrication:
                </span>
                {selectedOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 text-xs bg-white p-2.5 rounded-lg border border-stone-200"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-10 h-10 rounded object-cover border border-stone-200 shrink-0"
                      />
                      <div>
                        <span className="font-bold text-stone-900 block">{item.productName}</span>
                        {item.isCustomized && item.customizationDetails && (
                          <span className="text-[10px] text-stone-500">
                            {item.customizationDetails.dimensions.length}"×{item.customizationDetails.dimensions.width}"×{item.customizationDetails.dimensions.height}" • {item.customizationDetails.woodType.split('(')[0]}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-[#7e4b2c] shrink-0">
                      ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stepper Timeline */}
            <div>
              <h3 className="font-serif font-bold text-base text-[#301a11] mb-4">
                Carpentry & Assembly Timeline
              </h3>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#dec099]">
                {STAGES.map((stg, index) => {
                  const isDone = index < currentStageIndex;
                  const isCurrent = index === currentStageIndex;
                  return (
                    <div key={stg.key} className="relative flex items-start gap-4">
                      {/* Step Circle */}
                      <div
                        className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                          isDone
                            ? 'bg-emerald-600 text-white'
                            : isCurrent
                            ? 'bg-[#7e4b2c] text-white ring-4 ring-[#7e4b2c]/20'
                            : 'bg-stone-200 text-stone-400'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <span className="text-[10px] font-bold">{index + 1}</span>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4
                            className={`text-xs font-bold ${
                              isCurrent
                                ? 'text-[#7e4b2c] font-extrabold'
                                : isDone
                                ? 'text-stone-900'
                                : 'text-stone-400'
                            }`}
                          >
                            {stg.label}
                          </h4>
                          {isCurrent && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full animate-pulse">
                              Active Stage in Workshop
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-[11px] mt-0.5 ${
                            isCurrent || isDone ? 'text-stone-600' : 'text-stone-400'
                          }`}
                        >
                          {stg.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Workshop Log Notes */}
            {selectedOrder.trackingUpdates && selectedOrder.trackingUpdates.length > 0 && (
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                <span className="text-xs font-bold text-stone-700 block mb-2">
                  Workshop Floor Logbook:
                </span>
                <div className="space-y-2">
                  {selectedOrder.trackingUpdates.map((log, i) => (
                    <div key={i} className="text-xs border-l-2 border-[#b98144] pl-3 py-1">
                      <div className="flex justify-between text-[11px] text-stone-400 mb-0.5">
                        <span className="font-semibold text-stone-700">{log.stage}</span>
                        <span>{log.date}</span>
                      </div>
                      <p className="text-stone-600 text-[11px]">{log.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 bg-stone-50 rounded-xl border border-dashed border-stone-300">
            <p className="text-xs text-stone-500 mb-2">
              No order found matching ID: <strong>{searchId}</strong>
            </p>
            <p className="text-[11px] text-stone-400">
              Please double check the Order ID sent via SMS/WhatsApp or try typing <strong>SKF-8942</strong>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
