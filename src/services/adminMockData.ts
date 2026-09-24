import {
  AdminProduct,
  AdminOrder,
  CustomerProfile,
  InventoryItem,
  CouponItem,
  ReviewItem,
  MarketingCampaign,
  SupportTicket,
  ActivityLogItem,
  AdminUser,
  DashboardKPISummary,
  PermissionModule
} from '@/types/admin';

export const INITIAL_KPI_SUMMARY: DashboardKPISummary = {
  totalRevenue: 1248500,
  revenueChangePct: 18.4,
  totalOrders: 3248,
  ordersChangePct: 12.8,
  totalCustomers: 8492,
  customersChangePct: 9.6,
  averageOrderValue: 2840,
  aovChangePct: 5.4,
  conversionRate: 3.82,
  conversionChangePct: 0.8,
};

export const INITIAL_PRODUCTS: AdminProduct[] = [
  {
    id: 'prod-001',
    name: 'Apple iPhone 15 Pro (128GB, Natural Titanium)',
    slug: 'apple-iphone-15-pro-128gb',
    sku: 'IPH-15P-128-NAT',
    brand: 'Apple',
    category: 'Smartphones',
    subcategory: 'Flagship Phones',
    description: 'Forged in titanium and featuring the groundbreaking A17 Pro chip, customizable Action button, and 48MP main camera system with 3x optical zoom.',
    price: 124999,
    compareAtPrice: 134900,
    costPrice: 108000,
    taxRate: 18,
    taxClass: 'Standard GST (18%)',
    stock: 14,
    lowStockThreshold: 5,
    stockStatus: 'in_stock',
    trackInventory: true,
    allowBackorders: false,
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80'
    ],
    variants: [
      { id: 'v-101', sku: 'IPH-15P-128-NAT', title: '128GB / Natural Titanium', attributes: { storage: '128GB', color: 'Natural Titanium' }, price: 124999, stock: 8 },
      { id: 'v-102', sku: 'IPH-15P-256-NAT', title: '256GB / Natural Titanium', attributes: { storage: '256GB', color: 'Natural Titanium' }, price: 134999, stock: 6 },
    ],
    weightKg: 0.187,
    dimensionsCm: { length: 14.66, width: 7.06, height: 0.825 },
    shippingClass: 'Express Insured Electronics',
    tags: ['apple', 'iphone', 'flagship', 'titanium', '5g'],
    status: 'published',
    rating: 4.8,
    reviewsCount: 142,
    salesCount: 388,
    seoTitle: 'Buy Apple iPhone 15 Pro Online Best Price India | SELBAR',
    seoDescription: 'Get original Apple iPhone 15 Pro 128GB Natural Titanium with 1 Year Warranty & fast express delivery across India.',
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-09-20T14:30:00Z'
  },
  {
    id: 'prod-002',
    name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    slug: 'sony-wh-1000xm5-wireless-headphones',
    sku: 'SNY-WH5-BLK',
    brand: 'Sony',
    category: 'Audio & Wearables',
    subcategory: 'Over-Ear Headphones',
    description: 'Industry-leading noise cancellation with two processors and 8 microphones. Up to 30-hour battery life with quick charging.',
    price: 26990,
    compareAtPrice: 34990,
    costPrice: 21500,
    taxRate: 18,
    taxClass: 'Standard GST (18%)',
    stock: 7,
    lowStockThreshold: 10,
    stockStatus: 'low_stock',
    trackInventory: true,
    allowBackorders: true,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80'
    ],
    variants: [
      { id: 'v-201', sku: 'SNY-WH5-BLK', title: 'Black', attributes: { color: 'Black' }, price: 26990, stock: 4 },
      { id: 'v-202', sku: 'SNY-WH5-SIL', title: 'Silver', attributes: { color: 'Silver' }, price: 26990, stock: 3 },
    ],
    weightKg: 0.25,
    dimensionsCm: { length: 22.5, width: 19.8, height: 7.4 },
    shippingClass: 'Standard Fragile',
    tags: ['sony', 'anc', 'headphones', 'bluetooth', 'audio'],
    status: 'published',
    rating: 4.7,
    reviewsCount: 89,
    salesCount: 245,
    seoTitle: 'Sony WH-1000XM5 Premium Noise Cancelling Headphones | SELBAR',
    seoDescription: 'Experience pure acoustic silence with Sony WH-1000XM5 wireless ANC headphones. Free delivery & easy EMI.',
    createdAt: '2026-02-10T12:00:00Z',
    updatedAt: '2026-09-22T08:15:00Z'
  },
  {
    id: 'prod-003',
    name: 'Apple MacBook Air M3 (13.6-inch, 16GB, 512GB SSD)',
    slug: 'apple-macbook-air-m3-16gb-512gb',
    sku: 'MBA-M3-16-512-ST',
    brand: 'Apple',
    category: 'Laptops & Computers',
    subcategory: 'Ultrabooks',
    description: 'Supercharged by Apple M3 chip with 8-core CPU and 10-core GPU. Liquid Retina display, MagSafe 3 charging, and up to 18 hours battery life.',
    price: 134900,
    compareAtPrice: 144900,
    costPrice: 119000,
    taxRate: 18,
    taxClass: 'Standard GST (18%)',
    stock: 9,
    lowStockThreshold: 5,
    stockStatus: 'in_stock',
    trackInventory: true,
    allowBackorders: false,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80'
    ],
    variants: [
      { id: 'v-301', sku: 'MBA-M3-ST-512', title: 'Starlight / 512GB', attributes: { color: 'Starlight', storage: '512GB' }, price: 134900, stock: 5 },
      { id: 'v-302', sku: 'MBA-M3-MD-512', title: 'Midnight / 512GB', attributes: { color: 'Midnight', storage: '512GB' }, price: 134900, stock: 4 },
    ],
    weightKg: 1.24,
    dimensionsCm: { length: 30.41, width: 21.5, height: 1.13 },
    shippingClass: 'Express Insured Electronics',
    tags: ['macbook', 'apple', 'm3', 'laptop', 'creator'],
    status: 'published',
    rating: 4.9,
    reviewsCount: 64,
    salesCount: 172,
    createdAt: '2026-03-01T09:00:00Z',
    updatedAt: '2026-09-18T16:00:00Z'
  },
  {
    id: 'prod-004',
    name: 'Nike Air Max Pulse Roam (Men Athletic Sneakers)',
    slug: 'nike-air-max-pulse-roam',
    sku: 'NKE-AM-ROAM-BLK',
    brand: 'Nike',
    category: 'Footwear & Apparel',
    subcategory: 'Running Shoes',
    description: 'Rugged utility meets point-loaded Air cushioning for unbeatable bounce and day-long city comfort.',
    price: 11495,
    compareAtPrice: 13995,
    costPrice: 7200,
    taxRate: 12,
    taxClass: 'Apparel GST (12%)',
    stock: 4,
    lowStockThreshold: 5,
    stockStatus: 'low_stock',
    trackInventory: true,
    allowBackorders: false,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80'
    ],
    variants: [
      { id: 'v-401', sku: 'NKE-AM-UK8', title: 'UK 8 / Black', attributes: { size: 'UK 8', color: 'Black' }, price: 11495, stock: 2 },
      { id: 'v-402', sku: 'NKE-AM-UK9', title: 'UK 9 / Black', attributes: { size: 'UK 9', color: 'Black' }, price: 11495, stock: 2 },
    ],
    weightKg: 0.95,
    dimensionsCm: { length: 32, width: 22, height: 12 },
    shippingClass: 'Standard Apparel',
    tags: ['nike', 'sneakers', 'airmax', 'running'],
    status: 'published',
    rating: 4.6,
    reviewsCount: 118,
    salesCount: 420,
    createdAt: '2026-04-12T11:00:00Z',
    updatedAt: '2026-09-24T10:10:00Z'
  },
  {
    id: 'prod-005',
    name: 'Minimalist Heavyweight Cotton Hoodie (Oversized)',
    slug: 'minimalist-heavyweight-cotton-hoodie',
    sku: 'SEL-HD-450-OVR',
    brand: 'SELBAR Originals',
    category: 'Footwear & Apparel',
    subcategory: 'Streetwear',
    description: '450 GSM French Terry 100% combed organic cotton with dropped shoulders and double-layered warm hood.',
    price: 3499,
    compareAtPrice: 4999,
    costPrice: 1450,
    taxRate: 12,
    taxClass: 'Apparel GST (12%)',
    stock: 3,
    lowStockThreshold: 6,
    stockStatus: 'low_stock',
    trackInventory: true,
    allowBackorders: true,
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80'
    ],
    variants: [
      { id: 'v-501', sku: 'SEL-HD-M-OLV', title: 'M / Olive Green', attributes: { size: 'M', color: 'Olive' }, price: 3499, stock: 1 },
      { id: 'v-502', sku: 'SEL-HD-L-OLV', title: 'L / Olive Green', attributes: { size: 'L', color: 'Olive' }, price: 3499, stock: 2 },
    ],
    weightKg: 0.75,
    dimensionsCm: { length: 35, width: 28, height: 5 },
    shippingClass: 'Standard Apparel',
    tags: ['hoodie', 'apparel', 'oversized', 'winterwear'],
    status: 'published',
    rating: 4.9,
    reviewsCount: 76,
    salesCount: 310,
    createdAt: '2026-05-18T14:00:00Z',
    updatedAt: '2026-09-23T11:45:00Z'
  },
  {
    id: 'prod-006',
    name: 'Samsung Galaxy S24 Ultra (512GB, Titanium Gray)',
    slug: 'samsung-galaxy-s24-ultra-512gb',
    sku: 'SAM-S24U-512-GRY',
    brand: 'Samsung',
    category: 'Smartphones',
    subcategory: 'Flagship Phones',
    description: 'Galaxy AI is here. 200MP camera with Quad Telephoto system, built-in S Pen, and Snapdragon 8 Gen 3 for Galaxy.',
    price: 139999,
    compareAtPrice: 149999,
    costPrice: 118000,
    taxRate: 18,
    taxClass: 'Standard GST (18%)',
    stock: 0,
    lowStockThreshold: 4,
    stockStatus: 'out_of_stock',
    trackInventory: true,
    allowBackorders: false,
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80'
    ],
    variants: [
      { id: 'v-601', sku: 'SAM-S24U-512-GRY', title: '512GB / Titanium Gray', attributes: { storage: '512GB', color: 'Titanium Gray' }, price: 139999, stock: 0 }
    ],
    weightKg: 0.232,
    dimensionsCm: { length: 16.23, width: 7.9, height: 0.86 },
    shippingClass: 'Express Insured Electronics',
    tags: ['samsung', 'galaxy', 'ai', 's24ultra', 'flagship'],
    status: 'published',
    rating: 4.8,
    reviewsCount: 95,
    salesCount: 189,
    createdAt: '2026-02-01T15:00:00Z',
    updatedAt: '2026-09-24T12:00:00Z'
  },
  {
    id: 'prod-007',
    name: 'Anker 737 Power Bank (PowerCore 24K 140W)',
    slug: 'anker-737-power-bank-24k-140w',
    sku: 'ANK-737-140W',
    brand: 'Anker',
    category: 'Accessories',
    subcategory: 'Power Banks',
    description: 'Ultra-powerful two-way charging with the latest Power Delivery 3.1 and bi-directional technology to quickly recharge the portable charger or get a 140W ultra-powerful charge.',
    price: 11999,
    compareAtPrice: 14999,
    costPrice: 8500,
    taxRate: 18,
    taxClass: 'Standard GST (18%)',
    stock: 22,
    lowStockThreshold: 5,
    stockStatus: 'in_stock',
    trackInventory: true,
    allowBackorders: false,
    images: [
      'https://images.unsplash.com/photo-1609592424364-70e285d898c6?w=600&auto=format&fit=crop&q=80'
    ],
    variants: [
      { id: 'v-701', sku: 'ANK-737-140W', title: 'Standard 24,000mAh', attributes: { capacity: '24000mAh' }, price: 11999, stock: 22 }
    ],
    weightKg: 0.63,
    dimensionsCm: { length: 15.5, width: 5.4, height: 4.9 },
    shippingClass: 'Standard Electronics',
    tags: ['anker', 'charger', 'fastcharging', 'powerbank'],
    status: 'published',
    rating: 4.7,
    reviewsCount: 52,
    salesCount: 148,
    createdAt: '2026-05-02T10:00:00Z',
    updatedAt: '2026-09-21T18:00:00Z'
  },
  {
    id: 'prod-008',
    name: 'Logitech MX Master 3S Wireless Performance Mouse',
    slug: 'logitech-mx-master-3s-mouse',
    sku: 'LOG-MX3S-GRY',
    brand: 'Logitech',
    category: 'Accessories',
    subcategory: 'Computer Mice',
    description: 'Quiet clicks and 8K DPI track-on-glass sensor. MagSpeed electromagnetic scrolling for ultimate precision and flow cross-computer control.',
    price: 8995,
    compareAtPrice: 10995,
    costPrice: 6200,
    taxRate: 18,
    taxClass: 'Standard GST (18%)',
    stock: 18,
    lowStockThreshold: 6,
    stockStatus: 'in_stock',
    trackInventory: true,
    allowBackorders: true,
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80'
    ],
    variants: [
      { id: 'v-801', sku: 'LOG-MX3S-GRY', title: 'Pale Grey', attributes: { color: 'Pale Grey' }, price: 8995, stock: 10 },
      { id: 'v-802', sku: 'LOG-MX3S-BLK', title: 'Graphite', attributes: { color: 'Graphite' }, price: 8995, stock: 8 },
    ],
    weightKg: 0.141,
    dimensionsCm: { length: 12.5, width: 8.4, height: 5.1 },
    shippingClass: 'Standard Fragile',
    tags: ['logitech', 'mxmaster', 'productivity', 'bluetooth'],
    status: 'published',
    rating: 4.9,
    reviewsCount: 110,
    salesCount: 312,
    createdAt: '2026-03-22T13:00:00Z',
    updatedAt: '2026-09-22T15:20:00Z'
  }
];

export const INITIAL_ORDERS: AdminOrder[] = [
  {
    id: 'ord-10245',
    orderNumber: 'ORD-10245',
    customerId: 'cust-101',
    customerName: 'Rahul Sharma',
    customerEmail: 'rahul.sharma@gmail.com',
    customerPhone: '+91 98201 44521',
    items: [
      {
        id: 'item-1',
        productId: 'prod-001',
        productName: 'Apple iPhone 15 Pro (128GB, Natural Titanium)',
        sku: 'IPH-15P-128-NAT',
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
        variantTitle: '128GB / Natural Titanium',
        quantity: 1,
        unitPrice: 124999,
        totalPrice: 124999
      },
      {
        id: 'item-2',
        productId: 'prod-008',
        productName: 'Logitech MX Master 3S Wireless Performance Mouse',
        sku: 'LOG-MX3S-BLK',
        image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80',
        variantTitle: 'Graphite',
        quantity: 1,
        unitPrice: 8995,
        totalPrice: 8995
      }
    ],
    subtotal: 133994,
    discount: 5000,
    couponCode: 'FESTIVE5000',
    shippingFee: 0,
    tax: 23218,
    total: 128994,
    paymentMethod: 'UPI',
    paymentStatus: 'paid',
    status: 'Processing',
    shippingAddress: {
      fullName: 'Rahul Sharma',
      street: 'Flat 402, Sea Green Apts, Worli Sea Face',
      locality: 'Worli',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400030',
      phone: '+91 98201 44521'
    },
    billingAddress: {
      fullName: 'Rahul Sharma',
      street: 'Flat 402, Sea Green Apts, Worli Sea Face',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400030',
      phone: '+91 98201 44521'
    },
    timeline: [
      { id: 't-1', title: 'Order Placed', description: 'Order was created by customer via Web Storefront', timestamp: '2026-09-24 10:14 AM', completed: true, status: 'Pending' },
      { id: 't-2', title: 'Payment Confirmed', description: 'Paid ₹1,28,994 via Razorpay UPI (UPI ID: rahul@okhdfcbank)', timestamp: '2026-09-24 10:15 AM', completed: true, status: 'Pending' },
      { id: 't-3', title: 'Order Processing', description: 'Allocated to Mumbai Fulfillment Center B-2 for quality inspection and packaging', timestamp: '2026-09-24 11:30 AM', completed: true, status: 'Processing' },
      { id: 't-4', title: 'Packed & Barcoded', description: 'Package seal verified and shipping label generated', timestamp: 'Pending', completed: false, status: 'Packed' },
      { id: 't-5', title: 'Shipped', description: 'Handover to BlueDart Express', timestamp: 'Pending', completed: false, status: 'Shipped' },
      { id: 't-6', title: 'Delivered', description: 'Expected delivery by Sep 26, 2026', timestamp: 'Pending', completed: false, status: 'Delivered' }
    ],
    carrier: 'BlueDart Express Air',
    trackingNumber: 'BLU-88294109',
    createdAt: '2026-09-24T10:14:00Z',
    updatedAt: '2026-09-24T11:30:00Z'
  },
  {
    id: 'ord-10244',
    orderNumber: 'ORD-10244',
    customerId: 'cust-102',
    customerName: 'Priya Patel',
    customerEmail: 'priya.patel@techcorp.in',
    customerPhone: '+91 97123 88120',
    items: [
      {
        id: 'item-3',
        productId: 'prod-002',
        productName: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
        sku: 'SNY-WH5-BLK',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
        variantTitle: 'Black',
        quantity: 1,
        unitPrice: 26990,
        totalPrice: 26990
      }
    ],
    subtotal: 26990,
    discount: 1000,
    couponCode: 'WELCOME10',
    shippingFee: 0,
    tax: 4678,
    total: 25990,
    paymentMethod: 'Credit/Debit Card',
    paymentStatus: 'paid',
    status: 'Shipped',
    shippingAddress: {
      fullName: 'Priya Patel',
      street: 'Tower 4, Apt 1102, Prestige Lakeside Habitat, Varthur',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560087',
      phone: '+91 97123 88120'
    },
    billingAddress: {
      fullName: 'Priya Patel',
      street: 'Tower 4, Apt 1102, Prestige Lakeside Habitat, Varthur',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560087',
      phone: '+91 97123 88120'
    },
    timeline: [
      { id: 't-1', title: 'Order Placed', description: 'Created on app', timestamp: '2026-09-23 02:40 PM', completed: true, status: 'Pending' },
      { id: 't-2', title: 'Payment Confirmed', description: 'Paid via HDFC Regalia Credit Card', timestamp: '2026-09-23 02:41 PM', completed: true, status: 'Pending' },
      { id: 't-3', title: 'Packed', description: 'Packed at Bengaluru Warehouse', timestamp: '2026-09-23 05:15 PM', completed: true, status: 'Packed' },
      { id: 't-4', title: 'Shipped', description: 'Dispatched via Delhivery Surface (AWB: DEL-9938210)', timestamp: '2026-09-24 09:00 AM', completed: true, status: 'Shipped' },
      { id: 't-5', title: 'Delivered', description: 'Out for delivery', timestamp: 'Expected Sep 25', completed: false, status: 'Delivered' }
    ],
    carrier: 'Delhivery Air',
    trackingNumber: 'DEL-9938210',
    createdAt: '2026-09-23T14:40:00Z',
    updatedAt: '2026-09-24T09:00:00Z'
  },
  {
    id: 'ord-10243',
    orderNumber: 'ORD-10243',
    customerId: 'cust-103',
    customerName: 'Amit Verma',
    customerEmail: 'amit.verma@outlook.com',
    customerPhone: '+91 99104 33219',
    items: [
      {
        id: 'item-4',
        productId: 'prod-004',
        productName: 'Nike Air Max Pulse Roam (Men Athletic Sneakers)',
        sku: 'NKE-AM-UK8',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
        variantTitle: 'UK 8 / Black',
        quantity: 1,
        unitPrice: 11495,
        totalPrice: 11495
      },
      {
        id: 'item-5',
        productId: 'prod-005',
        productName: 'Minimalist Heavyweight Cotton Hoodie (Oversized)',
        sku: 'SEL-HD-L-OLV',
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80',
        variantTitle: 'L / Olive Green',
        quantity: 1,
        unitPrice: 3499,
        totalPrice: 3499
      }
    ],
    subtotal: 14994,
    discount: 0,
    shippingFee: 150,
    tax: 1799,
    total: 15144,
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'pending',
    status: 'Pending',
    shippingAddress: {
      fullName: 'Amit Verma',
      street: 'B-12, Sector 44, Near Golf Course',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pincode: '201303',
      phone: '+91 99104 33219'
    },
    billingAddress: {
      fullName: 'Amit Verma',
      street: 'B-12, Sector 44',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pincode: '201303',
      phone: '+91 99104 33219'
    },
    timeline: [
      { id: 't-1', title: 'Order Placed (COD)', description: 'Customer selected Cash on Delivery. OTP verification pending.', timestamp: '2026-09-24 12:05 PM', completed: true, status: 'Pending' }
    ],
    createdAt: '2026-09-24T12:05:00Z',
    updatedAt: '2026-09-24T12:05:00Z'
  },
  {
    id: 'ord-10242',
    orderNumber: 'ORD-10242',
    customerId: 'cust-104',
    customerName: 'Sneha Iyer',
    customerEmail: 'sneha.iyer@chennaimail.com',
    customerPhone: '+91 94440 12893',
    items: [
      {
        id: 'item-6',
        productId: 'prod-007',
        productName: 'Anker 737 Power Bank (PowerCore 24K 140W)',
        sku: 'ANK-737-140W',
        image: 'https://images.unsplash.com/photo-1609592424364-70e285d898c6?w=600&auto=format&fit=crop&q=80',
        quantity: 2,
        unitPrice: 11999,
        totalPrice: 23998
      }
    ],
    subtotal: 23998,
    discount: 2000,
    couponCode: 'ANKERPOWER',
    shippingFee: 0,
    tax: 3959,
    total: 21998,
    paymentMethod: 'UPI',
    paymentStatus: 'paid',
    status: 'Delivered',
    shippingAddress: {
      fullName: 'Sneha Iyer',
      street: 'Flat 2B, Karpagam Gardens, Adyar',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600020',
      phone: '+91 94440 12893'
    },
    billingAddress: {
      fullName: 'Sneha Iyer',
      street: 'Flat 2B, Karpagam Gardens, Adyar',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600020',
      phone: '+91 94440 12893'
    },
    timeline: [
      { id: 't-1', title: 'Order Placed', description: 'Paid via GPay UPI', timestamp: '2026-09-20 09:10 AM', completed: true, status: 'Pending' },
      { id: 't-2', title: 'Dispatched', description: 'Sent via BlueDart', timestamp: '2026-09-20 03:00 PM', completed: true, status: 'Shipped' },
      { id: 't-3', title: 'Delivered', description: 'Signed and delivered to resident', timestamp: '2026-09-22 01:20 PM', completed: true, status: 'Delivered' }
    ],
    carrier: 'BlueDart Air',
    trackingNumber: 'BLU-77291032',
    createdAt: '2026-09-20T09:10:00Z',
    updatedAt: '2026-09-22T13:20:00Z'
  },
  {
    id: 'ord-10241',
    orderNumber: 'ORD-10241',
    customerId: 'cust-105',
    customerName: 'Karan Mehra',
    customerEmail: 'karan.m@gmail.com',
    customerPhone: '+91 98110 55672',
    items: [
      {
        id: 'item-7',
        productId: 'prod-003',
        productName: 'Apple MacBook Air M3 (13.6-inch, 16GB, 512GB SSD)',
        sku: 'MBA-M3-ST-512',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
        quantity: 1,
        unitPrice: 134900,
        totalPrice: 134900
      }
    ],
    subtotal: 134900,
    discount: 0,
    shippingFee: 0,
    tax: 24282,
    total: 134900,
    paymentMethod: 'Net Banking',
    paymentStatus: 'refunded',
    status: 'Refunded',
    shippingAddress: {
      fullName: 'Karan Mehra',
      street: 'Villa 14, Palm Meadows, Whitefield',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560066',
      phone: '+91 98110 55672'
    },
    billingAddress: {
      fullName: 'Karan Mehra',
      street: 'Villa 14, Palm Meadows',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560066',
      phone: '+91 98110 55672'
    },
    timeline: [
      { id: 't-1', title: 'Order Placed', description: 'Net Banking ICICI', timestamp: '2026-09-18 11:00 AM', completed: true, status: 'Pending' },
      { id: 't-2', title: 'Cancellation Requested', description: 'Customer cancelled before dispatch (Reason: Accidental order)', timestamp: '2026-09-18 11:45 AM', completed: true, status: 'Cancelled' },
      { id: 't-3', title: 'Refund Initiated', description: 'Full refund of ₹1,34,900 credited back to bank account', timestamp: '2026-09-19 10:15 AM', completed: true, status: 'Refunded' }
    ],
    createdAt: '2026-09-18T11:00:00Z',
    updatedAt: '2026-09-19T10:15:00Z'
  }
];

export const INITIAL_CUSTOMERS: CustomerProfile[] = [
  {
    id: 'cust-101',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@gmail.com',
    phone: '+91 98201 44521',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    group: 'VIP',
    status: 'active',
    totalOrders: 14,
    totalSpent: 382450,
    averageOrderValue: 27318,
    addresses: [
      {
        fullName: 'Rahul Sharma',
        street: 'Flat 402, Sea Green Apts, Worli Sea Face',
        locality: 'Worli',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400030',
        phone: '+91 98201 44521'
      }
    ],
    createdAt: '2025-06-12T10:00:00Z',
    lastOrderDate: '2026-09-24',
    notes: 'High-frequency buyer, loyal tech enthusiast. Enjoys early access drops.'
  },
  {
    id: 'cust-102',
    name: 'Priya Patel',
    email: 'priya.patel@techcorp.in',
    phone: '+91 97123 88120',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    group: 'VIP',
    status: 'active',
    totalOrders: 9,
    totalSpent: 194500,
    averageOrderValue: 21611,
    addresses: [
      {
        fullName: 'Priya Patel',
        street: 'Tower 4, Apt 1102, Prestige Lakeside Habitat, Varthur',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560087',
        phone: '+91 97123 88120'
      }
    ],
    createdAt: '2025-08-20T14:30:00Z',
    lastOrderDate: '2026-09-23'
  },
  {
    id: 'cust-103',
    name: 'Amit Verma',
    email: 'amit.verma@outlook.com',
    phone: '+91 99104 33219',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
    group: 'Regular',
    status: 'active',
    totalOrders: 3,
    totalSpent: 28950,
    averageOrderValue: 9650,
    addresses: [
      {
        fullName: 'Amit Verma',
        street: 'B-12, Sector 44',
        city: 'Noida',
        state: 'Uttar Pradesh',
        pincode: '201303',
        phone: '+91 99104 33219'
      }
    ],
    createdAt: '2026-01-10T12:00:00Z',
    lastOrderDate: '2026-09-24'
  },
  {
    id: 'cust-104',
    name: 'Sneha Iyer',
    email: 'sneha.iyer@chennaimail.com',
    phone: '+91 94440 12893',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    group: 'Regular',
    status: 'active',
    totalOrders: 5,
    totalSpent: 64200,
    averageOrderValue: 12840,
    addresses: [
      {
        fullName: 'Sneha Iyer',
        street: 'Flat 2B, Karpagam Gardens, Adyar',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600020',
        phone: '+91 94440 12893'
      }
    ],
    createdAt: '2025-11-04T08:20:00Z',
    lastOrderDate: '2026-09-20'
  },
  {
    id: 'cust-105',
    name: 'Karan Mehra',
    email: 'karan.m@gmail.com',
    phone: '+91 98110 55672',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    group: 'New',
    status: 'active',
    totalOrders: 1,
    totalSpent: 134900,
    averageOrderValue: 134900,
    addresses: [
      {
        fullName: 'Karan Mehra',
        street: 'Villa 14, Palm Meadows, Whitefield',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560066',
        phone: '+91 98110 55672'
      }
    ],
    createdAt: '2026-09-18T10:45:00Z',
    lastOrderDate: '2026-09-18'
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-1',
    productId: 'prod-001',
    name: 'Apple iPhone 15 Pro (128GB, Natural Titanium)',
    sku: 'IPH-15P-128-NAT',
    category: 'Smartphones',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
    stock: 14,
    reserved: 3,
    available: 11,
    reorderLevel: 5,
    status: 'in_stock',
    unitCost: 108000,
    totalValue: 1512000,
    lastRestocked: '2026-09-10'
  },
  {
    id: 'inv-2',
    productId: 'prod-002',
    name: 'Sony WH-1000XM5 Wireless Headphones',
    sku: 'SNY-WH5-BLK',
    category: 'Audio & Wearables',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    stock: 7,
    reserved: 2,
    available: 5,
    reorderLevel: 10,
    status: 'low_stock',
    unitCost: 21500,
    totalValue: 150500,
    lastRestocked: '2026-09-02'
  },
  {
    id: 'inv-3',
    productId: 'prod-004',
    name: 'Nike Air Max Pulse Roam (Men Athletic Sneakers)',
    sku: 'NKE-AM-ROAM-BLK',
    category: 'Footwear & Apparel',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    stock: 4,
    reserved: 1,
    available: 3,
    reorderLevel: 5,
    status: 'low_stock',
    unitCost: 7200,
    totalValue: 28800,
    lastRestocked: '2026-08-28'
  },
  {
    id: 'inv-4',
    productId: 'prod-005',
    name: 'Minimalist Heavyweight Cotton Hoodie',
    sku: 'SEL-HD-450-OVR',
    category: 'Footwear & Apparel',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80',
    stock: 3,
    reserved: 1,
    available: 2,
    reorderLevel: 6,
    status: 'low_stock',
    unitCost: 1450,
    totalValue: 4350,
    lastRestocked: '2026-08-15'
  },
  {
    id: 'inv-5',
    productId: 'prod-006',
    name: 'Samsung Galaxy S24 Ultra (512GB, Titanium Gray)',
    sku: 'SAM-S24U-512-GRY',
    category: 'Smartphones',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
    stock: 0,
    reserved: 0,
    available: 0,
    reorderLevel: 4,
    status: 'out_of_stock',
    unitCost: 118000,
    totalValue: 0,
    lastRestocked: '2026-07-20'
  }
];

export const INITIAL_COUPONS: CouponItem[] = [
  {
    id: 'cpn-1',
    code: 'FESTIVE5000',
    description: 'Flat ₹5,000 off on Premium Electronics above ₹80,000',
    discountType: 'fixed',
    discountValue: 5000,
    minPurchase: 80000,
    usageCount: 148,
    usageLimit: 500,
    perCustomerLimit: 1,
    startDate: '2026-09-01',
    endDate: '2026-10-31',
    applicableCategory: 'Smartphones',
    status: 'active'
  },
  {
    id: 'cpn-2',
    code: 'WELCOME10',
    description: '10% instant discount on first purchase up to ₹1,500',
    discountType: 'percentage',
    discountValue: 10,
    minPurchase: 2999,
    maxDiscount: 1500,
    usageCount: 940,
    usageLimit: 5000,
    perCustomerLimit: 1,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    status: 'active'
  },
  {
    id: 'cpn-3',
    code: 'AUDIO20',
    description: '20% off on all Sony and Bose audio headphones',
    discountType: 'percentage',
    discountValue: 20,
    minPurchase: 5000,
    maxDiscount: 4000,
    usageCount: 215,
    usageLimit: 300,
    perCustomerLimit: 2,
    startDate: '2026-09-15',
    endDate: '2026-09-30',
    status: 'active'
  }
];

export const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    productId: 'prod-001',
    productName: 'Apple iPhone 15 Pro (128GB, Natural Titanium)',
    productImage: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
    customerName: 'Rahul Sharma',
    customerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    rating: 5,
    reviewTitle: 'Incredible titanium build and beast performance',
    reviewBody: 'Received brand new sealed unit within 24 hours in Mumbai. A17 Pro runs games like console grade. Beautiful craftsmanship!',
    verifiedPurchase: true,
    status: 'approved',
    createdAt: '2026-09-21',
    reply: 'Thank you Rahul! Enjoy your new iPhone 15 Pro experience.'
  },
  {
    id: 'rev-2',
    productId: 'prod-002',
    productName: 'Sony WH-1000XM5 Wireless Headphones',
    productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    customerName: 'Priya Patel',
    customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    rating: 5,
    reviewTitle: 'Silence during flights is unmatched',
    reviewBody: 'The ANC blocks out all cabin roar and air conditioning noise. Comfortable fit even during 8 hour work sessions.',
    verifiedPurchase: true,
    status: 'approved',
    createdAt: '2026-09-22'
  },
  {
    id: 'rev-3',
    productId: 'prod-004',
    productName: 'Nike Air Max Pulse Roam',
    productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    customerName: 'Vikram Joshi',
    customerAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
    rating: 2,
    reviewTitle: 'Size ran slightly smaller than expected',
    reviewBody: 'The shoe is great quality but UK 9 felt tighter at the toe box compared to usual Pegasus. Initiated exchange.',
    verifiedPurchase: true,
    status: 'pending',
    createdAt: '2026-09-23'
  }
];

export const INITIAL_CAMPAIGNS: MarketingCampaign[] = [
  {
    id: 'cmp-1',
    name: 'Diwali Tech Bonanza 2026',
    channel: 'Google Ads',
    budget: 250000,
    spend: 184500,
    revenue: 948200,
    roas: 5.14,
    orders: 412,
    conversionRate: 4.2,
    status: 'active',
    startDate: '2026-09-10',
    endDate: '2026-10-25'
  },
  {
    id: 'cmp-2',
    name: 'Instagram Gen-Z Fashion & Sneakers',
    channel: 'Meta',
    budget: 150000,
    spend: 112000,
    revenue: 468000,
    roas: 4.18,
    orders: 285,
    conversionRate: 3.6,
    status: 'active',
    startDate: '2026-09-01',
    endDate: '2026-09-30'
  },
  {
    id: 'cmp-3',
    name: 'VIP Newsletter Early Access Blast',
    channel: 'Email',
    budget: 25000,
    spend: 18000,
    revenue: 284000,
    roas: 15.7,
    orders: 142,
    conversionRate: 6.8,
    status: 'active',
    startDate: '2026-09-15',
    endDate: '2026-09-25'
  }
];

export const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-401',
    ticketNumber: 'TCK-8812',
    customerName: 'Amit Verma',
    customerEmail: 'amit.verma@outlook.com',
    subject: 'Requesting tracking update for Noida delivery',
    category: 'Order Issue',
    priority: 'medium',
    status: 'open',
    messagesCount: 3,
    createdAt: '2026-09-24 11:20 AM',
    lastUpdated: '15 mins ago'
  },
  {
    id: 'tkt-402',
    ticketNumber: 'TCK-8810',
    customerName: 'Karan Mehra',
    customerEmail: 'karan.m@gmail.com',
    subject: 'Refund confirmation for cancelled MacBook order',
    category: 'Refund Status',
    priority: 'high',
    status: 'in_progress',
    messagesCount: 5,
    createdAt: '2026-09-23 04:10 PM',
    lastUpdated: '1 hour ago'
  },
  {
    id: 'tkt-403',
    ticketNumber: 'TCK-8801',
    customerName: 'Pooja Hegde',
    customerEmail: 'pooja.h@yahoo.com',
    subject: 'Inquiry regarding corporate GST invoice generation',
    category: 'Technical',
    priority: 'low',
    status: 'resolved',
    messagesCount: 4,
    createdAt: '2026-09-22 09:30 AM',
    lastUpdated: '1 day ago'
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLogItem[] = [
  {
    id: 'log-1',
    adminName: 'Arjun Nambiar',
    adminRole: 'Super Admin',
    action: 'Product Update',
    module: 'Products',
    description: 'Updated price and inventory for Apple iPhone 15 Pro (SKU: IPH-15P-128-NAT)',
    ipAddress: '103.21.124.89 (Mumbai, IN)',
    timestamp: '2026-09-24 14:12:05'
  },
  {
    id: 'log-2',
    adminName: 'Deepa Roy',
    adminRole: 'Order Manager',
    action: 'Status Change',
    module: 'Orders',
    description: 'Changed Order #ORD-10244 status to SHIPPED via Delhivery Air',
    ipAddress: '49.207.211.45 (Bengaluru, IN)',
    timestamp: '2026-09-24 13:45:22'
  },
  {
    id: 'log-3',
    adminName: 'Rohan Deshmukh',
    adminRole: 'Marketing Manager',
    action: 'Coupon Created',
    module: 'Marketing',
    description: 'Created festive promotional coupon code: FESTIVE5000',
    ipAddress: '157.34.19.102 (Pune, IN)',
    timestamp: '2026-09-24 11:30:10'
  },
  {
    id: 'log-4',
    adminName: 'Arjun Nambiar',
    adminRole: 'Super Admin',
    action: 'Stock Adjustment',
    module: 'Inventory',
    description: 'Adjusted physical count for Sony WH-1000XM5 (+5 units added to Mumbai Hub)',
    ipAddress: '103.21.124.89 (Mumbai, IN)',
    timestamp: '2026-09-24 10:15:40'
  }
];

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'usr-01',
    name: 'Arjun Nambiar',
    email: 'admin@selbar.com',
    phone: '+91 98200 11223',
    role: 'Super Admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    status: 'active',
    lastLogin: '2026-09-24 15:45',
    createdAt: '2025-01-01',
    twoFactorEnabled: true
  },
  {
    id: 'usr-02',
    name: 'Deepa Roy',
    email: 'deepa.roy@selbar.com',
    phone: '+91 98450 44556',
    role: 'Order Manager',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    status: 'active',
    lastLogin: '2026-09-24 14:20',
    createdAt: '2025-03-15',
    twoFactorEnabled: true
  },
  {
    id: 'usr-03',
    name: 'Rohan Deshmukh',
    email: 'rohan.d@selbar.com',
    phone: '+91 99220 88776',
    role: 'Product Manager',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    status: 'active',
    lastLogin: '2026-09-24 12:10',
    createdAt: '2025-04-10',
    twoFactorEnabled: false
  },
  {
    id: 'usr-04',
    name: 'Simran Kaur',
    email: 'simran.k@selbar.com',
    phone: '+91 97110 33445',
    role: 'Support Agent',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    status: 'active',
    lastLogin: '2026-09-24 11:00',
    createdAt: '2025-07-01',
    twoFactorEnabled: false
  }
];

export const INITIAL_PERMISSION_MODULES: PermissionModule[] = [
  {
    module: 'products',
    label: 'Products & Catalog',
    actions: { view: true, create: true, edit: true, delete: true, export: true, approve: true }
  },
  {
    module: 'orders',
    label: 'Order Management',
    actions: { view: true, create: true, edit: true, delete: false, export: true, approve: true }
  },
  {
    module: 'customers',
    label: 'Customer Relations',
    actions: { view: true, create: true, edit: true, delete: false, export: true }
  },
  {
    module: 'marketing',
    label: 'Marketing & Coupons',
    actions: { view: true, create: true, edit: true, delete: true, export: true }
  },
  {
    module: 'finance',
    label: 'Finance & Payments',
    actions: { view: true, create: false, edit: false, delete: false, export: true }
  },
  {
    module: 'analytics',
    label: 'Analytics & Reports',
    actions: { view: true, create: false, edit: false, delete: false, export: true }
  },
  {
    module: 'settings',
    label: 'Settings & Security',
    actions: { view: true, create: true, edit: true, delete: false, export: false }
  }
];
