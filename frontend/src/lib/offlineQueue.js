// src/lib/offlineQueue.js
// Simple offline queue built on IndexedDB (idb).
// Queues write operations when offline and flushes when back online.
import { openDB } from 'idb';

const DB_NAME = 'app-offline-queue';
const STORE = 'requests';
const VERSION = 1;

async function getDB() {
  return openDB(DB_NAME, VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
        store.createIndex('by-status', 'status');
      }
    }
  });
}

/**
 * Enqueue a request to be sent later.
 * @param {Object} req { url, method, body, headers }
 */
export async function enqueue(req) {
  const db = await getDB();
  const item = {
    ...req,
    status: 'pending',
    createdAt: Date.now(),
  };
  await db.add(STORE, item);
  return item;
}

export async function listPending() {
  const db = await getDB();
  const tx = db.transaction(STORE, 'readonly');
  const store = tx.objectStore(STORE);
  const idx = store.index('by-status');
  const items = await idx.getAll('pending');
  await tx.done;
  return items;
}

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

export async function clearAllDone() {
  const db = await getDB();
  const tx = db.transaction(STORE, 'readwrite');
  const store = tx.objectStore(STORE);
  let cursor = await store.openCursor();
  while (cursor) {
    const v = cursor.value;
    if (v.status === 'done') {
      await cursor.delete();
    }
    cursor = await cursor.continue();
  }
  await tx.done;
}

/**
 * Flush the queue using the provided send function.
 * The send function should be: (req) => Promise<Response>
 */
export async function flush(sendFn) {
  const pending = await listPending();
  for (const item of pending) {
    try {
      await sendFn(item);
      await markDone(item.id);
    } catch (e) {
      // Stop flushing on first network error to avoid hammering
      break;
    }
  }
  // Best-effort cleanup
  clearAllDone().catch(() => {});
}

/**
 * Hook online/offline events to auto-flush
 */
export function attachAutoFlush(sendFn) {
  if (typeof window === 'undefined') return;
  const tryFlush = () => flush(sendFn);
  window.addEventListener('online', tryFlush);
  // optional periodic flush
  const interval = setInterval(tryFlush, 30_000);
  return () => {
    window.removeEventListener('online', tryFlush);
    clearInterval(interval);
  };
}

export default {
  enqueue,
  flush,
  attachAutoFlush,
  listPending,
  clearAllDone,
};