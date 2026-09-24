import { getAllProducts, getProductById, updateProduct } from '@/lib/db/productsStore';

export interface StockAuditLog {
  id: string;
  productId: string;
  productName: string;
  previousStock: number;
  newStock: number;
  delta: number;
  action: 'ORDER_RESERVED' | 'ORDER_CANCELLED' | 'RETURN_RESTOCKED' | 'ADMIN_RESTOCK' | 'MANUAL_ADJUSTMENT';
  referenceId?: string; // Order ID or Admin Note
  timestamp: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __SELBAR_STOCK_LOGS__: StockAuditLog[] | undefined;
}

if (!global.__SELBAR_STOCK_LOGS__) {
  global.__SELBAR_STOCK_LOGS__ = [];
}

export async function getInventorySummary() {
  const products = await getAllProducts();

  let totalSkus = products.length;
  let totalUnits = 0;
  let totalValuation = 0;
  const lowStockItems: any[] = [];
  const outOfStockItems: any[] = [];

  for (const p of products) {
    const stock = Number(p.stock) || 0;
    const price = Number(p.price) || 0;
    totalUnits += stock;
    totalValuation += stock * price;

    if (stock === 0) {
      outOfStockItems.push({
        id: p.id || p._id,
        name: p.name,
        brand: p.brand,
        category: p.category,
        stock: 0,
        price,
      });
    } else if (stock <= 3) {
      lowStockItems.push({
        id: p.id || p._id,
        name: p.name,
        brand: p.brand,
        category: p.category,
        stock,
        price,
      });
    }
  }

  return {
    totalSkus,
    totalUnits,
    totalValuation,
    lowStockCount: lowStockItems.length,
    outOfStockCount: outOfStockItems.length,
    lowStockItems,
    outOfStockItems,
  };
}

export async function deductStockForOrder(items: Array<{ productId?: string; id?: string; quantity?: number; title?: string }>, orderId: string) {
  const logs: StockAuditLog[] = [];

  for (const item of items) {
    const prodId = item.productId || item.id;
    if (!prodId) continue;

    const prod = await getProductById(prodId);
    if (!prod) continue;

    const qty = Number(item.quantity) || 1;
    const currentStock = Number(prod.stock) || 0;
    const newStock = Math.max(0, currentStock - qty);

    await updateProduct(prodId, { stock: newStock });

    const log: StockAuditLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      productId: prodId,
      productName: prod.name,
      previousStock: currentStock,
      newStock,
      delta: -qty,
      action: 'ORDER_RESERVED',
      referenceId: orderId,
      timestamp: new Date().toISOString(),
    };

    global.__SELBAR_STOCK_LOGS__!.unshift(log);
    logs.push(log);
  }

  return logs;
}

export async function restoreStock(productId: string, quantity: number, action: 'ORDER_CANCELLED' | 'RETURN_RESTOCKED', referenceId?: string) {
  const prod = await getProductById(productId);
  if (!prod) return null;

  const currentStock = Number(prod.stock) || 0;
  const newStock = currentStock + quantity;

  await updateProduct(productId, { stock: newStock });

  const log: StockAuditLog = {
    id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    productId,
    productName: prod.name,
    previousStock: currentStock,
    newStock,
    delta: quantity,
    action,
    referenceId,
    timestamp: new Date().toISOString(),
  };

  global.__SELBAR_STOCK_LOGS__!.unshift(log);
  return log;
}

export async function adjustStockManual(productId: string, newStockAmount: number, reason: string) {
  const prod = await getProductById(productId);
  if (!prod) return null;

  const currentStock = Number(prod.stock) || 0;
  const delta = newStockAmount - currentStock;

  await updateProduct(productId, { stock: newStockAmount });

  const log: StockAuditLog = {
    id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    productId,
    productName: prod.name,
    previousStock: currentStock,
    newStock: newStockAmount,
    delta,
    action: 'ADMIN_RESTOCK',
    referenceId: reason,
    timestamp: new Date().toISOString(),
  };

  global.__SELBAR_STOCK_LOGS__!.unshift(log);
  return log;
}

export function getStockAuditLogs(limit = 50): StockAuditLog[] {
  return (global.__SELBAR_STOCK_LOGS__ || []).slice(0, limit);
}
