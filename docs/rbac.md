# Role-Based Access Control (RBAC) & Multi-Vendor Resource Isolation

## Role Hierarchy & Permissions Matrix

| Role | Description | Key Permissions |
| :--- | :--- | :--- |
| **`customer`** | Normal consumer buying or selling refurbished electronics | `orders:create`, `orders:view_own`, `profile:manage_own`, `reviews:create` |
| **`seller`** | Verified third-party merchant | `products:create_seller`, `products:update_seller`, `seller:orders_view`, `seller:orders_update`, `seller:analytics_view` |
| **`seller_manager`** | Warehouse and catalog manager for a merchant | `products:create_seller`, `products:update_seller`, `seller:orders_view` |
| **`support`** | Customer assistance staff | `orders:view_all`, `orders:update_status`, `users:view`, `tickets:manage` |
| **`moderator`** | Content and listings reviewer | `products:review`, `products:moderate`, `reviews:moderate`, `users:flag` |
| **`admin`** | Platform operations manager | Full catalog, orders, payouts, and customer management permissions |
| **`super_admin`** | Root system administrator | Wildcard (`*`) capability over all endpoints and tenants |

---

## Multi-Vendor Isolation (Anti-IDOR / Anti-BOLA)
* A seller **never** accesses or modifies another seller's catalog, orders, customers, payouts, or analytics.
* **Identity derivation**: The backend ignores client-provided `sellerId` query parameters or JSON body fields for authorization, deriving identity strictly from the authenticated JWT session context (`req.user.sellerId`).
* **Object-level validation**:
  ```typescript
  verifySellerResourceOwnership(user, resource.sellerId);
  ```
  If `user.sellerId !== resource.sellerId.toString()`, the request is rejected immediately with `403 Forbidden` (`RESOURCE_OWNERSHIP_VIOLATION`).
