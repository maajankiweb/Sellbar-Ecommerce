# Threat Model & Security Controls

## Threat Actors & Attack Vectors

### 1. Anonymous Attacker (Credential Stuffing & Password Spraying)
* **Vector**: High-velocity automated POST requests against `/api/v1/auth/login`.
* **Impact**: Account takeover of users with reused credentials.
* **Mitigation**:
  * Redis-backed sliding-window rate limiting on IP (`10/minute`) and account identifier (`5/300s`).
  * Progressive delay and account lockout after 5 consecutive failed attempts (30-minute lockout).
  * Generic error messages ("Invalid credentials") preventing account existence enumeration.

### 2. Malicious Seller (Cross-Tenant Access / IDOR / BOLA)
* **Vector**: Seller modifies `sellerId` or `orderId` in URL parameters or request payloads to inspect a competing seller's metrics or customers.
* **Impact**: Confidential business data leakage between marketplace vendors.
* **Mitigation**:
  * Identity is strictly resolved server-side from verified session claims.
  * Server-side `verifySellerResourceOwnership()` gate blocks mismatched resource requests with `403 Forbidden`.

### 3. Refresh Token Theft & Replay
* **Vector**: Compromise of refresh token from client browser.
* **Impact**: Unauthorized long-term session persistence.
* **Mitigation**:
  * Refresh tokens stored in `httpOnly`, `SameSite=lax`, `Secure` cookies with path restricted to `/api/v1/auth`.
  * Every refresh operation rotates the token and invalidates the previous token.
  * **Token Family Reuse Detection**: If an old or previously revoked refresh token is presented, the system assumes token theft and revokes all tokens within that family, invalidating all associated sessions.

### 4. OTP Brute-Force & Flooding
* **Vector**: Automated submission of 6-digit codes to hijack mobile numbers.
* **Impact**: Account takeover or SMS gateway balance depletion.
* **Mitigation**:
  * Maximum 5 verification attempts before immediate invalidation.
  * 60-second resend cooldown; maximum 3 dispatches per 15 minutes.
  * Cryptographic HMAC-SHA256 hashing; plaintext OTPs are never stored.
  * Constant-time verification preventing timing attacks.
