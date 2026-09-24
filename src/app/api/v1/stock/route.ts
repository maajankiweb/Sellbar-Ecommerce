import { NextResponse } from 'next/server';
import {
  getInventorySummary,
  deductStockForOrder,
  restoreStock,
  adjustStockManual,
  getStockAuditLogs,
} from '@/lib/stock/inventoryEngine';

export async function GET() {
  try {
    const summary = await getInventorySummary();
    const recentLogs = getStockAuditLogs(30);

    return NextResponse.json({
      success: true,
      summary,
      recentLogs,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch inventory data';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'deduct') {
      const { items, orderId } = body;
      if (!items || !Array.isArray(items)) {
        return NextResponse.json({ success: false, error: 'Items array is required' }, { status: 400 });
      }
      const logs = await deductStockForOrder(items, orderId || 'MANUAL');
      return NextResponse.json({ success: true, logs });
    }

    if (action === 'restore') {
      const { productId, quantity, reason, referenceId } = body;
      if (!productId || !quantity) {
        return NextResponse.json({ success: false, error: 'Product ID and quantity required' }, { status: 400 });
      }
      const log = await restoreStock(productId, Number(quantity), reason || 'RETURN_RESTOCKED', referenceId);
      return NextResponse.json({ success: true, log });
    }

    if (action === 'adjust') {
      const { productId, newStock, reason } = body;
      if (!productId || newStock === undefined) {
        return NextResponse.json({ success: false, error: 'Product ID and newStock required' }, { status: 400 });
      }
      const log = await adjustStockManual(productId, Number(newStock), reason || 'Admin Inventory Audit');
      return NextResponse.json({ success: true, log });
    }

    return NextResponse.json({ success: false, error: 'Invalid stock action' }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
