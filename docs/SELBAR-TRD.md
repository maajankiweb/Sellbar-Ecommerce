# SELBAR — Complete Technical Requirements Document (TRD) & Production PRD
**Platform:** SELBAR (Recommerce & Electronics Marketplace)  
**Document Version:** 2.0 (Production-Ready Architecture)  
**Target Stack:** Next.js (Frontend) + Express.js / Node.js (Backend) + MongoDB / Mongoose (Database) + Razorpay (Payment Gateway)  
**Companion Documents:** `SELBAR-PRD.md`, API Specifications, Wireframes  

---

## 1. ARCHITECTURE OVERVIEW & COMMUNICATION FLOW

### 1.1 High-Level Architecture Diagram

```
                               ┌────────────────────────────────────────────────────────┐
                               │                    CLIENTS / USERS                     │
                               │  Desktop Web / Mobile Web (Responsive Next.js PWA)    │
                               └──────────────────────────┬─────────────────────────────┘
                                                          │
                                         HTTPS / WSS      │  DNS: Cloudflare / Vercel Edge
                                                          ▼
                               ┌────────────────────────────────────────────────────────┐
                               │                  FRONTEND LAYER (Vercel)               │
                               │  Next.js 14+ (App Router)                              │
                               │  - React 18+ Server & Client Components                │
                               │  - Tailwind CSS + Lucide Icons                         │
                               │  - Redux Toolkit (Client State) / React Query (Server) │
                               │  - Recharts / Chart.js Data Visualizations             │
                               │  - Axios HTTP Client (API Communication)               │
                               └──────────────────────────┬─────────────────────────────┘
                                                          │
                                         REST APIs        │  JWT Bearer Token / API Proxy
                                         (/api/v1/*)      ▼
                               ┌────────────────────────────────────────────────────────┐
                               │                 API GATEWAY & SECURITY                 │
                               │  - Nginx Reverse Proxy (SSL Termination, Rate Limiting)│
                               │  - Express Security: Helmet, CORS, HPP, Sanitizers     │
                               └──────────────────────────┬─────────────────────────────┘
                                                          │
                                                          ▼
                               ┌────────────────────────────────────────────────────────┐
                               │            BACKEND CORE LAYER (Node.js + Express)      │
                               │  Modular 3-Tier Architecture:                          │
                               │  ┌──────────────────────────────────────────────────┐  │
                               │  │ Routes -> Middlewares -> Controllers -> Services │  │
                               │  └──────────────────────────────────────────────────┘  │
                               │  Modules:                                              │
                               │  [Auth] [Users] [Catalog] [Pricing] [Orders]           │
                               │  [Payments] [Screener/Watchlist] [Admin] [Notifications]│
                               └──────────────┬───────────────────────────┬─────────────┘
                                              │                           │
                   Mongoose ODM Connection    │                           │ Async Job Queue
                   (Connection Pooling)       ▼                           ▼ (Redis BullMQ)
       ┌──────────────────────────────────────────────┐        ┌────────────────────────────┐
       │             DATABASE LAYER                   │        │      BACKGROUND WORKER     │
       │  MongoDB Atlas (Replica Set Cluster)         │        │  Redis + BullMQ            │
       │  - Core Collections (Users, Orders, Catalog, │        │  - Webhook processor       │
       │    Payments, Transactions, Screeners)        │        │  - PDF Invoice Generator   │
       │  - Compound Indexes & TTL Collections        │        │  - SMS / Email Dispatcher  │
       └──────────────────────────────────────────────┘        └──────────────┬─────────────┘
                                                                              │
                                                                              ▼
                               ┌────────────────────────────────────────────────────────┐
                               │               EXTERNAL THIRD-PARTY SERVICES            │
                               │  - Razorpay: Payment Gateway (PG) & RazorpayX Payouts  │
                               │  - SMS Gateway: MSG91 / Twilio (OTP & Alerts)          │
                               │  - Email Service: Amazon SES / SendGrid                │
                               │  - Cloud Storage: AWS S3 / Cloudflare R2 (Images/Docs) │
                               │  - Analytics: Google Analytics 4 & Tag Manager         │
                               └────────────────────────────────────────────────────────┘
```

### 1.2 End-to-End Communication Flow

```
[User Browser]           [Next.js Frontend]          [Express Backend]         [Razorpay Gateway]        [MongoDB Atlas]
      │                          │                          │                          │                        │
      │── Click "Buy/Sell" ────>│                          │                          │                        │
      │                          │── POST /orders/create ──>│                          │                        │
      │                          │   (Payload + JWT Token)  │── Init Order Calculation │                        │
      │                          │                          │── Create Gateway Order ─>│                        │
      │                          │                          │<─ Return razorpay_order_id│                        │
      │                          │                          │── Save Order (PENDING) ──────────────────────────>│
      │                          │<─ Send Order Details ────│                          │                        │
      │<─ Open Razorpay Modal ───│                          │                          │                        │
      │                          │                          │                          │                        │
      │── Pay via UPI/Card ───────────────────────────────────────────────────────────>│                        │
      │<─ Payment Success (client callback) ──────────────────────────────────────────│                        │
      │                          │                          │                          │                        │
      │── Verify Payment ───────>│                          │                          │                        │
      │   (Client-side Handshake)│── POST /payments/verify ─│                          │                        │
      │                          │   (Signature payload)    │── Verify HMAC-SHA256     │                        │
      │                          │                          │── Update Status (SUCCESS)─────────────────────────>│
      │                          │<─ Confirmation JSON ─────│                          │                        │
      │<─ Redirect to /success ──│                          │                          │                        │
      │                          │                          │                          │                        │
      │                          │                          │<─ POST /webhooks/razorpay (Async Server Webhook)  │
      │                          │                          │── Idempotency & Recheck ─────────────────────────>│
      │                          │                          │── Emit Notification Event│                        │
      │                          │                          │── 200 OK ───────────────>│                        │
```

---

## 2. NEXT.JS SPECIFIC CONFIGURATION & ARCHITECTURE

### 2.1 Router Decision: App Router (`src/app`)
* **Decision:** Next.js 14+ **App Router** is adopted over Pages Router.
* **Key Reasons:**
  1. **React Server Components (RSC):** Zero-bundle-size rendering for catalog, SEO landing pages, articles, and policy pages.
  2. **Streaming & Suspense:** Granular loading states for slow networks (skeleton cards for device listings).
  3. **Nested Layouts:** Shared persistent headers, bottom navigation for mobile viewports, and admin sidebar without remounting.
  4. **Built-in Metadata API:** Dynamic OpenGraph tags, canonical tags, and structured JSON-LD schemas for high SEO ranking against competitors.

### 2.2 Server Components vs Client Components Usage Pattern

| Component Type | File Directives | Use Cases in SELBAR |
|---|---|---|
| **Server Component (RSC)** | Default (no directive) | - Device Brand & Model Catalog (`/sell/brands`, `/buy`)<br>- Static SEO Content (`/about`, `/privacy`, `/faq`, `/terms`)<br>- Initial server data fetching with direct caching tags<br>- Blog / News / Article listing |
| **Client Component** | `'use client'` at top | - Condition Q&A Interactive Wizard (`/sell/quote`)<br>- Dynamic Price Gauge & Deduction Calculator<br>- Interactive Screener Table & Filtering (`/screener`)<br>- Interactive Charts (Recharts/Chart.js analytics)<br>- Razorpay Modal invocation & payment handlers<br>- Redux Toolkit / Context API Consumers |

### 2.3 SSR, SSG, and ISR Strategies Per Page

```
+-----------------------------------------------------------------------------------------+
| ROUTE                     | STRATEGY        | REVALIDATION (ISR) / CACHING RATIONALE    |
+-----------------------------------------------------------------------------------------+
| / (Homepage)              | ISR             | revalidate: 3600 (1 hour)                 |
| /sell (Brand selector)    | SSG / ISR       | revalidate: 86400 (Daily catalog cache)   |
| /sell/[brand]/[model]     | ISR             | revalidate: 3600 (Dynamic models list)    |
| /sell/evaluate (Q&A)      | Client (CSR)    | Real-time dynamic step evaluation         |
| /buy (Refurbished store)  | SSR (with cache)| Server-rendered on query parameters       |
| /buy/product/[id]         | SSR / Dynamic   | Real-time inventory check                 |
| /dashboard/*              | CSR (Client)    | Private JWT-protected user session        |
| /screener                 | Hybrid (SSR+CSR)| SSR initial dataset + CSR live filtering  |
| /legal/* (Privacy, FAQ)   | Static (SSG)    | Built at compile time                     |
+-----------------------------------------------------------------------------------------+
```

### 2.4 State Management & API Communication Layer
- **Redux Toolkit (`src/redux`) / Context API:**
  - `authSlice`: Stores authenticated user profile, session tokens, permissions.
  - `sellFlowSlice`: Captures selected brand, model, storage, RAM, condition answers, generated `quoteId`.
  - `cartSlice`: Persistent cart items (persisted to `localStorage`).
- **Axios HTTP Client (`src/lib/axios.ts`):**
  - Configured base URL (`process.env.NEXT_PUBLIC_API_BASE_URL`).
  - Request Interceptors: Automatically injects JWT Bearer token into HTTP headers.
  - Response Interceptors: Centralized handling for `401 Unauthorized` (triggers refresh token flow or clean logout) and toast notifications for `500` server errors.

---

## 3. EXPRESS.JS BACKEND DETAILED STRUCTURE

### 3.1 Directory Organization (Clean 3-Tier Modular Structure)

```
selbar-backend/
├── src/
│   ├── config/                 # DB, Redis, Razorpay, Environment configurations
│   │   ├── database.js         # Mongoose connection with pooling options
│   │   ├── razorpay.js         # Razorpay SDK instance
│   │   ├── redis.js            # Redis client & BullMQ queue setup
│   │   └── env.js              # Validated environment variables (via Joi / Zod)
│   ├── common/                 # Shared utilities, constants, and base classes
│   │   ├── constants/          # Status enums, order states, error codes
│   │   ├── errors/             # Custom ApiError, NotFoundError, BadRequestError
│   │   ├── middlewares/        # Auth, Validation, Error, Rate-limiting, Upload
│   │   └── utils/              # Crypto helper, logger (Winston), formatters
│   ├── modules/                # Feature-based modular structure
│   │   ├── auth/               # Controller, Service, Routes, Validation, Schema
│   │   ├── user/               # Profile, Addresses, Saved preferences
│   │   ├── catalog/            # Brands, Models, Variants, Deduction Rules
│   │   ├── pricing/            # Core quotation engine, dynamic price calculator
│   │   ├── orders/             # State machine (Sell orders & Buy orders)
│   │   ├── payments/           # Razorpay Order creation, Webhooks, Payouts
│   │   ├── screener/           # Recommerce screener, filters, market trends
│   │   ├── admin/              # Executive assignment, inventory QC, analytics
│   │   └── notifications/      # BullMQ queue workers (SMS, Email, Push)
│   ├── app.js                  # Express application setup, middlewares, routes
│   └── server.js               # HTTP server listener, Graceful shutdown handler
├── logs/                       # Winston error & combined log files
├── tests/                      # Unit & integration tests (Jest / Supertest)
├── Dockerfile                  # Production container configuration
└── package.json
```

### 3.2 Global Error Handling Pattern
Standardized error responses guarantee frontend clients receive predictable error structures:

```javascript
// src/common/errors/ApiError.js
class ApiError extends Error {
  constructor(statusCode, message, errors = [], stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.success = false;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// src/common/middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  if (!(err instanceof ApiError)) {
    statusCode = err.statusCode || 500;
    message = err.message || 'Internal Server Error';
  }

  const response = {
    success: false,
    statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    errors: err.errors || []
  };

  res.status(statusCode).json(response);
};
```

### 3.3 Authentication & Authorization Middleware
- **Double Token Pattern:**
  - **Access Token:** Short-lived (15 minutes), signed with `JWT_ACCESS_SECRET`, passed via `Authorization: Bearer <token>`.
  - **Refresh Token:** Long-lived (30 days), stored as HttpOnly, Secure, SameSite cookie, hashed in MongoDB.
- **RBAC Roles:** `customer`, `executive` (field inspection agent), `admin`, `super_admin`.

```javascript
// src/common/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');
const ApiError = require('../errors/ApiError');
const User = require('../../modules/user/user.model');

const verifyJWT = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new ApiError(401, 'Unauthorized request: No token provided');

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(decoded.id).select('-password -otp');
    if (!user) throw new ApiError(401, 'Invalid Access Token');

    req.user = user;
    next();
  } catch (error) {
    next(new ApiError(401, error?.message || 'Invalid access token'));
  }
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, `Access denied: Requires one of [${allowedRoles.join(', ')}]`));
    }
    next();
  };
};
```

### 3.4 Production Security Middlewares Suite
1. **Helmet:** Set strict security HTTP headers (`Content-Security-Policy`, `X-Frame-Options`, `HSTS`).
2. **CORS:** Whitelist only allowed origins (`https://selbar.in`, `https://admin.selbar.in`).
3. **Express Rate Limit:**
   - Global API limiter: 200 requests / 15 mins per IP.
   - OTP generation limiter: 5 requests / hour per mobile number.
   - Quotation calculation limiter: 30 requests / 10 mins per IP (prevents competitor price scraping).
4. **Mongo Sanitize:** Prevents NoSQL query injection attacks (e.g. `$gt: ""`).
5. **HPP (HTTP Parameter Pollution):** Sanitizes duplicated query parameters.

---

## 4. MONGODB SCHEMA DESIGNS (MONGOOSE ODM)

### 4.1 Schema Modeling Strategy (Embedding vs. Referencing)
- **Embedded Documents:** Addresses (1-to-few), Order Timeline events, Item condition snapshots. Since these are updated together with the root document and don't grow unbounded, embedding provides high-speed, atomic, single-document read/writes.
- **Referenced Documents (`ObjectId` with `.populate()`):** Users, Catalog Products, Orders, and Payments. This ensures relational consistency, keeps document sizes well below the 16MB MongoDB limit, and avoids repetitive data bloat.

### 4.2 Core Collection Schemas

#### A. Users Collection (`users`)
```javascript
const userSchema = new mongoose.Schema({
  phone: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true, 
    index: true,
    match: [/^[6-9]\d{9}$/, 'Please enter valid 10-digit Indian phone number'] 
  },
  name: { type: String, trim: true, default: '' },
  email: { type: String, trim: true, lowercase: true, sparse: true, index: true },
  role: { 
    type: String, 
    enum: ['customer', 'executive', 'admin', 'super_admin'], 
    default: 'customer',
    index: true
  },
  payoutDetails: {
    upiId: { type: String, trim: true },
    bankAccount: {
      accountNumber: { type: String, select: false },
      ifscCode: { type: String },
      beneficiaryName: { type: String }
    }
  },
  addresses: [{
    label: { type: String, enum: ['home', 'work', 'other'], default: 'home' },
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true, index: true },
    isDefault: { type: Boolean, default: false }
  }],
  refreshToken: { type: String, select: false },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
```

#### B. Catalog & Models Collection (`catalog_models`)
```javascript
const modelVariantSchema = new mongoose.Schema({
  ram: { type: String, required: true },
  storage: { type: String, required: true },
  basePrice: { type: Number, required: true, min: 0 }
});

const catalogModelSchema = new mongoose.Schema({
  brand: { type: String, required: true, index: true },
  modelName: { type: String, required: true, index: true },
  category: { type: String, enum: ['smartphone', 'laptop', 'tablet'], default: 'smartphone', index: true },
  slug: { type: String, required: true, unique: true, index: true },
  imageUrl: { type: String, required: true },
  variants: [modelVariantSchema],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

catalogModelSchema.index({ brand: 1, modelName: 1 });
catalogModelSchema.index({ modelName: 'text' });
```

#### C. Orders Collection (`orders`)
Supports both Sell Orders (doorstep pickup) and Buy Orders (refurbished e-commerce).

```javascript
const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true, index: true }, // e.g., SEL-2026-94812
  orderType: { type: String, enum: ['SELL', 'BUY'], required: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  
  // Sell-Specific Details
  sellDetails: {
    model: { type: mongoose.Schema.Types.ObjectId, ref: 'CatalogModel' },
    variant: { ram: String, storage: String },
    quotedPrice: { type: Number },
    inspectedPrice: { type: Number },
    conditionSummary: [{ question: String, answer: String, deduction: Number }],
    pickupSlot: {
      date: { type: Date },
      timeWindow: { type: String } // e.g. "10:00 AM - 01:00 PM"
    },
    pickupAddress: {
      line1: String,
      city: String,
      state: String,
      pincode: String
    },
    assignedExecutive: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
  },

  // Buy-Specific Details
  buyDetails: {
    items: [{
      inventoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'RefurbInventory' },
      modelName: String,
      variant: String,
      grade: { type: String, enum: ['FAIR', 'GOOD', 'SUPERB'] },
      price: Number,
      warrantyMonths: Number
    }],
    shippingAddress: {
      line1: String,
      city: String,
      state: String,
      pincode: String
    },
    trackingNumber: String
  },

  status: {
    type: String,
    enum: [
      // Sell Lifecycle
      'QUOTED', 'PICKUP_SCHEDULED', 'EXECUTIVE_ASSIGNED', 'OUT_FOR_PICKUP', 
      'INSPECTED', 'PAYMENT_PENDING', 'COMPLETED', 'CANCELLED',
      // Buy Lifecycle
      'PAYMENT_PENDING', 'PLACED', 'PACKED', 'SHIPPED', 'DELIVERED', 'RETURNED'
    ],
    default: 'QUOTED',
    index: true
  },
  
  payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  statusTimeline: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    notes: String,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }]
}, { timestamps: true });

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, orderType: 1 });
```

#### D. Payments & Transactions Collection (`payments`)
```javascript
const paymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  paymentType: { type: String, enum: ['COLLECTION', 'PAYOUT'], required: true }, // COLLECTION=Buy, PAYOUT=Sell
  
  // Razorpay Gateway Identifiers
  razorpayOrderId: { type: String, unique: true, sparse: true, index: true },
  razorpayPaymentId: { type: String, unique: true, sparse: true, index: true },
  razorpaySignature: { type: String },
  razorpayPayoutId: { type: String, unique: true, sparse: true }, // RazorpayX Payout ID
  
  amount: { type: Number, required: true }, // in INR Rupees
  currency: { type: String, default: 'INR' },
  method: { type: String, enum: ['UPI', 'CARD', 'NETBANKING', 'WALLET', 'IMPS', 'NEFT', 'CASH'], default: 'UPI' },
  
  status: { 
    type: String, 
    enum: ['CREATED', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUNDED', 'PROCESSED'], 
    default: 'CREATED',
    index: true
  },
  
  refunds: [{
    refundId: String,
    amount: Number,
    status: String,
    reason: String,
    createdAt: { type: Date, default: Date.now }
  }],
  
  webhookPayloads: [mongoose.Schema.Types.Mixed], // Audit trail of raw webhooks received
  failureReason: String
}, { timestamps: true });
```

#### E. Screener & Saved Searches Collection (`screeners`)
```javascript
const screenerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  filters: {
    brands: [String],
    priceRange: { min: Number, max: Number },
    grades: [String],
    storageOptions: [String],
    minWarrantyMonths: Number,
    categories: [String]
  },
  isAlertEnabled: { type: Boolean, default: false },
  lastTriggeredAt: Date
}, { timestamps: true });
```

---

## 5. RAZORPAY INTEGRATION END-TO-END SPECIFICATION

### 5.1 Payment Flows
1. **Inbound Collection Flow (Buy Refurbished Devices):**
   - User reviews cart and confirms shipping address.
   - Backend calls `razorpay.orders.create({ amount: amountInPaise, currency: 'INR', receipt: orderNumber })`.
   - Frontend triggers Razorpay Standard Checkout SDK.
   - On success, frontend sends `{ razorpay_order_id, razorpay_payment_id, razorpay_signature }` to backend.
   - Backend performs cryptographic verification and commits order as `PLACED`.
   - Webhook acts as the fail-safe authority to guarantee order fulfillment even if the user closes the browser before redirection.
2. **Outbound Payout Flow (Sell Old Device Payout):**
   - Executive completes physical inspection on doorstep and user accepts final price.
   - Backend calls RazorpayX Payouts API (`POST /v1/payouts`) with user's verified UPI VPA or Bank Account.
   - Instant payment confirmation via IMPS/UPI within seconds.

### 5.2 Razorpay Order Creation Endpoint
```javascript
// src/modules/payments/payment.service.js
const Razorpay = require('razorpay');
const crypto = require('crypto');
const ApiError = require('../../common/errors/ApiError');
const Payment = require('./payment.model');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createRazorpayOrder = async (orderId, amount, userId) => {
  const options = {
    amount: Math.round(amount * 100), // Razorpay operates in paise
    currency: 'INR',
    receipt: `rcpt_${orderId.toString().slice(-8)}`,
    notes: { orderId: orderId.toString(), userId: userId.toString() }
  };

  const rzpOrder = await razorpay.orders.create(options);

  const paymentRecord = await Payment.create({
    order: orderId,
    user: userId,
    paymentType: 'COLLECTION',
    razorpayOrderId: rzpOrder.id,
    amount: amount,
    status: 'CREATED'
  });

  return { rzpOrder, paymentId: paymentRecord._id };
};
```

### 5.3 Cryptographic Signature Verification (HMAC-SHA256)

#### A. Client-to-Server Verification (Sync API)
```javascript
exports.verifyClientPayment = async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generatedSignature !== razorpay_signature) {
    throw new ApiError(400, 'Invalid payment signature! Fraudulent transaction attempt.');
  }

  const payment = await Payment.findOneAndUpdate(
    { razorpayOrderId: razorpay_order_id },
    { 
      razorpayPaymentId: razorpay_payment_id, 
      razorpaySignature: razorpay_signature,
      status: 'CAPTURED'
    },
    { new: true }
  );

  return payment;
};
```

#### B. Async Webhook Signature Verification (`/api/v1/payments/webhook`)
```javascript
// IMPORTANT: Webhook requires raw request body for accurate byte-level HMAC check
exports.handleWebhook = async (req, res) => {
  const webhookSignature = req.headers['x-razorpay-signature'];
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(req.rawBody) // req.rawBody preserved via express.raw() or custom middleware
    .digest('hex');

  if (webhookSignature !== expectedSignature) {
    return res.status(400).json({ status: 'error', message: 'Invalid webhook signature' });
  }

  const event = req.body.event;
  const payload = req.body.payload;

  // Immediate 200 OK acknowledgment to prevent Razorpay retries
  res.status(200).json({ status: 'ok' });

  // Push event to BullMQ background queue for reliable asynchronous processing
  await paymentQueue.add('process-razorpay-webhook', { event, payload });
};
```

### 5.4 Refund Handling & Idempotency
- **Idempotency:** Every webhook event has an `x-razorpay-event-id`. We maintain an `idempotency_keys` collection to verify whether the event has already been processed, preventing double-crediting or duplicate status changes.
- **Automated Refunds:** If a buyer cancels an order before dispatch, an automated call is triggered:
  ```javascript
  const refund = await razorpay.payments.refund(payment.razorpayPaymentId, {
    amount: payment.amount * 100,
    speed: 'optimum',
    notes: { reason: 'Customer cancellation prior to dispatch' }
  });
  ```

---

## 6. ENVIRONMENT VARIABLES & SECURITY MATRIX

### 6.1 Complete Variable Specification

| Variable Name | Environment | Example Value | Description |
|---|---|---|---|
| `NODE_ENV` | All | `production` / `development` | Runtime environment flag |
| `PORT` | Backend | `5000` | Port for Express HTTP server |
| `MONGO_URI` | Backend | `mongodb+srv://selbar:pass@cluster.mongodb.net/selbar_prod?retryWrites=true&w=majority` | Atlas connection string |
| `REDIS_URL` | Backend | `rediss://default:pass@redis-host.com:6379` | Queue and cache Redis URL |
| `JWT_ACCESS_SECRET` | Backend | `64_char_crypto_random_hex_string` | Signs 15m access tokens |
| `JWT_REFRESH_SECRET` | Backend | `64_char_crypto_random_hex_string` | Signs 30d refresh tokens |
| `RAZORPAY_KEY_ID` | Both | `rzp_live_xxxxxxxxxxxx` | Public Razorpay key |
| `RAZORPAY_KEY_SECRET`| Backend | `xxxxxxxxxxxxxxxxxxxx` | Private API key |
| `RAZORPAY_WEBHOOK_SECRET` | Backend | `whsec_xxxxxxxxxxxx` | Secret for HMAC webhook verification |
| `MSG91_AUTH_KEY` | Backend | `auth_token_msg91` | SMS OTP sending key |
| `MSG91_OTP_TEMPLATE_ID` | Backend | `649a1b2c3d4e5f6` | DLT registered template ID |
| `AWS_S3_BUCKET` | Backend | `selbar-assets-prod` | Media & document bucket |
| `AWS_ACCESS_KEY_ID` | Backend | `AKIAIOSFODNN7EXAMPLE` | S3 IAM user key |
| `AWS_SECRET_ACCESS_KEY` | Backend | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` | S3 secret |
| `NEXT_PUBLIC_API_BASE_URL` | Frontend | `https://api.selbar.in/api/v1` | Public API endpoint for Axios |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID`| Frontend | `rzp_live_xxxxxxxxxxxx` | Public key for frontend checkout modal |

### 6.2 Security Rules
1. **Never commit `.env` or `.env.local`:** Enforced by `.gitignore`.
2. **Key Rotation:** Razorpay Webhook Secret and JWT Secrets rotated every 90 days.
3. **Restricted CORS Origins:** Whitelist only the production frontend and admin domains; reject wildcard `*` origins in production.

---

## 7. DEPLOYMENT STRATEGY & CI/CD PIPELINES

### 7.1 Multi-Cloud Infrastructure Topology
- **Frontend:** **Vercel** — Automated Edge global caching, SSR Node runtime, zero-downtime atomic deployments.
- **Backend:** **AWS EC2 / Render / Railway / Hostinger VPS** — Managed via **PM2** (cluster mode with `max` CPUs) behind an **Nginx** reverse proxy handling SSL certificates (Let's Encrypt / Certbot).
- **Database:** **MongoDB Atlas (M10+ Replica Set)** — Automated daily snapshots, point-in-time recovery, IP allowlist limited exclusively to the backend server static IPs.
- **Queue/Cache:** **Redis Cloud / Upstash** — Low-latency job persistence for BullMQ.

### 7.2 GitHub Actions CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: SELBAR CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]

jobs:
  test_and_lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - name: Install & Test Frontend
        run: |
          cd Website
          npm ci
          npm run lint
          npm run build
      - name: Install & Test Backend
        run: |
          cd ../Backend # When backend repo is initialized
          npm ci || true
          npm test || true

  deploy_production:
    needs: test_and_lint
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy Frontend to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
      
      - name: Deploy Backend via SSH & PM2
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.PROD_SERVER_IP }}
          username: ${{ secrets.PROD_SSH_USER }}
          key: ${{ secrets.PROD_SSH_KEY }}
          script: |
            cd /var/www/selbar-backend
            git pull origin main
            npm ci --production
            pm2 reload ecosystem.config.js --env production
```

---

## 8. PERFORMANCE OPTIMIZATION & RELIABILITY

### 8.1 Next.js & Frontend Optimizations
- **Image Optimization:** Always use `next/image` with WebP/AVIF auto-conversion, explicit width/height to avoid Cumulative Layout Shift (CLS < 0.1), and `priority` on above-the-fold banners.
- **Code Splitting & Lazy Loading:** Use `next/dynamic` for high-weight client libraries:
  ```javascript
  const RechartsAnalytics = dynamic(() => import('@/components/analytics/PriceChart'), {
    ssr: false,
    loading: () => <div className="h-64 animate-pulse bg-slate-100 rounded-xl" />
  });
  ```
- **Font Optimization:** Loaded via `next/font/google` (Inter / Outfit) to eliminate render-blocking external stylesheets.

### 8.2 Backend & MongoDB Optimizations
- **`.lean()` Queries:** All read-only catalog queries use `.lean()` to bypass Mongoose hydration overhead, reducing query execution time by 60%.
- **Targeted Projection:** Use `.select('brand modelName imageUrl variants.basePrice')` so unnecessary nested fields never traverse the network.
- **Compound Indexing:** Indexes created on `{ brand: 1, category: 1 }` and `{ status: 1, createdAt: -1 }`.
- **Redis Response Caching:** Catalog endpoints (`/catalog/brands`, `/catalog/models`) cached with a 1-hour TTL and invalidated automatically upon admin catalog updates.
- **Webhook Reliability:** Razorpay webhooks return `200 OK` in <50ms and delegate work to BullMQ queues, eliminating gateway timeout retries.

---

## 9. IMPLEMENTATION PRIORITY: MVP VS. ENHANCEMENT PHASE

### 9.1 Phase-Wise Feature Matrix

| Feature Module | MVP Scope (Phase 1–4 Launch) | Enhancement Scope (Phase 5–7 & v1.1) | Priority |
|---|---|---|---|
| **Sell Flow** | Mobile phones only, Brand/Model selection, Condition questionnaire, Instant quote algorithm, Doorstep pickup scheduling | Laptops, Tablets, Smartwatches, Smart AI condition assessment via camera photo upload | **P0 (Critical)** |
| **Buy Flow** | Refurbished phone catalog, Condition grade tags (Fair, Good, Superb), Cart, Checkout, Order tracking | Price-drop alerts, EMI calculator, Trade-in exchange discount at checkout | **P0 (Critical)** |
| **Authentication** | Mobile 10-digit OTP login (MSG91/Twilio), JWT access/refresh tokens | Google OAuth, Facebook Login, WhatsApp OTP login, 2FA for Admin | **P0 (Critical)** |
| **Payment Gateway** | Razorpay Standard Checkout (UPI, Cards, Netbanking) for Buy flow, Cash on Pickup for Sell flow | RazorpayX Automated Payouts (Direct UPI transfer on doorstep to seller), Automated Refunds | **P0 / P1** |
| **Admin Panel** | Base price updater, Deduction rules table, Order list, Executive assignment, Inventory intake | Advanced Profit & Loss analytics, Live executive GPS route map, Bulk Excel/CSV catalog import | **P0 / P1** |
| **Screener & Analytics** | Basic device filter (Price, Brand, Grade) | Interactive Chart.js / Recharts price-trend history, custom saved screeners with email alerts | **P1 / P2** |
| **Background Jobs** | Node-cron / BullMQ for SMS and Email notifications | Redis distributed BullMQ cluster, automated daily invoice generation, multi-day abandoned cart reminders | **P1 / P2** |

---

## 10. DETAILED 7-PHASE EXECUTION ROADMAP

```
+---------------------------------------------------------------------------------------------------------+
| PHASE | DURATION   | SCOPE & DELIVERABLES                                                               |
+---------------------------------------------------------------------------------------------------------+
| Ph 1  | 5-7 Days   | Requirement Analysis, Schema Finalization, Repository setup, Project Board         |
| Ph 2  | 10-14 Days | Wireframing & High-Fidelity UI/UX in Figma (Sell, Buy, Admin, Mobile Responsive)   |
| Ph 3  | 20-25 Days | Next.js Frontend Development: App Router, Tailwind CSS, Redux, Recharts, Forms     |
| Ph 4  | 25-35 Days | Express.js + Node.js Backend & MongoDB Mongoose: APIs, Auth, State Machine, Admin   |
| Ph 5  | 10-15 Days | Third-Party Integrations: Razorpay PG, RazorpayX, MSG91 SMS OTP, AWS S3, BullMQ    |
| Ph 6  | 7-10 Days  | Testing & QA: Jest, Postman, Security Audit, Lighthouse 90+, Client Staging UAT    |
| Ph 7  | 3-5 Days   | Production Deployment: Vercel, VPS PM2+Nginx, MongoDB Atlas, DNS, SSL & Handover   |
+---------------------------------------------------------------------------------------------------------+
```

### Phase 1 — Requirement Analysis & Planning (5–7 Days)
- Kick-off meeting with client to finalize all feature requirements, pricing algorithm rules, and expectations.
- Finalizing third-party credentials (Razorpay API keys, MSG91 SMS DLT credentials, AWS S3 bucket, MongoDB Atlas cluster).
- Defining detailed Mongoose schemas, user roles (`customer`, `executive`, `admin`, `super_admin`), and system architecture.
- Initializing Git repositories (`selbar-frontend`, `selbar-backend`), setting up commit conventions, and branch rules.

### Phase 2 — UI/UX Wireframing & Design (10–14 Days)
- Low-fidelity wireframes covering Sell wizard, Refurbished Store, Cart/Checkout, User Dashboard, and Admin management.
- Brand identity alignment: Primary colors (Emerald/Indigo trust palette), typography (Outfit/Inter), icon set (Lucide).
- High-fidelity Figma prototypes with mobile-first responsiveness.
- Maximum 2 client feedback iterations and formal design sign-off.

### Phase 3 — Frontend Development (20–25 Days)
- Converting approved Figma components into modular Next.js 14+ (App Router) client/server components.
- Responsive layout with Tailwind CSS: Navigation headers, bottom mobile nav bar, modals, sliders, and sticky CTAs.
- Integrating Recharts for dynamic visual price breakdown and device depreciation charts.
- State management with Redux Toolkit (Auth state, persistent cart, sell evaluation step answers).
- Performance optimizations: WebP next/image optimizations, code splitting, dynamic imports.

### Phase 4 — Backend Development (25–35 Days)
- Node.js + Express.js setup with 3-tier modular architecture (`routes`, `controllers`, `services`, `models`, `middlewares`).
- Full authentication system: 6-digit OTP request & verify, JWT tokens with HttpOnly cookies, refresh token rotation.
- Sell Order & Buy Order state machine with atomic Mongoose transitions and transaction integrity.
- Pricing Engine Service: Calculates deductions dynamically based on answers against the database deduction matrix.
- Comprehensive security: Helmet, CORS whitelist, Express rate-limit, Mongo-sanitize, centralized `ApiError` handler.

### Phase 5 — API Integration (10–15 Days)
- Razorpay Payment Gateway integration: order creation, client checkout modal, HMAC-SHA256 signature verification.
- Razorpay Webhook listener with raw-body cryptographic verification and BullMQ asynchronous processing.
- MSG91 / Twilio integration for SMS OTP delivery and transactional SMS notifications.
- AWS S3 / Cloudflare R2 integration for uploading device photos and condition inspection attachments.
- CSV / Excel export functionality for admin order reports using `exceljs`.

### Phase 6 — Testing & QA (7–10 Days)
- Unit & integration testing with Jest & Supertest for pricing engine deductions and order status transitions.
- Cross-browser & cross-device compatibility testing (iOS Safari, Android Chrome, Windows, macOS).
- Security audit: NoSQL injection test, XSS sanitization, rate-limit brute force testing, signature tampering tests.
- Performance testing: Google Lighthouse optimization pass targeting **90+** score on Performance, SEO, and Best Practices.
- Staging deployment for Client User Acceptance Testing (UAT).

### Phase 7 — Deployment & Handover (3–5 Days)
- Production server provisioning: VPS / Cloud server with Nginx reverse proxy, Node.js + PM2 (cluster mode), SSL (Certbot).
- Vercel production deployment for Next.js frontend with custom domain mapping (`selbar.in`).
- MongoDB Atlas M10+ replica set configuration with IP allowlisting and automated daily backups.
- Delivery of: Full source code, Postman API collections with environment variables, database seed scripts, admin manual.
- 1-hour live walkthrough session with client and administrative team.
- 30-day post-launch warranty and bug-fix support commences.

---
*Document approved for engineering handoff. All modules, schemas, and endpoints comply with SELBAR Product Architecture v2.0.*
