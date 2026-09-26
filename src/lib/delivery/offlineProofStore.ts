'use client';

export interface QueuedDeliveryProof {
  id: string;
  assignmentId: string;
  orderId: string;
  type: 'PHOTO' | 'SIGNATURE' | 'OTP' | 'COMBINATION';
  photoUrl?: string;
  signatureUrl?: string;
  recipientName: string;
  deliveryOtp?: string;
  latitude?: number;
  longitude?: number;
  createdAt: number;
  status: 'PENDING_SYNC' | 'SYNCING' | 'FAILED';
  retryCount: number;
}

const DB_NAME = 'selbar_delivery_offline_db';
const DB_VERSION = 1;
const STORE_NAME = 'queued_proofs';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export class OfflineProofStore {
  /**
   * Enqueue a proof submission locally in IndexedDB
   */
  public static async enqueueProof(proof: Omit<QueuedDeliveryProof, 'id' | 'createdAt' | 'status' | 'retryCount'>): Promise<QueuedDeliveryProof> {
    const db = await openDB();
    const item: QueuedDeliveryProof = {
      ...proof,
      id: `proof_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      createdAt: Date.now(),
      status: 'PENDING_SYNC',
      retryCount: 0,
    };

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.add(item);
      req.onsuccess = () => {
        // Register BackgroundSync tag if browser supports it
        this.requestBackgroundSync();
        resolve(item);
      };
      req.onerror = () => reject(req.error);
    });
  }

  /**
   * Get all queued pending proofs
   */
  public static async getPendingProofs(): Promise<QueuedDeliveryProof[]> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return [];
    }
  }

  /**
   * Remove a completed proof from IndexedDB
   */
  public static async removeProof(id: string): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  /**
   * Request native Background Sync from ServiceWorker
   */
  public static async requestBackgroundSync() {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'SyncManager' in window) {
      try {
        const reg = await navigator.serviceWorker.ready;
        await (reg as any).sync.register('sync-delivery-proofs');
      } catch (err) {
        console.warn('[OfflineProofStore] BackgroundSync registration skipped:', err);
      }
    }
  }

  /**
   * Replay and flush all queued proofs to the backend API
   */
  public static async syncAllPendingProofs(authToken?: string): Promise<{
    synced: number;
    failed: number;
  }> {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return { synced: 0, failed: 0 };
    }

    const pending = await this.getPendingProofs();
    let synced = 0;
    let failed = 0;

    for (const item of pending) {
      try {
        const response = await fetch(`/api/v1/delivery/assignments/${item.assignmentId}/proof`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          },
          body: JSON.stringify({
            orderId: item.orderId,
            type: item.type,
            photoUrl: item.photoUrl,
            signatureUrl: item.signatureUrl,
            recipientName: item.recipientName,
            deliveryOtp: item.deliveryOtp,
            latitude: item.latitude,
            longitude: item.longitude,
          }),
        });

        const data = await response.json();
        if (data.success) {
          await this.removeProof(item.id);
          synced++;
        } else {
          failed++;
        }
      } catch {
        failed++;
      }
    }

    return { synced, failed };
  }
}
