import { NextResponse } from 'next/server';

interface WarrantyClaim {
  id: string;
  orderNumber: string;
  deviceImei: string;
  issueType: string;
  description?: string;
  resolution: 'DOORSTEP_REPAIR' | 'REPLACEMENT';
  pickupDate: string;
  status: 'OPEN' | 'UNDER_REVIEW' | 'APPROVED' | 'REPAIR' | 'REPLACEMENT' | 'REJECTED' | 'RESOLVED';
  createdAt: string;
  updatedAt: string;
}

// In-memory claim store
const claimStore = new Map<string, WarrantyClaim>();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get('orderNumber');

    const claims = Array.from(claimStore.values()).filter((c) =>
      orderNumber ? c.orderNumber === orderNumber : true
    );

    return NextResponse.json({
      success: true,
      data: claims,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to retrieve warranty claims';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { claimId, orderNumber, deviceImei, issueType, description, resolution, pickupDate } = body;

    if (!orderNumber || !deviceImei || !issueType) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters: orderNumber, deviceImei, issueType' },
        { status: 400 }
      );
    }

    const id = claimId || `CLM-WAR-${Date.now().toString(36).toUpperCase()}`;
    const newClaim: WarrantyClaim = {
      id,
      orderNumber,
      deviceImei,
      issueType,
      description: description || '',
      resolution: resolution || 'DOORSTEP_REPAIR',
      pickupDate: pickupDate || new Date().toISOString().split('T')[0],
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    claimStore.set(id, newClaim);

    return NextResponse.json({
      success: true,
      message: 'Warranty claim registered successfully. Doorstep technician scheduled.',
      data: newClaim,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create warranty claim';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
