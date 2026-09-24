# SELBAR Production Authentication System Architecture

## Overview
SELBAR implements a multi-tenant, horizontally scalable authentication and authorization system designed to support both single-vendor e-commerce and a multi-vendor recommerce marketplace with 1M+ registered users.

---

## 1. Authentication Strategy
* **Access Tokens**: Short-lived (15 minutes) signed JSON Web Tokens (HS256) holding minimal user identity (`userId`, `role`, `phone`, `email`, `username`, `sellerId`).
* **Refresh Tokens**: Rotating cryptographically random tokens stored as `httpOnly`, `SameSite=lax`, `Secure` cookies with 24-hour lifetime (or 30 days if `rememberMe` is enabled).
* **Storage**:
  * Client: Access tokens reside strictly in memory; refresh tokens reside in secure browser cookies.
  * Server: Refresh tokens are hashed via SHA-256 before storage in MongoDB `Session` collections with automatic TTL expiration.

---

## 2. Password Hashing (Argon2id)
Passwords are encrypted using Argon2id with OWASP-recommended parameters:
* Memory cost: 64 MB (65,536 KiB)
* Time cost: 3 iterations
* Parallelism: 4 threads
* Hash format: `$argon2id$v=19$m=65536,t=3,p=4$...`

Legacy bcrypt (`$2a$`, `$2b$`) hashes are automatically verified and silently rehashed to Argon2id upon successful sign-in.

---

## 3. Endpoints & Flows
1. `POST /api/v1/auth/register`: Zod-validated registration with terms versioning, normalized identifier checks, and initial session creation.
2. `POST /api/v1/auth/login`: Multi-identifier lookup (Email, Mobile, Username), progressive delay lockout, and HttpOnly cookie issuance.
3. `POST /api/v1/auth/refresh`: Single-flight concurrency-safe rotation with family reuse attack detection.
4. `POST /api/v1/auth/logout`: Revokes individual session or all user sessions.
5. `POST /api/v1/auth/forgot-password`: Constant-time anti-enumeration password recovery.
6. `POST /api/v1/auth/reset-password`: Hashed token verification, Argon2id rehash, and total session invalidation.
7. `POST /api/v1/auth/change-password`: Verified credential update and other-device session termination.
8. `GET /api/v1/auth/sessions`: List active device sessions with browser, OS, and location telemetry.
9. `DELETE /api/v1/auth/sessions`: Targeted or bulk session termination.
