// ============================================================================
// SELBAR Customer Account Types
// ============================================================================

export type OrderStatus =
  | 'PLACED'
  | 'PAYMENT_CONFIRMED'
  | 'PROCESSING'
  | 'PACKED'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURN_REQUESTED'
  | 'RETURN_APPROVED'
  | 'RETURN_PICKUP_SCHEDULED'
  | 'RETURN_PICKED_UP'
  | 'RETURN_INSPECTED'
  | 'REFUND_PROCESSING'
  | 'REFUNDED'
  | 'RETURN_REJECTED';

export type PaymentStatus = 'SUCCESSFUL' | 'PENDING' | 'FAILED' | 'REFUNDED';
export type TransactionType = 'PAYMENT' | 'REFUND' | 'WALLET_CREDIT' | 'WALLET_DEBIT' | 'REWARD_REDEMPTION' | 'GIFT_CARD';
export type TicketStatus = 'OPEN' | 'WAITING_FOR_REPLY' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type MembershipTier = 'SILVER' | 'GOLD' | 'PLATINUM';

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  variant: string;
  sku: string;
  quantity: number;
  price: number;
  originalPrice: number;
  discount: number;
  total: number;
  isReviewed?: boolean;
  canReturn?: boolean;
}

export interface OrderTimeline {
  status: OrderStatus;
  label: string;
  date?: string;
  time?: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface Order {
  id: string;
  orderId: string;
  placedAt: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  walletCredit?: number;
  rewardDiscount?: number;
  total: number;
  shippingAddress: {
    name: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  paymentMethod: string;
  trackingId?: string;
  courierPartner?: string;
  expectedDelivery?: string;
  deliveredAt?: string;
  invoiceUrl?: string;
  timeline: OrderTimeline[];
}

export interface Return {
  id: string;
  returnId: string;
  orderId: string;
  orderItem: OrderItem;
  reason: string;
  status: OrderStatus;
  refundAmount: number;
  refundMethod: string;
  expectedRefundDate?: string;
  pickupDate?: string;
  createdAt: string;
  updatedAt: string;
  photos?: string[];
}

export interface WishlistProduct {
  id: string;
  productId: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice: number;
  discount: number;
  inStock: boolean;
  priceDropped?: boolean;
  priceDropAmount?: number;
  addedAt: string;
}

export interface RecentlyViewedProduct {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  rating: number;
  inStock: boolean;
  viewedAt: string;
}

export interface RecommendedProduct {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  reason: 'purchase' | 'browse' | 'trending' | 'similar';
}

export interface PaymentMethod {
  id: string;
  type: 'CARD' | 'UPI' | 'WALLET' | 'NETBANKING';
  label: string;
  maskedNumber?: string;
  cardBrand?: 'VISA' | 'MASTERCARD' | 'RUPAY' | 'AMEX';
  expiryMonth?: number;
  expiryYear?: number;
  upiId?: string;
  walletName?: string;
  bankName?: string;
  isDefault: boolean;
}

export interface Transaction {
  id: string;
  transactionId: string;
  date: string;
  type: TransactionType;
  description: string;
  amount: number;
  status: PaymentStatus;
  paymentMethod?: string;
  orderId?: string;
  balanceAfter?: number;
}

export interface WalletData {
  availableBalance: number;
  pendingBalance: number;
  expiringCredit: number;
  expiryDate?: string;
  transactions: WalletTransaction[];
}

export interface WalletTransaction {
  id: string;
  date: string;
  description: string;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  balanceAfter: number;
}

export interface GiftCard {
  id: string;
  code: string;
  balance: number;
  originalAmount: number;
  expiryDate: string;
  redeemedAt: string;
  status: 'ACTIVE' | 'EXPIRED' | 'USED';
}

export interface PointsHistory {
  id: string;
  date: string;
  activity: string;
  orderId?: string;
  points: number;
  type: 'EARNED' | 'REDEEMED';
  balance: number;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  value: string;
  type: 'DISCOUNT' | 'FREE_SHIPPING' | 'GIFT' | 'CASHBACK';
  expiresAt?: string;
}

export interface LoyaltyData {
  tier: MembershipTier;
  points: number;
  tierMinPoints: number;
  tierMaxPoints: number;
  nextTier?: MembershipTier;
  pointsToNextTier?: number;
  benefits: string[];
  pointsHistory: PointsHistory[];
  rewards: Reward[];
}

export interface Referral {
  id: string;
  friendName: string;
  friendEmail?: string;
  date: string;
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED';
  rewardEarned?: number;
}

export interface SupportTicket {
  id: string;
  ticketId: string;
  subject: string;
  category: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  messages: TicketMessage[];
}

export interface TicketMessage {
  id: string;
  sender: 'CUSTOMER' | 'AGENT';
  senderName: string;
  senderAvatar?: string;
  content: string;
  sentAt: string;
  attachments?: string[];
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  orderId: string;
  rating: number;
  title: string;
  content: string;
  photos?: string[];
  createdAt: string;
  isVerified: boolean;
  helpfulCount: number;
}

export interface PendingReview {
  productId: string;
  productName: string;
  productImage: string;
  orderId: string;
  deliveredAt: string;
}

export interface LoginActivity {
  id: string;
  device: string;
  browser: string;
  os: string;
  location: string;
  ipAddress: string;
  loggedInAt: string;
  isCurrentSession: boolean;
  sessionId: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  avatar?: string;
  totalOrders: number;
  totalSpent: number;
  memberSince: string;
  tier: MembershipTier;
  points: number;
  walletBalance: number;
}

export interface Notification {
  id: string;
  type: 'ORDER' | 'SHIPPING' | 'PRICE_DROP' | 'BACK_IN_STOCK' | 'REWARD' | 'PROMO' | 'SUPPORT' | 'SECURITY';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  actionLabel?: string;
  icon?: string;
}

export interface Address {
  id: string;
  label?: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export interface CommunicationPreferences {
  orderUpdates: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  promotions: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
    push: boolean;
  };
  personalizedRecommendations: boolean;
  priceDropAlerts: boolean;
  backInStockAlerts: boolean;
}
