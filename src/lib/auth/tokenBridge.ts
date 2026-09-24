/**
 * In-Memory Token Provider & Single-Flight Refresh Mutex
 * Stores short-lived access tokens strictly in memory (never localStorage)
 * and coordinates concurrent refresh operations to prevent token family reuse errors.
 */

let inMemoryAccessToken: string | null = null;
let isRefreshing = false;
let refreshSubscribers: ((token: string | null) => void)[] = [];

/**
 * Get current in-memory access token
 */
export function getAccessToken(): string | null {
  return inMemoryAccessToken;
}

/**
 * Set current in-memory access token
 */
export function setAccessToken(token: string | null): void {
  inMemoryAccessToken = token;
}

/**
 * Subscribe a request to be executed once the single-flight refresh resolves
 */
export function subscribeTokenRefresh(cb: (token: string | null) => void): void {
  refreshSubscribers.push(cb);
}

/**
 * Notify all subscribers of the new access token or failure
 */
export function onRefreshed(token: string | null): void {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

/**
 * Single-flight refresh token execution.
 * Only ONE refresh request will hit the server even if 10 requests fail simultaneously.
 */
export async function refreshAccessTokenSingleFlight(): Promise<string | null> {
  if (isRefreshing) {
    return new Promise((resolve) => {
      subscribeTokenRefresh((token) => {
        resolve(token);
      });
    });
  }

  isRefreshing = true;

  try {
    const res = await fetch('/api/v1/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Includes HttpOnly selbar_refresh_token cookie
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.success || !data.accessToken) {
      setAccessToken(null);
      onRefreshed(null);
      return null;
    }

    const newToken = data.accessToken as string;
    setAccessToken(newToken);
    onRefreshed(newToken);
    return newToken;
  } catch (err) {
    setAccessToken(null);
    onRefreshed(null);
    return null;
  } finally {
    isRefreshing = false;
  }
}
