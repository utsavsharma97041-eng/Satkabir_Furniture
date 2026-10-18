import { CartItem, CustomInquiry, FurnitureProduct, Order, ProductReview, ProductAlertSubscription } from '../types/furniture';
import { INITIAL_CUSTOM_INQUIRIES, INITIAL_PRODUCTS } from '../data/mockFurniture';

const PRODUCTS_KEY = 'satkkabir_products_v1';
const CART_KEY = 'satkkabir_cart_v1';
const INQUIRIES_KEY = 'satkkabir_inquiries_v1';
const ORDERS_KEY = 'satkkabir_orders_v1';
const WISHLIST_KEY = 'satkkabir_wishlist_v1';
const ALERTS_KEY = 'satkkabir_product_alerts_v1';

export const storageService = {
  // Products
  getProducts: (): FurnitureProduct[] => {
    try {
      const stored = localStorage.getItem(PRODUCTS_KEY);
      if (!stored) {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
        return INITIAL_PRODUCTS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_PRODUCTS;
    }
  },

  saveProducts: (products: FurnitureProduct[]) => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  },

  addProduct: (product: FurnitureProduct) => {
    const list = storageService.getProducts();
    const updated = [product, ...list];
    storageService.saveProducts(updated);
    return updated;
  },

  updateProduct: (updatedProduct: FurnitureProduct) => {
    const list = storageService.getProducts();
    const updated = list.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
    storageService.saveProducts(updated);
    return updated;
  },

  deleteProduct: (id: string) => {
    const list = storageService.getProducts();
    const updated = list.filter((p) => p.id !== id);
    storageService.saveProducts(updated);
    return updated;
  },

  resetProductsToDefault: () => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  },

  // Cart
  getCart: (): CartItem[] => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveCart: (cart: CartItem[]) => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  },

  addToCart: (item: CartItem): CartItem[] => {
    const cart = storageService.getCart();
    // If it's a customized item, treat each customization as a distinct item
    if (item.isCustomized) {
      const updated = [item, ...cart];
      storageService.saveCart(updated);
      return updated;
    }

    // If identical standard item exists, bump quantity
    const existingIndex = cart.findIndex((i) => i.productId === item.productId && !i.isCustomized);
    let updated: CartItem[];
    if (existingIndex > -1) {
      updated = [...cart];
      updated[existingIndex].quantity += item.quantity;
    } else {
      updated = [item, ...cart];
    }
    storageService.saveCart(updated);
    return updated;
  },

  updateCartQuantity: (cartItemId: string, delta: number): CartItem[] => {
    const cart = storageService.getCart();
    const updated = cart
      .map((item) => {
        if (item.id === cartItemId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean) as CartItem[];
    storageService.saveCart(updated);
    return updated;
  },

  removeFromCart: (cartItemId: string): CartItem[] => {
    const cart = storageService.getCart();
    const updated = cart.filter((i) => i.id !== cartItemId);
    storageService.saveCart(updated);
    return updated;
  },

  clearCart: () => {
    localStorage.setItem(CART_KEY, JSON.stringify([]));
  },

  // Custom Inquiries / Bespoke Quotes
  getInquiries: (): CustomInquiry[] => {
    try {
      const stored = localStorage.getItem(INQUIRIES_KEY);
      if (!stored) {
        localStorage.setItem(INQUIRIES_KEY, JSON.stringify(INITIAL_CUSTOM_INQUIRIES));
        return INITIAL_CUSTOM_INQUIRIES;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_CUSTOM_INQUIRIES;
    }
  },

  saveInquiries: (inquiries: CustomInquiry[]) => {
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify(inquiries));
  },

  addInquiry: (inquiry: CustomInquiry): CustomInquiry[] => {
    const list = storageService.getInquiries();
    const updated = [inquiry, ...list];
    storageService.saveInquiries(updated);
    return updated;
  },

  updateInquiry: (updatedInq: CustomInquiry): CustomInquiry[] => {
    const list = storageService.getInquiries();
    const updated = list.map((i) => (i.id === updatedInq.id ? updatedInq : i));
    storageService.saveInquiries(updated);
    return updated;
  },

  // Orders
  getOrders: (): Order[] => {
    try {
      const stored = localStorage.getItem(ORDERS_KEY);
      if (!stored) {
        // Sample order for demo & tracking test
        const sampleOrder: Order = {
          id: 'SKF-8942',
          createdAt: '2026-10-17 02:40 PM',
          items: [
            {
              id: 'cart-demo-1',
              productId: 'skf-bed-01',
              productName: 'Maharaja Sheesham Wood King Bed',
              imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop',
              category: 'Bedroom',
              unitPrice: 44300,
              quantity: 1,
              isCustomized: true,
              customizationDetails: {
                woodType: 'Sheesham Wood (Indian Rosewood)',
                finish: 'Honey Teak Matte',
                fabric: 'Royal Velvet - Emerald Green',
                dimensions: { length: 84, width: 78, height: 50 },
                addons: [
                  { id: 'addon-hydraulic', name: 'German Heavy-Duty Hydraulic Lift Storage', price: 5800 },
                ],
                carvingStyle: 'Royal Heritage Brass Inlay',
              },
            },
          ],
          totalAmount: 44300,
          subtotal: 44300,
          shippingFee: 0,
          discountAmount: 0,
          customer: {
            fullName: 'Virendra Singh',
            email: 'virendra@example.com',
            phone: '+91 98765 43210',
            address: 'B-42, Gulmohar Enclave, Malviya Nagar',
            city: 'Jaipur',
            state: 'Rajasthan',
            pincode: '302017',
          },
          paymentMethod: 'UPI',
          paymentStatus: 'Paid',
          orderStatus: 'Workshop Carpentry',
          trackingUpdates: [
            {
              date: '2026-10-17 02:45 PM',
              stage: 'Order Confirmed',
              note: 'Custom specifications and hydraulic fittings sent to master carpenter workshop.',
            },
            {
              date: '2026-10-17 06:15 PM',
              stage: 'Timber Selection',
              note: 'Grade-A kiln-seasoned Sheesham timber logs selected with 8-10% moisture content check.',
            },
            {
              date: '2026-10-18 09:30 AM',
              stage: 'Workshop Carpentry',
              note: 'Mortise and tenon joinery cutting and hydraulic frame assembly underway in Workshop Bay 2.',
            },
          ],
        };
        localStorage.setItem(ORDERS_KEY, JSON.stringify([sampleOrder]));
        return [sampleOrder];
      }
      return JSON.parse(stored);
    } catch {
      return [];
    }
  },

  addOrder: (order: Order): Order[] => {
    const list = storageService.getOrders();
    const updated = [order, ...list];
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
    return updated;
  },

  updateOrder: (updatedOrder: Order): Order[] => {
    const list = storageService.getOrders();
    const updated = list.map((o) => (o.id === updatedOrder.id ? updatedOrder : o));
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
    return updated;
  },

  // Wishlist
  getWishlist: (): string[] => {
    try {
      const stored = localStorage.getItem(WISHLIST_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  toggleWishlist: (productId: string): string[] => {
    const list = storageService.getWishlist();
    const exists = list.includes(productId);
    const updated = exists ? list.filter((id) => id !== productId) : [...list, productId];
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
    return updated;
  },

  // Reviews
  getReviews: async (productId: string): Promise<ProductReview[]> => {
    const defaultReviews: ProductReview[] = [
      {
        id: `rev-${productId}-1`,
        productId,
        userId: 'usr-verif-1',
        userName: 'Vikramaditya Rathore',
        userPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
        rating: 5,
        title: 'Heirloom quality Sheesham, extremely heavy & solid!',
        comment:
          'Ordered this piece with custom length modification (+4 inches to fit our bedroom niche). The kiln-seasoned Sheesham wood grain is absolutely magnificent. Zero squeaks, and the hydraulic mechanism lifts a heavy 10-inch mattress with one hand effortlessly. Delivered to Jaipur with free white-glove carpentry assembly!',
        woodTypePurchased: 'Sheesham Wood (Indian Rosewood)',
        verifiedBuyer: true,
        createdAt: '3 days ago',
        helpfulCount: 14,
      },
      {
        id: `rev-${productId}-2`,
        productId,
        userId: 'usr-verif-2',
        userName: 'Meenakshi Sundaram',
        userPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
        rating: 5,
        title: 'Flawless joinery and authentic teak aroma',
        comment:
          'You can smell the natural timber essential oils immediately. The mortise and tenon joinery is seamless without visible screws or ugly plastic caps. The artisans from Satkkabir even color-matched our existing wardrobe polish. Outstanding Indian craftsmanship!',
        woodTypePurchased: 'CP Teak Wood (Sagwan)',
        verifiedBuyer: true,
        createdAt: '1 week ago',
        helpfulCount: 9,
      },
      {
        id: `rev-${productId}-3`,
        productId,
        userId: 'usr-verif-3',
        userName: 'Harshvardhan Joshi',
        rating: 4,
        title: 'Very sturdy, worth every rupee',
        comment:
          'The timber thickness is a genuine 35mm solid slab, not hollow plywood. Took about 8 days for workshop fabrication and delivery, but the wait was completely worth it. Highly recommend Satkkabir Furniture Udhyog.',
        woodTypePurchased: 'Honey Teak Matte',
        verifiedBuyer: true,
        createdAt: '2 weeks ago',
        helpfulCount: 6,
      },
    ];

    try {
      const stored = localStorage.getItem(`satkkabir_reviews_${productId}`);
      const localReviews: ProductReview[] = stored ? JSON.parse(stored) : defaultReviews;

      // Try fetching from Firestore if available
      try {
        const { collection, getDocs, query, where } = await import('firebase/firestore');
        const { db } = await import('./firebase');
        const q = query(collection(db, 'reviews'), where('productId', '==', productId));
        const querySnapshot = await getDocs(q);
        const firestoreReviews: ProductReview[] = [];
        querySnapshot.forEach((doc) => {
          firestoreReviews.push(doc.data() as ProductReview);
        });

        if (firestoreReviews.length > 0) {
          // Merge unique reviews
          const merged = [...firestoreReviews];
          localReviews.forEach((lr) => {
            if (!merged.some((mr) => mr.id === lr.id)) {
              merged.push(lr);
            }
          });
          localStorage.setItem(`satkkabir_reviews_${productId}`, JSON.stringify(merged));
          return merged;
        }
      } catch (e) {
        // Firestore query failed or offline, fall back to local
      }

      return localReviews;
    } catch {
      return defaultReviews;
    }
  },

  addReview: async (review: ProductReview): Promise<ProductReview[]> => {
    const key = `satkkabir_reviews_${review.productId}`;
    const stored = localStorage.getItem(key);
    const existing: ProductReview[] = stored ? JSON.parse(stored) : [];
    const updated = [review, ...existing];
    localStorage.setItem(key, JSON.stringify(updated));

    // Try saving to Firestore
    try {
      const { doc, setDoc } = await import('firebase/firestore');
      const { db } = await import('./firebase');
      await setDoc(doc(db, 'reviews', review.id), review);
    } catch (err) {
      console.warn('Firestore review save fallback to local:', err);
    }

    return updated;
  },

  markReviewHelpful: (productId: string, reviewId: string): ProductReview[] => {
    const key = `satkkabir_reviews_${productId}`;
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    const reviews: ProductReview[] = JSON.parse(stored);
    const updated = reviews.map((r) =>
      r.id === reviewId ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r
    );
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
  },

  // Product Alerts (Notify Me: Price Drop & Back in Stock)
  getProductAlerts: (userEmail?: string): ProductAlertSubscription[] => {
    try {
      const stored = localStorage.getItem(ALERTS_KEY);
      const alerts: ProductAlertSubscription[] = stored ? JSON.parse(stored) : [];
      if (userEmail) {
        return alerts.filter(
          (a) => a.userEmail.toLowerCase() === userEmail.toLowerCase() && a.status === 'active'
        );
      }
      return alerts;
    } catch {
      return [];
    }
  },

  getProductAlertsForProduct: (productId: string, userEmail?: string): ProductAlertSubscription[] => {
    const alerts = storageService.getProductAlerts(userEmail);
    return alerts.filter((a) => a.productId === productId && a.status === 'active');
  },

  isProductAlerted: (productId: string, userEmail?: string): boolean => {
    const alerts = storageService.getProductAlerts(userEmail);
    return alerts.some((a) => a.productId === productId && a.status === 'active');
  },

  addProductAlert: async (
    alert: ProductAlertSubscription
  ): Promise<ProductAlertSubscription[]> => {
    const all = storageService.getProductAlerts();
    // Check if duplicate already active for this product + email
    const filtered = all.filter(
      (a) =>
        !(
          a.productId === alert.productId &&
          a.userEmail.toLowerCase() === alert.userEmail.toLowerCase()
        )
    );
    const updated = [alert, ...filtered];
    localStorage.setItem(ALERTS_KEY, JSON.stringify(updated));

    // Also remember user email in localStorage for convenience
    try {
      localStorage.setItem('satkkabir_saved_alert_email', alert.userEmail);
    } catch {
      // ignore
    }

    // Try saving to Firestore if configured
    try {
      const { doc, setDoc } = await import('firebase/firestore');
      const { db } = await import('./firebase');
      await setDoc(doc(db, 'product_alerts', alert.id), alert);
    } catch (err) {
      console.warn('Firestore product alert save fallback to local:', err);
    }

    return updated;
  },

  removeProductAlert: async (
    alertId: string
  ): Promise<ProductAlertSubscription[]> => {
    const all = storageService.getProductAlerts();
    const updated = all.filter((a) => a.id !== alertId);
    localStorage.setItem(ALERTS_KEY, JSON.stringify(updated));

    try {
      const { doc, deleteDoc } = await import('firebase/firestore');
      const { db } = await import('./firebase');
      await deleteDoc(doc(db, 'product_alerts', alertId));
    } catch (err) {
      console.warn('Firestore product alert delete fallback to local:', err);
    }

    return updated;
  },

  getSavedAlertEmail: (): string => {
    try {
      return localStorage.getItem('satkkabir_saved_alert_email') || '';
    } catch {
      return '';
    }
  },
};
