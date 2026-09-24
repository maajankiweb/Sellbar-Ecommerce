/**
 * SELBAR Centralized Location Management System
 * 
 * Target Zone: West Champaran, Bihar
 * Authorized Hubs: Bagaha, Bettiah, Lauriya, Ramnagar, Valmikinagar, Narkatiaganj
 * 
 * Designed for modular expansion to new districts/states in future phases.
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

export const TARGET_DISTRICT = 'West Champaran';
export const TARGET_STATE = 'Bihar';

export const AUTHORIZED_LOCATIONS: AuthorizedLocation[] = [
  {
    id: 'bettiah',
    name: 'Bettiah',
    aliases: ['bettiah', 'bettiya', 'west champaran hq', 'bettiah town'],
    displayName: 'Bettiah, West Champaran',
    district: 'West Champaran',
    state: 'Bihar',
    pincodes: ['845438', '845444', '845455', '845456'],
    isAvailable: true,
    deliveryDays: 1,
    hubAddress: 'Station Road, Near Supriya Cinema, Bettiah, West Champaran, Bihar - 845438',
  },
  {
    id: 'bagaha',
    name: 'Bagaha',
    aliases: ['bagaha', 'bagaha-1', 'bagaha-2', 'bagaha bazar'],
    displayName: 'Bagaha, West Champaran',
    district: 'West Champaran',
    state: 'Bihar',
    pincodes: ['845105', '845106', '845107', '845108'],
    isAvailable: true,
    deliveryDays: 1,
    hubAddress: 'Main Market Road, Near Gandhi Chowk, Bagaha, West Champaran, Bihar - 845105',
  },
  {
    id: 'narkatiaganj',
    name: 'Narkatiaganj',
    aliases: ['narkatiaganj', 'narkatiyaganj', 'narkatiya ganj', 'narkatia ganj'],
    displayName: 'Narkatiaganj, West Champaran',
    district: 'West Champaran',
    state: 'Bihar',
    pincodes: ['845455', '845458', '845459'],
    isAvailable: true,
    deliveryDays: 1,
    hubAddress: 'Station Road, Near Railway Junction, Narkatiaganj, West Champaran, Bihar - 845455',
  },
  {
    id: 'ramnagar',
    name: 'Ramnagar',
    aliases: ['ramnagar', 'ram nagar', 'ramnagar champaran'],
    displayName: 'Ramnagar, West Champaran',
    district: 'West Champaran',
    state: 'Bihar',
    pincodes: ['845103', '845106'],
    isAvailable: true,
    deliveryDays: 1,
    hubAddress: 'Cinema Chowk, Main Market, Ramnagar, West Champaran, Bihar - 845103',
  },
  {
    id: 'lauriya',
    name: 'Lauriya',
    aliases: ['lauriya', 'lauriya nandangarh', 'lauriya chowk'],
    displayName: 'Lauriya, West Champaran',
    district: 'West Champaran',
    state: 'Bihar',
    pincodes: ['845453'],
    isAvailable: true,
    deliveryDays: 1,
    hubAddress: 'Near Ashok Pillar Chowk, Lauriya, West Champaran, Bihar - 845453',
  },
  {
    id: 'valmikinagar',
    name: 'Valmikinagar',
    aliases: ['valmikinagar', 'valmiki nagar', 'valmiknagar'],
    displayName: 'Valmikinagar, West Champaran',
    district: 'West Champaran',
    state: 'Bihar',
    pincodes: ['845107'],
    isAvailable: true,
    deliveryDays: 2,
    hubAddress: 'Main Gate Complex, Near Tiger Reserve, Valmikinagar, West Champaran, Bihar - 845107',
  },
];

export const SERVICE_RESTRICTION_ERROR_MESSAGE =
  'Currently, SELBAR services (Sell, Buy & Repair) are exclusively active in West Champaran, Bihar (Bagaha, Bettiah, Lauriya, Ramnagar, Valmikinagar, Narkatiaganj). Service in other areas will launch soon!';

/**
 * Checks if a city name matches any authorized location in West Champaran
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
} {
  const { city, pincode } = params;

  // 1. Try finding by city first
  if (city) {
    const locByCity = findAuthorizedLocationByCity(city);
    if (locByCity) {
      return { isServiceable: true, location: locByCity };
    }
  }

  // 2. Try finding by pincode
  if (pincode) {
    const locByPin = findAuthorizedLocationByPincode(pincode);
    if (locByPin) {
      return { isServiceable: true, location: locByPin };
    }
  }

  // Not serviceable in current phase
  return {
    isServiceable: false,
    error: SERVICE_RESTRICTION_ERROR_MESSAGE,
  };
}
