// src/lib/offlineQueue.js
// Enhanced offline queue built on IndexedDB (idb).
// Queues write operations when offline and flushes when back online.
import { openDB } from 'idb';

const DB_NAME = 'app-offline-queue';
const STORE = 'requests';
const VERSION = 1;

export const OPERATION_TYPES = {
  CREATE_EQUIPMENT: 'create_equipment',
  UPDATE_EQUIPMENT: 'update_equipment',
  DELETE_EQUIPMENT: 'delete_equipment',
  CHECKOUT: 'checkout',
  RETURN: 'return',
  CREATE_MAINTENANCE: 'create_maintenance',
  UPDATE_MAINTENANCE: 'update_maintenance',
  CREATE_USER: 'create_user',
  UPDATE_USER: 'update_user'
};

async function getDB() {
  return openDB(DB_NAME, VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
        store.createIndex('by-status', 'status');
        store.createIndex('by-type', 'operationType');
        store.createIndex('by-created', 'createdAt');
      }
    }
  });
}

/**
 * Add an operation to the queue
 * @param {string} operationType - Type of operation (from OPERATION_TYPES)
 * @param {Object} data - Data to be sent
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method (default: POST)
 */
export async function addToQueue(operationType, data, endpoint, method = 'POST') {
  const db = await getDB();
  const item = {
    operationType,
    data,
    endpoint,
    method,
    status: 'pending',
    createdAt: Date.now(),
    retryCount: 0,
    maxRetries: 3
  };
  await db.add(STORE, item);
  return item;
}

/**
 * Get all pending operations
 */
export async function listPending() {
  const db = await getDB();
  const tx = db.transaction(STORE, 'readonly');
  const store = tx.objectStore(STORE);
  const idx = store.index('by-status');
  const items = await idx.getAll('pending');
  await tx.done;
  return items;
}

/**
 * Get operations by type
 */
export async function getOperationsByType(operationType) {
  const db = await getDB();
  const tx = db.transaction(STORE, 'readonly');
  const store = tx.objectStore(STORE);
  const idx = store.index('by-type');
  const items = await idx.getAll(operationType);
  await tx.done;
  return items.filter(item => item.status === 'pending');
}

/**
 * Mark operation as completed
 */
export async function markDone(id) {
  const db = await getDB();
  const tx = db.transaction(STORE, 'readwrite');
  const store = tx.objectStore(STORE);
  const item = await store.get(id);
  if (item) {
    item.status = 'done';
    item.doneAt = Date.now();
    await store.put(item);
  }
  await tx.done;
}

/**
 * Mark operation as failed
 */
export async function markFailed(id, error) {
  const db = await getDB();
  const tx = db.transaction(STORE, 'readwrite');
  const store = tx.objectStore(STORE);
  const item = await store.get(id);
  if (item) {
    item.status = 'failed';
    item.error = error;
    item.failedAt = Date.now();
    item.retryCount = (item.retryCount || 0) + 1;
    await store.put(item);
  }
  await tx.done;
}

/**
 * Retry failed operations
 */
export async function retryFailed() {
  const db = await getDB();
  const tx = db.transaction(STORE, 'readwrite');
  const store = tx.objectStore(STORE);
  let cursor = await store.openCursor();
  
  while (cursor) {
    const item = cursor.value;
    if (item.status === 'failed' && item.retryCount < item.maxRetries) {
      item.status = 'pending';
      await cursor.update(item);
    }
    cursor = await cursor.continue();
  }
  await tx.done;
}

/**
 * Clear all completed operations
 */
export async function clearAllDone() {
  const db = await getDB();
  const tx = db.transaction(STORE, 'readwrite');
  const store = tx.objectStore(STORE);
  let cursor = await store.openCursor();
  while (cursor) {
    const v = cursor.value;
    if (v.status === 'done' || (v.status === 'failed' && v.retryCount >= v.maxRetries)) {
      await cursor.delete();
    }
    cursor = await cursor.continue();
  }
  await tx.done;
}

/**
 * Get queue statistics
 */
export async function getQueueStats() {
  const db = await getDB();
  const tx = db.transaction(STORE, 'readonly');
  const store = tx.objectStore(STORE);
  const all = await store.getAll();
  await tx.done;
  
  const stats = {
    total: all.length,
    pending: all.filter(item => item.status === 'pending').length,
    done: all.filter(item => item.status === 'done').length,
    failed: all.filter(item => item.status === 'failed').length
  };
  
  return stats;
}

/**
 * Flush the queue by sending all pending operations
 */
export async function flush() {
  const pending = await listPending();
  let successCount = 0;
  let failureCount = 0;
  
  for (const item of pending) {
    try {
      const response = await fetch(item.endpoint, {
        method: item.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item.data)
      });
      
      if (response.ok) {
        await markDone(item.id);
        successCount++;
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      await markDone(item.id);
    } catch (e) {
      await markFailed(item.id, e.message);
      failureCount++;
      
      // Stop flushing on network errors to avoid hammering
      if (e.name === 'TypeError' || e.message.includes('fetch')) {
        break;
      }
    }
  }
  
  // Cleanup completed operations
  await clearAllDone();
  
  return { successCount, failureCount };
}

/**
 * Hook online/offline events to auto-flush
 */
export function attachAutoFlush() {
  if (typeof window === 'undefined') return;
  
  const tryFlush = async () => {
    try {
      const result = await flush();
      if (result.successCount > 0) {
        console.log(`✅ Synchronized ${result.successCount} operations`);
        // Dispatch event for UI updates
        window.dispatchEvent(new CustomEvent('queueSynced', { detail: result }));
      }
    } catch (error) {
      console.error('Queue flush failed:', error);
    }
  };
  
  window.addEventListener('online', tryFlush);
  
  // Periodic flush every 30 seconds when online
  const interval = setInterval(tryFlush, 30_000);
  
  return () => {
    window.removeEventListener('online', tryFlush);
    clearInterval(interval);
  };
}

export default {
  addToQueue,
  flush,
  attachAutoFlush,
  listPending,
  getOperationsByType,
  getQueueStats,
  retryFailed,
  clearAllDone,
  OPERATION_TYPES
};