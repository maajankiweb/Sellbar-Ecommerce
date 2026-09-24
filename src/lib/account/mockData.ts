import {
  Order, Return, WishlistProduct, RecentlyViewedProduct, RecommendedProduct,
  PaymentMethod, Transaction, WalletData, GiftCard, LoyaltyData, Referral,
  SupportTicket, Review, PendingReview, LoginActivity, CustomerProfile,
  Notification, Address, CommunicationPreferences, OrderStatus, OrderTimeline
} from '@/types/account';

// ─── MOCK CUSTOMER PROFILE ─────────────────────────────────────────────────
export const mockProfile: CustomerProfile = {
  id: 'usr_rahul_001',
  name: 'Rahul Sharma',
  firstName: 'Rahul',
  lastName: 'Sharma',
  email: 'rahul.sharma@gmail.com',
  phone: '+91 98765 43210',
  dateOfBirth: '1995-07-15',
  gender: 'MALE',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  totalOrders: 24,
  totalSpent: 87450,
  memberSince: '2023-03-12',
  tier: 'GOLD',
  points: 2450,
  walletBalance: 1250,
};

// ─── MOCK ADDRESSES ─────────────────────────────────────────────────────────
export const mockAddresses: Address[] = [
  {
    id: 'addr_001',
    label: 'Home',
    name: 'Rahul Sharma',
    phone: '9876543210',
    line1: '12A, Sunrise Apartment, Bailey Road',
    line2: 'Near Patna Junction',
    landmark: 'Opposite State Bank of India',
    city: 'Patna',
    state: 'Bihar',
    pincode: '800001',
    country: 'India',
    isDefault: true,
  },
  {
    id: 'addr_002',
    label: 'Office',
    name: 'Rahul Sharma',
    phone: '9876543210',
    line1: '5th Floor, Techno Park, IT Hub',
    city: 'Patna',
    state: 'Bihar',
    pincode: '800010',
    country: 'India',
    isDefault: false,
  },
];

// ─── ORDER TIMELINE HELPER ───────────────────────────────────────────────────
export function buildTimeline(currentStatus: OrderStatus): OrderTimeline[] {
  const steps: { status: OrderStatus; label: string }[] = [
    { status: 'PLACED', label: 'Order Placed' },
    { status: 'PAYMENT_CONFIRMED', label: 'Payment Confirmed' },
    { status: 'PROCESSING', label: 'Processing' },
    { status: 'PACKED', label: 'Packed' },
    { status: 'SHIPPED', label: 'Shipped' },
    { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
    { status: 'DELIVERED', label: 'Delivered' },
  ];

  const statusOrder = steps.map(s => s.status);
  const currentIdx = statusOrder.indexOf(currentStatus);

  return steps.map((step, idx) => ({
    ...step,
    isCompleted: idx < currentIdx,
    isCurrent: idx === currentIdx,
    date: idx <= currentIdx ? new Date(Date.now() - (currentIdx - idx) * 24 * 3600000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : undefined,
    time: idx <= currentIdx ? ['10:30 AM', '11:15 AM', '02:40 PM', '04:00 PM', '09:00 AM', '07:30 AM', '02:15 PM'][idx] : undefined,
  }));
}

// ─── MOCK ORDERS ─────────────────────────────────────────────────────────────
export const mockOrders: Order[] = [
  {
    id: 'order_001',
    orderId: 'ORD-10245',
    placedAt: '2026-09-18T10:30:00Z',
    status: 'OUT_FOR_DELIVERY',
    items: [
      {
        id: 'item_001',
        productId: 'prod_headphones',
        name: 'Sony WH-1000XM5 Wireless ANC Headphones',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80',
        variant: 'Black | One Size',
        sku: 'SONY-WH1000XM5-BLK',
        quantity: 1,
        price: 3299,
        originalPrice: 3999,
        discount: 700,
        total: 3299,
        isReviewed: false,
        canReturn: true,
      },
      {
        id: 'item_002',
        productId: 'prod_cable',
        name: 'Anker USB-C to USB-C Braided Cable 2m',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&auto=format&fit=crop&q=80',
        variant: 'Black | 2m',
        sku: 'ANKER-USBC-2M-BLK',
        quantity: 2,
        price: 500,
        originalPrice: 699,
        discount: 199,
        total: 1000,
        isReviewed: false,
        canReturn: true,
      },
    ],
    subtotal: 4299,
    discount: 700,
    shipping: 0,
    tax: 387,
    walletCredit: 0,
    total: 3986,
    shippingAddress: {
      name: 'Rahul Sharma',
      phone: '9876543210',
      line1: '12A, Sunrise Apartment, Bailey Road',
      line2: 'Near Patna Junction',
      city: 'Patna',
      state: 'Bihar',
      pincode: '800001',
      country: 'India',
    },
    paymentMethod: 'UPI - rahul@upi',
    trackingId: 'TRK-938475',
    courierPartner: 'Delhivery Express',
    expectedDelivery: '2026-09-24',
    timeline: buildTimeline('OUT_FOR_DELIVERY'),
  },
  {
    id: 'order_002',
    orderId: 'ORD-09876',
    placedAt: '2026-08-22T14:20:00Z',
    status: 'DELIVERED',
    items: [
      {
        id: 'item_003',
        productId: 'prod_watch',
        name: 'boAt Smartwatch Wave Sigma Pro',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80',
        variant: 'Gunmetal Grey | One Size',
        sku: 'BOAT-WSIGPRO-GUN',
        quantity: 1,
        price: 2499,
        originalPrice: 4999,
        discount: 2500,
        total: 2499,
        isReviewed: true,
        canReturn: false,
      },
    ],
    subtotal: 2499,
    discount: 2500,
    shipping: 0,
    tax: 225,
    total: 2724,
    shippingAddress: {
      name: 'Rahul Sharma',
      phone: '9876543210',
      line1: '12A, Sunrise Apartment, Bailey Road',
      city: 'Patna',
      state: 'Bihar',
      pincode: '800001',
      country: 'India',
    },
    paymentMethod: 'Credit Card - HDFC',
    trackingId: 'TRK-827364',
    courierPartner: 'BlueDart',
    deliveredAt: '2026-08-25T14:30:00Z',
    timeline: buildTimeline('DELIVERED'),
  },
  {
    id: 'order_003',
    orderId: 'ORD-09541',
    placedAt: '2026-08-05T09:15:00Z',
    status: 'REFUNDED',
    items: [
      {
        id: 'item_004',
        productId: 'prod_shoes',
        name: 'Nike Air Max 270 Running Shoes',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&auto=format&fit=crop&q=80',
        variant: 'White/Blue | Size 9',
        sku: 'NIKE-AM270-WB-9',
        quantity: 1,
        price: 6995,
        originalPrice: 8495,
        discount: 1500,
        total: 6995,
        isReviewed: false,
        canReturn: false,
      },
    ],
    subtotal: 6995,
    discount: 1500,
    shipping: 0,
    tax: 629,
    total: 6124,
    shippingAddress: {
      name: 'Rahul Sharma',
      phone: '9876543210',
      line1: '12A, Sunrise Apartment, Bailey Road',
      city: 'Patna',
      state: 'Bihar',
      pincode: '800001',
      country: 'India',
    },
    paymentMethod: 'UPI - rahul@upi',
    timeline: buildTimeline('DELIVERED'),
  },
  {
    id: 'order_004',
    orderId: 'ORD-08233',
    placedAt: '2026-07-10T16:45:00Z',
    status: 'DELIVERED',
    items: [
      {
        id: 'item_005',
        productId: 'prod_hoodie',
        name: 'H&M Premium Cotton Oversized Hoodie',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=200&auto=format&fit=crop&q=80',
        variant: 'Olive Green | L',
        sku: 'HM-OHOODIE-OLV-L',
        quantity: 2,
        price: 1499,
        originalPrice: 2499,
        discount: 1000,
        total: 2998,
        isReviewed: false,
        canReturn: false,
      },
    ],
    subtotal: 2998,
    discount: 2000,
    shipping: 0,
    tax: 270,
    total: 3268,
    shippingAddress: {
      name: 'Rahul Sharma',
      phone: '9876543210',
      line1: '12A, Sunrise Apartment, Bailey Road',
      city: 'Patna',
      state: 'Bihar',
      pincode: '800001',
      country: 'India',
    },
    paymentMethod: 'Wallet - SELBAR Pay',
    timeline: buildTimeline('DELIVERED'),
  },
];

// ─── MOCK RETURNS ─────────────────────────────────────────────────────────────
export const mockReturns: Return[] = [
  {
    id: 'ret_001',
    returnId: 'RET-5521',
    orderId: 'ORD-09541',
    orderItem: mockOrders[2].items[0],
    reason: 'Size issue - received wrong size',
    status: 'REFUND_PROCESSING',
    refundAmount: 6124,
    refundMethod: 'Original Payment Method (UPI)',
    expectedRefundDate: '2026-09-27',
    pickupDate: '2026-09-21',
    createdAt: '2026-09-19T10:00:00Z',
    updatedAt: '2026-09-22T14:30:00Z',
  },
];

// ─── MOCK WISHLIST ────────────────────────────────────────────────────────────
export const mockWishlist: WishlistProduct[] = [
  {
    id: 'wl_001',
    productId: 'prod_iphone',
    name: 'Apple iPhone 15 (Certified Refurbished)',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewCount: 2341,
    price: 52999,
    originalPrice: 79900,
    discount: 34,
    inStock: true,
    priceDropped: true,
    priceDropAmount: 2000,
    addedAt: '2026-09-10T08:00:00Z',
  },
  {
    id: 'wl_002',
    productId: 'prod_macbook',
    name: 'MacBook Air M2 13-inch (Refurbished)',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewCount: 847,
    price: 89999,
    originalPrice: 114900,
    discount: 22,
    inStock: true,
    addedAt: '2026-09-15T12:30:00Z',
  },
  {
    id: 'wl_003',
    productId: 'prod_ps5',
    name: 'Sony PlayStation 5 Disc Edition',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=300&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewCount: 5621,
    price: 49990,
    originalPrice: 54990,
    discount: 9,
    inStock: false,
    addedAt: '2026-08-28T16:00:00Z',
  },
  {
    id: 'wl_004',
    productId: 'prod_galaxy',
    name: 'Samsung Galaxy S24 Ultra 256GB',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300&auto=format&fit=crop&q=80',
    rating: 4.6,
    reviewCount: 3890,
    price: 89999,
    originalPrice: 129999,
    discount: 31,
    inStock: true,
    addedAt: '2026-09-01T09:15:00Z',
  },
  {
    id: 'wl_005',
    productId: 'prod_laptop_backpack',
    name: 'Wildcraft Alpha Laptop Backpack 30L',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&auto=format&fit=crop&q=80',
    rating: 4.4,
    reviewCount: 1205,
    price: 1499,
    originalPrice: 2999,
    discount: 50,
    inStock: true,
    addedAt: '2026-09-18T11:00:00Z',
  },
  {
    id: 'wl_006',
    productId: 'prod_airpods',
    name: 'Apple AirPods Pro 2nd Generation',
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=300&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewCount: 4567,
    price: 19999,
    originalPrice: 24900,
    discount: 20,
    inStock: true,
    priceDropped: true,
    priceDropAmount: 1500,
    addedAt: '2026-09-05T14:00:00Z',
  },
];

// ─── MOCK RECENTLY VIEWED ─────────────────────────────────────────────────────
export const mockRecentlyViewed: RecentlyViewedProduct[] = [
  {
    id: 'rv_001',
    productId: 'prod_oneplus',
    name: 'OnePlus 12 (Refurbished, 256GB)',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=200&auto=format&fit=crop&q=80',
    price: 39999,
    rating: 4.5,
    inStock: true,
    viewedAt: new Date(Date.now() - 1 * 3600000).toISOString(),
  },
  {
    id: 'rv_002',
    productId: 'prod_speaker',
    name: 'JBL Charge 5 Bluetooth Speaker',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200&auto=format&fit=crop&q=80',
    price: 11999,
    rating: 4.6,
    inStock: true,
    viewedAt: new Date(Date.now() - 3 * 3600000).toISOString(),
  },
  {
    id: 'rv_003',
    productId: 'prod_tshirt',
    name: 'Bewakoof Oversized Graphic T-Shirt',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&auto=format&fit=crop&q=80',
    price: 499,
    rating: 4.2,
    inStock: true,
    viewedAt: new Date(Date.now() - 6 * 3600000).toISOString(),
  },
  {
    id: 'rv_004',
    productId: 'prod_phone_stand',
    name: 'Benks Smartphone Stand & Tablet Holder',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=200&auto=format&fit=crop&q=80',
    price: 799,
    rating: 4.3,
    inStock: true,
    viewedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
  },
];

// ─── MOCK RECOMMENDATIONS ─────────────────────────────────────────────────────
export const mockRecommendations: RecommendedProduct[] = [
  {
    id: 'rec_001',
    productId: 'prod_earbud',
    name: 'boAt Airdopes 141 TWS Earbuds',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&auto=format&fit=crop&q=80',
    price: 1299,
    originalPrice: 2990,
    discount: 57,
    rating: 4.3,
    reviewCount: 8932,
    reason: 'purchase',
  },
  {
    id: 'rec_002',
    productId: 'prod_charger',
    name: 'Anker 65W GaN Fast Charger USB-C',
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300&auto=format&fit=crop&q=80',
    price: 2499,
    originalPrice: 3499,
    discount: 29,
    rating: 4.7,
    reviewCount: 3210,
    reason: 'purchase',
  },
  {
    id: 'rec_003',
    productId: 'prod_powerbank',
    name: 'Mi 20000mAh Power Bank Pro',
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300&auto=format&fit=crop&q=80',
    price: 1999,
    originalPrice: 2999,
    discount: 33,
    rating: 4.5,
    reviewCount: 5421,
    reason: 'browse',
  },
  {
    id: 'rec_004',
    productId: 'prod_ipad',
    name: 'iPad Air 5th Gen (Refurbished)',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&auto=format&fit=crop&q=80',
    price: 42999,
    originalPrice: 59900,
    discount: 28,
    rating: 4.8,
    reviewCount: 1872,
    reason: 'trending',
  },
  {
    id: 'rec_005',
    productId: 'prod_mouse',
    name: 'Logitech MX Master 3S Wireless Mouse',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&auto=format&fit=crop&q=80',
    price: 7995,
    originalPrice: 9595,
    discount: 17,
    rating: 4.9,
    reviewCount: 2783,
    reason: 'similar',
  },
  {
    id: 'rec_006',
    productId: 'prod_keyboard',
    name: 'Keychron K2 Wireless Mechanical Keyboard',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&auto=format&fit=crop&q=80',
    price: 7499,
    originalPrice: 9499,
    discount: 21,
    rating: 4.7,
    reviewCount: 1458,
    reason: 'trending',
  },
];

// ─── MOCK PAYMENT METHODS ─────────────────────────────────────────────────────
export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm_001',
    type: 'CARD',
    label: 'HDFC Bank Credit Card',
    maskedNumber: '4242',
    cardBrand: 'VISA',
    expiryMonth: 9,
    expiryYear: 28,
    isDefault: true,
  },
  {
    id: 'pm_002',
    type: 'CARD',
    label: 'SBI Debit Card',
    maskedNumber: '7890',
    cardBrand: 'RUPAY',
    expiryMonth: 12,
    expiryYear: 27,
    isDefault: false,
  },
  {
    id: 'pm_003',
    type: 'UPI',
    label: 'UPI',
    upiId: 'rahul.sharma@okicici',
    isDefault: false,
  },
  {
    id: 'pm_004',
    type: 'WALLET',
    label: 'PhonePe Wallet',
    walletName: 'PhonePe',
    isDefault: false,
  },
];

// ─── MOCK TRANSACTIONS ────────────────────────────────────────────────────────
export const mockTransactions: Transaction[] = [
  {
    id: 'txn_001',
    transactionId: 'TXN-20260918-001',
    date: '2026-09-18T10:35:00Z',
    type: 'PAYMENT',
    description: 'Order #ORD-10245 - Sony Headphones + USB-C Cable',
    amount: -3986,
    status: 'SUCCESSFUL',
    paymentMethod: 'UPI - rahul@upi',
    orderId: 'ORD-10245',
  },
  {
    id: 'txn_002',
    transactionId: 'TXN-20260815-002',
    date: '2026-09-15T14:00:00Z',
    type: 'WALLET_CREDIT',
    description: 'Referral Bonus - Friend joined SELBAR',
    amount: 500,
    status: 'SUCCESSFUL',
  },
  {
    id: 'txn_003',
    transactionId: 'TXN-20260825-003',
    date: '2026-08-25T16:30:00Z',
    type: 'REFUND',
    description: 'Refund for Order #ORD-09541 - Nike Shoes',
    amount: 6124,
    status: 'SUCCESSFUL',
    orderId: 'ORD-09541',
  },
  {
    id: 'txn_004',
    transactionId: 'TXN-20260822-004',
    date: '2026-08-22T14:25:00Z',
    type: 'PAYMENT',
    description: 'Order #ORD-09876 - boAt Smartwatch',
    amount: -2724,
    status: 'SUCCESSFUL',
    paymentMethod: 'HDFC Credit Card',
    orderId: 'ORD-09876',
  },
  {
    id: 'txn_005',
    transactionId: 'TXN-20260801-005',
    date: '2026-08-01T09:00:00Z',
    type: 'REWARD_REDEMPTION',
    description: 'Redeemed 1000 points for ₹100 discount',
    amount: -100,
    status: 'SUCCESSFUL',
  },
];

// ─── MOCK WALLET ──────────────────────────────────────────────────────────────
export const mockWallet: WalletData = {
  availableBalance: 1250,
  pendingBalance: 0,
  expiringCredit: 200,
  expiryDate: '2026-10-31',
  transactions: [
    {
      id: 'wt_001',
      date: '2026-09-15T14:00:00Z',
      description: 'Referral Bonus',
      type: 'CREDIT',
      amount: 500,
      balanceAfter: 1250,
    },
    {
      id: 'wt_002',
      date: '2026-09-10T10:00:00Z',
      description: 'Order Payment #ORD-10100',
      type: 'DEBIT',
      amount: 250,
      balanceAfter: 750,
    },
    {
      id: 'wt_003',
      date: '2026-08-25T16:30:00Z',
      description: 'Order Refund #ORD-09541',
      type: 'CREDIT',
      amount: 500,
      balanceAfter: 1000,
    },
    {
      id: 'wt_004',
      date: '2026-08-10T12:00:00Z',
      description: 'Promotional Credit - Summer Sale',
      type: 'CREDIT',
      amount: 200,
      balanceAfter: 500,
    },
    {
      id: 'wt_005',
      date: '2026-08-05T09:00:00Z',
      description: 'Order Payment #ORD-09876',
      type: 'DEBIT',
      amount: 500,
      balanceAfter: 300,
    },
  ],
};

// ─── MOCK GIFT CARDS ──────────────────────────────────────────────────────────
export const mockGiftCards: GiftCard[] = [
  {
    id: 'gc_001',
    code: 'GIFT-SELB-1234-ABCD',
    balance: 2000,
    originalAmount: 2000,
    expiryDate: '2026-12-31',
    redeemedAt: '2026-09-01T10:00:00Z',
    status: 'ACTIVE',
  },
  {
    id: 'gc_002',
    code: 'GIFT-SELB-5678-EFGH',
    balance: 0,
    originalAmount: 500,
    expiryDate: '2026-07-31',
    redeemedAt: '2026-06-15T12:00:00Z',
    status: 'USED',
  },
];

// ─── MOCK LOYALTY ─────────────────────────────────────────────────────────────
export const mockLoyalty: LoyaltyData = {
  tier: 'GOLD',
  points: 2450,
  tierMinPoints: 1000,
  tierMaxPoints: 5000,
  nextTier: 'PLATINUM',
  pointsToNextTier: 2550,
  benefits: [
    'Exclusive member discounts',
    'Early access to sales',
    'Free shipping on orders above ₹499',
    'Birthday bonus points (2x)',
    'Priority customer support',
    'Member-only flash sales',
  ],
  pointsHistory: [
    { id: 'ph_001', date: '2026-09-18T10:35:00Z', activity: 'Purchase - Order #ORD-10245', orderId: 'ORD-10245', points: 250, type: 'EARNED', balance: 2450 },
    { id: 'ph_002', date: '2026-09-15T14:00:00Z', activity: 'Referral Bonus - Friend joined SELBAR', points: 500, type: 'EARNED', balance: 2200 },
    { id: 'ph_003', date: '2026-09-01T09:00:00Z', activity: 'Redeemed for ₹100 Discount', points: -1000, type: 'REDEEMED', balance: 1700 },
    { id: 'ph_004', date: '2026-08-22T14:25:00Z', activity: 'Purchase - Order #ORD-09876', orderId: 'ORD-09876', points: 150, type: 'EARNED', balance: 2700 },
    { id: 'ph_005', date: '2026-08-05T09:00:00Z', activity: 'Birthday Bonus (2x Points)', points: 500, type: 'EARNED', balance: 2550 },
    { id: 'ph_006', date: '2026-07-10T16:45:00Z', activity: 'Purchase - Order #ORD-08233', orderId: 'ORD-08233', points: 180, type: 'EARNED', balance: 2050 },
  ],
  rewards: [
    { id: 'rew_001', title: '₹100 Discount', description: 'Get ₹100 off on your next order above ₹999', pointsRequired: 1000, value: '₹100', type: 'DISCOUNT' },
    { id: 'rew_002', title: '₹250 Discount', description: 'Get ₹250 off on orders above ₹2,499', pointsRequired: 2500, value: '₹250', type: 'DISCOUNT' },
    { id: 'rew_003', title: 'Free Shipping', description: 'Free shipping on your next order, no minimum', pointsRequired: 750, value: 'Free Shipping', type: 'FREE_SHIPPING' },
    { id: 'rew_004', title: '₹500 Cashback', description: 'Get ₹500 as wallet credit on orders above ₹4,999', pointsRequired: 5000, value: '₹500', type: 'CASHBACK' },
    { id: 'rew_005', title: '₹50 Discount', description: 'Small discount on any order above ₹499', pointsRequired: 500, value: '₹50', type: 'DISCOUNT' },
  ],
};

// ─── MOCK REFERRALS ───────────────────────────────────────────────────────────
export const mockReferrals: Referral[] = [
  { id: 'ref_001', friendName: 'Amit Kumar', friendEmail: 'amit@gmail.com', date: '2026-09-15T14:00:00Z', status: 'SUCCESSFUL', rewardEarned: 500 },
  { id: 'ref_002', friendName: 'Priya Verma', friendEmail: 'priya@gmail.com', date: '2026-09-08T10:30:00Z', status: 'SUCCESSFUL', rewardEarned: 500 },
  { id: 'ref_003', friendName: 'Ravi Singh', date: '2026-09-20T16:00:00Z', status: 'PENDING' },
  { id: 'ref_004', friendName: 'Deepak Mishra', friendEmail: 'deepak@gmail.com', date: '2026-08-30T09:00:00Z', status: 'SUCCESSFUL', rewardEarned: 500 },
];

// ─── MOCK SUPPORT TICKETS ─────────────────────────────────────────────────────
export const mockTickets: SupportTicket[] = [
  {
    id: 'ticket_001',
    ticketId: 'TKT-8823',
    subject: 'Order #ORD-10245 - Tracking not updating',
    category: 'Shipping & Delivery',
    status: 'IN_PROGRESS',
    createdAt: '2026-09-22T09:00:00Z',
    updatedAt: '2026-09-23T14:30:00Z',
    priority: 'HIGH',
    messages: [
      { id: 'msg_001', sender: 'CUSTOMER', senderName: 'Rahul Sharma', content: 'Hi, my order #ORD-10245 tracking has not updated since yesterday. It says "Shipped" but no further updates. Please help.', sentAt: '2026-09-22T09:00:00Z' },
      { id: 'msg_002', sender: 'AGENT', senderName: 'Priya (SELBAR Support)', senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', content: 'Hi Rahul! I understand your concern. I can see your shipment is with Delhivery Express. There was a slight delay due to high volume. Your package is now out for delivery and should arrive today by 6 PM. I have escalated this for priority handling.', sentAt: '2026-09-22T11:30:00Z' },
      { id: 'msg_003', sender: 'CUSTOMER', senderName: 'Rahul Sharma', content: 'Thank you for the update! Will it definitely arrive today?', sentAt: '2026-09-22T11:45:00Z' },
      { id: 'msg_004', sender: 'AGENT', senderName: 'Priya (SELBAR Support)', senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', content: 'Yes, it is marked for delivery today. I have personally escalated this with Delhivery Express. You will receive an SMS when the delivery executive is nearby.', sentAt: '2026-09-22T12:00:00Z' },
    ],
  },
  {
    id: 'ticket_002',
    ticketId: 'TKT-7751',
    subject: 'Nike Shoes - Wrong size received',
    category: 'Returns & Refunds',
    status: 'RESOLVED',
    createdAt: '2026-08-10T10:00:00Z',
    updatedAt: '2026-09-25T09:00:00Z',
    priority: 'MEDIUM',
    messages: [
      { id: 'msg_005', sender: 'CUSTOMER', senderName: 'Rahul Sharma', content: 'I received Size 8 instead of the Size 9 I ordered for the Nike Air Max 270. Please initiate return.', sentAt: '2026-08-10T10:00:00Z' },
      { id: 'msg_006', sender: 'AGENT', senderName: 'Arjun (SELBAR Support)', content: 'I sincerely apologize for this error. I have initiated a return request (RET-5521) and your pickup will be scheduled within 24 hours. Full refund will be processed in 3-5 business days.', sentAt: '2026-08-10T12:00:00Z' },
    ],
  },
];

// ─── MOCK REVIEWS ─────────────────────────────────────────────────────────────
export const mockReviews: Review[] = [
  {
    id: 'rev_001',
    productId: 'prod_watch',
    productName: 'boAt Smartwatch Wave Sigma Pro',
    productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80',
    orderId: 'ORD-09876',
    rating: 4,
    title: 'Great smartwatch for the price',
    content: 'Battery life is amazing, lasts 4-5 days easily. Display is bright and clear. Build quality is good for the price point. GPS accuracy could be better. Overall happy with the purchase!',
    createdAt: '2026-08-28T10:00:00Z',
    isVerified: true,
    helpfulCount: 23,
  },
];

export const mockPendingReviews: PendingReview[] = [
  {
    productId: 'prod_headphones',
    productName: 'Sony WH-1000XM5 Wireless ANC Headphones',
    productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80',
    orderId: 'ORD-10245',
    deliveredAt: '2026-09-24T14:00:00Z',
  },
  {
    productId: 'prod_hoodie',
    productName: 'H&M Premium Cotton Oversized Hoodie',
    productImage: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=200&auto=format&fit=crop&q=80',
    orderId: 'ORD-08233',
    deliveredAt: '2026-07-15T11:00:00Z',
  },
];

// ─── MOCK LOGIN ACTIVITY ──────────────────────────────────────────────────────
export const mockLoginActivity: LoginActivity[] = [
  { id: 'la_001', device: 'MacBook Pro', browser: 'Chrome 128', os: 'macOS 15', location: 'Patna, Bihar, India', ipAddress: '103.68.xx.xx', loggedInAt: '2026-09-24T10:42:00Z', isCurrentSession: true, sessionId: 'sess_current' },
  { id: 'la_002', device: 'iPhone 15 Pro', browser: 'Safari 17', os: 'iOS 18', location: 'Patna, Bihar, India', ipAddress: '103.68.xx.xx', loggedInAt: '2026-09-23T08:15:00Z', isCurrentSession: false, sessionId: 'sess_002' },
  { id: 'la_003', device: 'Samsung Galaxy S24', browser: 'Chrome Mobile', os: 'Android 14', location: 'Muzaffarpur, Bihar, India', ipAddress: '122.45.xx.xx', loggedInAt: '2026-09-20T19:30:00Z', isCurrentSession: false, sessionId: 'sess_003' },
];

// ─── MOCK NOTIFICATIONS ───────────────────────────────────────────────────────
export const mockNotifications: Notification[] = [
  { id: 'notif_001', type: 'SHIPPING', title: 'Out for Delivery!', message: 'Your order #ORD-10245 is out for delivery. Expected by 6 PM today.', isRead: false, createdAt: new Date(Date.now() - 2 * 3600000).toISOString(), actionUrl: '/account/orders/ORD-10245', actionLabel: 'Track Order' },
  { id: 'notif_002', type: 'PRICE_DROP', title: 'Price Drop Alert!', message: 'Apple iPhone 15 in your wishlist dropped by ₹2,000. Now ₹52,999.', isRead: false, createdAt: new Date(Date.now() - 5 * 3600000).toISOString(), actionUrl: '/account/wishlist', actionLabel: 'View Wishlist' },
  { id: 'notif_003', type: 'REWARD', title: 'Points Credited', message: 'You earned 250 points for Order #ORD-10245. Total: 2,450 points.', isRead: false, createdAt: new Date(Date.now() - 24 * 3600000).toISOString(), actionUrl: '/account/rewards', actionLabel: 'View Rewards' },
  { id: 'notif_004', type: 'ORDER', title: 'Order Confirmed', message: 'Your order #ORD-10245 has been confirmed and payment received.', isRead: true, createdAt: new Date(Date.now() - 6 * 24 * 3600000).toISOString() },
  { id: 'notif_005', type: 'PROMO', title: '🎉 Flash Sale - 50% Off Today!', message: 'Exclusive member flash sale on electronics. Grab deals before they end.', isRead: true, createdAt: new Date(Date.now() - 2 * 24 * 3600000).toISOString() },
  { id: 'notif_006', type: 'SECURITY', title: 'New Login Detected', message: 'New login from iPhone 15 Pro in Patna, Bihar. If this was you, ignore.', isRead: true, createdAt: new Date(Date.now() - 1 * 24 * 3600000).toISOString() },
];

// ─── MOCK COMMUNICATION PREFERENCES ──────────────────────────────────────────
export const mockCommunicationPreferences: CommunicationPreferences = {
  orderUpdates: { email: true, sms: true, push: true },
  promotions: { email: true, sms: false, whatsapp: true, push: false },
  personalizedRecommendations: true,
  priceDropAlerts: true,
  backInStockAlerts: true,
};

// ─── SERVICE FUNCTIONS (API-READY) ────────────────────────────────────────────
export const accountService = {
  getProfile: async (): Promise<CustomerProfile> => {
    await new Promise(r => setTimeout(r, 300));
    return mockProfile;
  },
  getOrders: async (): Promise<Order[]> => {
    await new Promise(r => setTimeout(r, 500));
    return mockOrders;
  },
  getOrder: async (orderId: string): Promise<Order | undefined> => {
    await new Promise(r => setTimeout(r, 300));
    return mockOrders.find(o => o.orderId === orderId);
  },
  getReturns: async (): Promise<Return[]> => {
    await new Promise(r => setTimeout(r, 300));
    return mockReturns;
  },
  getWishlist: async (): Promise<WishlistProduct[]> => {
    await new Promise(r => setTimeout(r, 300));
    return mockWishlist;
  },
  getRecentlyViewed: async (): Promise<RecentlyViewedProduct[]> => {
    await new Promise(r => setTimeout(r, 200));
    return mockRecentlyViewed;
  },
  getRecommendations: async (): Promise<RecommendedProduct[]> => {
    await new Promise(r => setTimeout(r, 400));
    return mockRecommendations;
  },
  getPaymentMethods: async (): Promise<PaymentMethod[]> => {
    await new Promise(r => setTimeout(r, 300));
    return mockPaymentMethods;
  },
  getTransactions: async (): Promise<Transaction[]> => {
    await new Promise(r => setTimeout(r, 400));
    return mockTransactions;
  },
  getWallet: async (): Promise<WalletData> => {
    await new Promise(r => setTimeout(r, 300));
    return mockWallet;
  },
  getGiftCards: async (): Promise<GiftCard[]> => {
    await new Promise(r => setTimeout(r, 200));
    return mockGiftCards;
  },
  getLoyalty: async (): Promise<LoyaltyData> => {
    await new Promise(r => setTimeout(r, 300));
    return mockLoyalty;
  },
  getReferrals: async (): Promise<Referral[]> => {
    await new Promise(r => setTimeout(r, 300));
    return mockReferrals;
  },
  getTickets: async (): Promise<SupportTicket[]> => {
    await new Promise(r => setTimeout(r, 400));
    return mockTickets;
  },
  getReviews: async (): Promise<Review[]> => {
    await new Promise(r => setTimeout(r, 300));
    return mockReviews;
  },
  getPendingReviews: async (): Promise<PendingReview[]> => {
    await new Promise(r => setTimeout(r, 200));
    return mockPendingReviews;
  },
  getLoginActivity: async (): Promise<LoginActivity[]> => {
    await new Promise(r => setTimeout(r, 400));
    return mockLoginActivity;
  },
  getNotifications: async (): Promise<Notification[]> => {
    await new Promise(r => setTimeout(r, 200));
    return mockNotifications;
  },
  getAddresses: async (): Promise<Address[]> => {
    await new Promise(r => setTimeout(r, 300));
    return mockAddresses;
  },
};
