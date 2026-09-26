/**
 * Turn-by-Turn Navigation Deep Linking Utilities
 * Generates direct mobile app deep links for Google Maps, Apple Maps, and Waze
 */

export interface NavigationLinks {
  googleMapsApp: string;
  wazeApp: string;
  appleMapsApp: string;
  webUniversal: string;
}

export function generateNavigationLinks(params: {
  address: string;
  lat?: number;
  lng?: number;
}): NavigationLinks {
  const encodedAddress = encodeURIComponent(params.address.trim());
  const coordsParam =
    params.lat !== undefined && params.lng !== undefined
      ? `${params.lat},${params.lng}`
      : encodedAddress;

  return {
    // Google Maps Turn-by-Turn Driving Navigation
    googleMapsApp: `https://www.google.com/maps/dir/?api=1&destination=${coordsParam}&travelmode=driving&dir_action=navigate`,

    // Waze Navigation Deep Link
    wazeApp:
      params.lat !== undefined && params.lng !== undefined
        ? `https://waze.com/ul?ll=${params.lat},${params.lng}&navigate=yes`
        : `https://waze.com/ul?q=${encodedAddress}&navigate=yes`,

    // Apple Maps (iOS Native)
    appleMapsApp:
      params.lat !== undefined && params.lng !== undefined
        ? `maps://?daddr=${params.lat},${params.lng}&dirflg=d`
        : `maps://?daddr=${encodedAddress}&dirflg=d`,

    // Universal Web Fallback
    webUniversal: `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
  };
}
