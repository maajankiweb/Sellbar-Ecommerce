/**
 * Sellbar Centralized Location & Serviceability System
 *
 * Implements Client Decision CD-09:
 * - Production starts with an EMPTY serviceable list (safe default until client fills [FILL]).
 * - Staging / Dev is seeded strictly with Patna and Bettiah for testing.
 * - All other pincodes show the waitlist / "Notify Me" flow.
 */

export interface AuthorizedLocation {
  id: string;
  name: string;
  aliases: string[];
  displayName: string;
  district: string;
  state: string;
  pincodes: string[];
  isAvailable: boolean;
  deliveryDays: number;
  hubAddress: string;
}

// Staging test seed locations (Patna and Bettiah only)
export const STAGING_SEEDED_LOCATIONS: AuthorizedLocation[] = [
  {
    id: 'patna',
    name: 'Patna',
    aliases: ['patna', 'patna city', 'patna town'],
    displayName: 'Patna (Staging Test Hub)',
    district: 'Patna',
    state: 'Bihar',
    pincodes: ['800001', '800020', '800023', '800013'],
    isAvailable: true,
    deliveryDays: 1,
    hubAddress: 'Fraser Road, Patna, Bihar - 800001',
  },
  {
    id: 'bettiah',
    name: 'Bettiah',
    aliases: ['bettiah', 'bettiya', 'bettiah town'],
    displayName: 'Bettiah (Staging Test Hub)',
    district: 'West Champaran',
    state: 'Bihar',
    pincodes: ['845438'],
    isAvailable: true,
    deliveryDays: 1,
    hubAddress: 'Station Road, Near Supriya Cinema, Bettiah, Bihar - 845438',
  },
];

// Production active locations (starts empty per Client Decision CD-09)
export const PRODUCTION_LOCATIONS: AuthorizedLocation[] = [];

const isProductionEnvironment =
  process.env.APP_ENV === 'production' ||
  (process.env.NODE_ENV === 'production' && process.env.APP_ENV !== 'staging');

export const AUTHORIZED_LOCATIONS: AuthorizedLocation[] = isProductionEnvironment
  ? PRODUCTION_LOCATIONS
  : STAGING_SEEDED_LOCATIONS;

export const SERVICE_RESTRICTION_ERROR_MESSAGE =
  'Sellbar doorstep pickup is currently expanding. Our executives have not yet deployed in your area. Enter your email to be notified the moment service launches!';

/**
 * Checks if a city name matches any authorized location
 */
export function findAuthorizedLocationByCity(cityName: string): AuthorizedLocation | undefined {
  if (!cityName) return undefined;
  const clean = cityName.trim().toLowerCase();
  return AUTHORIZED_LOCATIONS.find(
    (loc) =>
      loc.name.toLowerCase() === clean ||
      loc.aliases.some((a) => clean.includes(a)) ||
      clean.includes(loc.name.toLowerCase())
  );
}

/**
 * Checks if a 6-digit pincode belongs to an authorized location
 */
export function findAuthorizedLocationByPincode(pincode: string): AuthorizedLocation | undefined {
  if (!pincode) return undefined;
  const clean = pincode.trim();
  return AUTHORIZED_LOCATIONS.find((loc) => loc.pincodes.includes(clean));
}

/**
 * Validates whether an address is serviceable
 */
export function validateServiceLocation(params: {
  city?: string;
  pincode?: string;
  district?: string;
  state?: string;
}): {
  isServiceable: boolean;
  location?: AuthorizedLocation;
  error?: string;
  showWaitlist: boolean;
} {
  const { city, pincode } = params;

  // 1. Try finding by city first
  if (city) {
    const locByCity = findAuthorizedLocationByCity(city);
    if (locByCity) {
      return { isServiceable: true, location: locByCity, showWaitlist: false };
    }
  }

  // 2. Try finding by pincode
  if (pincode) {
    const locByPin = findAuthorizedLocationByPincode(pincode);
    if (locByPin) {
      return { isServiceable: true, location: locByPin, showWaitlist: false };
    }
  }

  // Not serviceable in current phase: Prompt waitlist
  return {
    isServiceable: false,
    error: SERVICE_RESTRICTION_ERROR_MESSAGE,
    showWaitlist: true,
  };
}
