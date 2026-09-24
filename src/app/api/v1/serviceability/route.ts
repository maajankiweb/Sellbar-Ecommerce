import { NextResponse } from 'next/server';
import { checkPincodeServiceability, checkLocationServiceability } from '@/lib/serviceability';
import { AUTHORIZED_LOCATIONS, SERVICE_RESTRICTION_ERROR_MESSAGE } from '@/lib/location/config';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pincode = searchParams.get('pincode');
  const city = searchParams.get('city');

  if (!pincode && !city) {
    return NextResponse.json(
      {
        success: false,
        error: 'Pincode or City is required',
        allowedLocations: AUTHORIZED_LOCATIONS.map((l) => ({
          name: l.name,
          displayName: l.displayName,
          pincodes: l.pincodes,
        })),
      },
      { status: 400 }
    );
  }

  if (pincode) {
    const result = checkPincodeServiceability(pincode);
    if (!result.serviceable) {
      return NextResponse.json({
        success: true,
        data: {
          ...result,
          serviceable: false,
          error: SERVICE_RESTRICTION_ERROR_MESSAGE,
          authorizedLocations: AUTHORIZED_LOCATIONS.map((l) => l.name),
        },
      });
    }
    return NextResponse.json({ success: true, data: result });
  }

  if (city) {
    const result = checkLocationServiceability(city);
    return NextResponse.json({ success: true, data: result });
  }

  return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
}
