export type WoodType = 'Sheesham Wood (Indian Rosewood)' | 'CP Teak Wood (Sagwan)' | 'Mango Wood' | 'Rosewood (Shisham Special)' | 'Acacia Hardwood';

export type PolishFinish = 
  | 'Natural Teak Gloss'
  | 'Rich Walnut Satin'
  | 'Dark Mahogany'
  | 'Honey Teak Matte'
  | 'Distressed Antique Brown'
  | 'Raw Organic Waxed';

export type FabricType = 
  | 'Royal Velvet - Emerald Green'
  | 'Royal Velvet - Royal Navy'
  | 'Royal Velvet - Mustard Gold'
  | 'Pure Organic Linen - Warm Beige'
  | 'Premium Leatherette - Tan Cognac'
  | 'Premium Leatherette - Espresso'
  | 'Textured Jute Blend - Natural Grey'
  | 'No Fabric / Pure Wood';

export interface CustomAddon {
  id: string;
  name: string;
  description: string;
  price: number;
  availableFor: (
    | 'Bed'
    | 'Sofa'
    | 'Dining'
    | 'Mandir'
    | 'Table'
    | 'Wardrobe'
    | 'Living Room'
    | 'Bedroom'
    | 'Dining & Kitchen'
    | 'Pooja Mandir'
    | 'Study & Office'
    | 'Storage & Decor'
    | 'All'
  )[];
}

export interface FurnitureProduct {
  id: string;
  name: string;
  hindiName?: string;
  category: 'Living Room' | 'Bedroom' | 'Dining & Kitchen' | 'Pooja Mandir' | 'Study & Office' | 'Storage & Decor';
  price: number;
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  additionalImages?: string[];
  description: string;
  woodType: WoodType;
  availableWoodTypes: WoodType[];
  finish: PolishFinish;
  availableFinishes: PolishFinish[];
  availableFabrics?: FabricType[];
  dimensions: {
    length: number; // inches
    width: number;  // inches (depth)
    height: number; // inches
    unit: 'inches' | 'ft';
  };
  weightKg: number;
  isCustomizable: boolean;
  featured?: boolean;
  bestseller?: boolean;
  warrantyYears: number;
  stockCount: number;
  craftingTimeDays: number;
  features: string[];
}

export interface CustomizationState {
  baseProductId: string;
  baseProductName: string;
  woodType: WoodType;
  finish: PolishFinish;
  fabric: FabricType;
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: 'inches';
  };
  selectedAddons: string[]; // addon ids
  customNotes: string;
  calculatedPrice: number;
  carvingStyle?: 'Modern Minimalist' | 'Traditional Floral Carving' | 'Geometric Jali Work' | 'Royal Heritage Brass Inlay';
}

export interface CartItem {
  id: string; // unique cart entry ID
  productId: string;
  productName: string;
  imageUrl: string;
  category: string;
  unitPrice: number;
  quantity: number;
  isCustomized: boolean;
  customizationDetails?: {
    woodType: WoodType;
    finish: PolishFinish;
    fabric?: FabricType;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    addons: { id: string; name: string; price: number }[];
    carvingStyle?: string;
    customNotes?: string;
  };
}

export interface CustomInquiry {
  id: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  city: string;
  productType: string;
  woodPreference: WoodType;
  finishPreference: PolishFinish;
  approxDimensions: string;
  budgetInr: number;
  referenceImageUrl?: string;
  description: string;
  status: 'In Review' | 'Blueprint Approved' | 'In Carpentry Workshop' | 'Wood Carving & Polishing' | 'Ready for Dispatch' | 'Delivered';
  estimatedDeliveryDate?: string;
  adminQuotedPrice?: number;
  adminNotes?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  totalAmount: number;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: 'UPI' | 'Credit/Debit Card' | 'Netbanking' | 'Part Cash on Delivery (20% Advance)';
  paymentStatus: 'Paid' | 'Advance Paid' | 'Pending';
  orderStatus: 'Confirmed' | 'Timber Selection' | 'Workshop Carpentry' | 'Polishing & Upholstery' | 'Quality Check' | 'Out for White Glove Delivery' | 'Delivered';
  trackingUpdates: {
    date: string;
    stage: string;
    note: string;
  }[];
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  rating: number; // 1 to 5
  title?: string;
  comment: string;
  woodTypePurchased?: string;
  verifiedBuyer: boolean;
  createdAt: string;
  helpfulCount: number;
}

export type ProductAlertType = 'price_drop' | 'back_in_stock' | 'both';

export interface ProductAlertSubscription {
  id: string;
  productId: string;
  productName: string;
  productImageUrl?: string;
  userEmail: string;
  userId?: string;
  alertType: ProductAlertType;
  currentPrice: number;
  targetPrice?: number;
  stockCountAtSubscription: number;
  createdAt: string;
  status: 'active' | 'triggered' | 'cancelled';
  notifyOnPriceDrop: boolean;
  notifyOnRestock: boolean;
  notes?: string;
}
