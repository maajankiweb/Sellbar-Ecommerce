import { NextResponse } from 'next/server';
import { db } from '@/lib/db/data';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const order = db.sellOrders.get(id);

  if (!order) {
    return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: order });
}

import { getSiteSettings } from '@/lib/settings/siteSettings';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const order = db.sellOrders.get(id);

  if (!order) {
    return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const targetState = (body.state || body.status || '').toUpperCase();
    const payoutMode = body.payoutMode || order.payoutMode;
    const payoutDetails = { ...order.payoutDetails, ...body.payoutDetails };

    // CD-05: Enforce Seller Payout Controls when moving to PAID
    if (targetState === 'PAID') {
      const settings = await getSiteSettings();
      const payoutAmount = body.actualPaidPrice ?? order.actualPaidPrice ?? body.revisedPrice ?? order.revisedPrice ?? order.quotedPrice;
      const approvalLimit = settings.payoutApprovalLimit ?? 10000;

      // 1. UPI Controls
      if (payoutMode === 'UPI') {
        const utr = payoutDetails.utr || body.utr;
        if (!utr?.trim()) {
          return NextResponse.json(
            {
              success: false,
              error: 'UTR reference number is mandatory before marking a UPI payout as PAID (CD-05).',
            },
            { status: 400 }
          );
        }
      }

      // 2. Cash Controls
      if (payoutMode === 'Instant Cash' || payoutMode === 'Cash') {
        const handoverOtp = payoutDetails.handoverOtp || body.handoverOtp;
        const sellerId = payoutDetails.sellerIdProofNumber || payoutDetails.sellerIdCapture || body.sellerIdProofNumber || body.sellerIdCapture;

        if (!handoverOtp?.trim() || !sellerId?.trim()) {
          return NextResponse.json(
            {
              success: false,
              error: 'Both Handover OTP and Seller ID Capture (Aadhaar/PAN/Voter ID) are mandatory before completing a cash payout (CD-05).',
            },
            { status: 400 }
          );
        }
      }

      // 3. Approval Limit Threshold
      if (payoutAmount > approvalLimit) {
        const isApproved = body.adminApproved || payoutDetails.adminApproved;
        if (!isApproved) {
          payoutDetails.requiresAdminApproval = true;
          return NextResponse.json(
            {
              success: false,
              requiresAdminApproval: true,
              payoutAmount,
              approvalLimit,
              error: `Payout of ₹${payoutAmount.toLocaleString('en-IN')} exceeds the approval threshold of ₹${approvalLimit.toLocaleString('en-IN')}. Admin approval is required before disbursement (CD-05).`,
            },
            { status: 403 }
          );
        }
      }
    }

    const updated = {
      ...order,
      ...body,
      payoutDetails,
      updatedAt: new Date().toISOString(),
    };

    db.sellOrders.set(id, updated);
    return NextResponse.json({ success: true, data: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
