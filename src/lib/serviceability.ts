import { ServiceabilityResult } from '@/types';
import {
  findAuthorizedLocationByPincode,
  findAuthorizedLocationByCity,
  AUTHORIZED_LOCATIONS,
  SERVICE_RESTRICTION_ERROR_MESSAGE,
} from './location/config';

export function checkPincodeServiceability(pincode: string): ServiceabilityResult {
  const cleanPin = pincode.trim();

  if (!/^\d{6}$/.test(cleanPin)) {
    return {
      pincode: cleanPin,
      serviceable: false,
    };
  }

  // Check against authorized West Champaran locations
  const location = findAuthorizedLocationByPincode(cleanPin);
  if (location) {
    return {
      pincode: cleanPin,
      serviceable: true,
      city: `${location.name}, West Champaran`,
      state: 'Bihar',
      deliveryDays: location.deliveryDays,
      pickupAvailable: true,
    };
  }

  // Not in authorized target zone
  return {
    pincode: cleanPin,
    serviceable: false,
  };
}

export function checkLocationServiceability(cityOrPincode: string): {
  serviceable: boolean;
  city?: string;
  state?: string;
  deliveryDays?: number;
  pickupAvailable?: boolean;
  message?: string;
} {
  const query = cityOrPincode.trim();

  // Try pincode
  if (/^\d{6}$/.test(query)) {
    const byPin = findAuthorizedLocationByPincode(query);
    if (byPin) {
      return {
        serviceable: true,
        city: `${byPin.name}, West Champaran`,
        state: 'Bihar',
        deliveryDays: byPin.deliveryDays,
        pickupAvailable: true,
      };
    }
  }

  // Try city
  const byCity = findAuthorizedLocationByCity(query);
  if (byCity) {
    return {
      serviceable: true,
      city: `${byCity.name}, West Champaran`,
      state: 'Bihar',
      deliveryDays: byCity.deliveryDays,
      pickupAvailable: true,
    };
  }

  return {
    serviceable: false,
    message: SERVICE_RESTRICTION_ERROR_MESSAGE,
  };
}
