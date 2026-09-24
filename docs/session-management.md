# Session Management Architecture

## 1. Multi-Device Concurrent Sessions
* Each login creates an isolated record in the `Session` MongoDB collection with device fingerprinting (OS, browser, device category, IP address, approximate location).
* Users can view and audit all active devices from `/account/security`.

## 2. In-Memory Token Provider & Concurrency Mutex
* Single-flight execution prevents multiple concurrent component requests from firing parallel `/api/v1/auth/refresh` calls that trigger false-positive token family reuse revocations.
* In-flight requests subscribe to a single shared Promise via `refreshAccessTokenSingleFlight()`.

## 3. Session Revocation Triggers
* **Password Reset**: Automatically revokes 100% of existing sessions across all devices.
* **Password Change**: Automatically revokes all other device sessions while preserving the current active session.
* **Token Family Reuse**: Automatically revokes all sessions belonging to the affected token family.
* **Manual Sign-Out**: Users can revoke individual sessions or select "Sign Out All Other Devices".
