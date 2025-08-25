import { openDB } from 'idb';

const DB_NAME = 'EkipTraOfflineQueue';
const DB_VERSION = 1;
const STORE_NAME = 'pendingOperations';

// Initialiser la base IndexedDB
export const initOfflineQueue = async () => {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const store = db.createObjectStore(STORE_NAME, {
        keyPath: 'id',
        autoIncrement: true,
      });
      store.createIndex('timestamp', 'timestamp');
      store.createIndex('type', 'type');
      store.createIndex('status', 'status');
    },
  });
  return db;
};

// Types d'opérations
export const OPERATION_TYPES = {
  CHECKOUT: 'checkout',
  RETURN: 'return',
  CREATE_EQUIPMENT: 'create_equipment',
  UPDATE_EQUIPMENT: 'update_equipment',
  DELETE_EQUIPMENT: 'delete_equipment',
  CREATE_MAINTENANCE: 'create_maintenance',
  UPDATE_MAINTENANCE: 'update_maintenance',
};

// Statuts des opérations
export const OPERATION_STATUS = {
  PENDING: 'pending',
  SYNCING: 'syncing',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

// Ajouter une opération à la queue
export const addToQueue = async (type, data, endpoint) => {
  const db = await initOfflineQueue();
  
  const operation = {
    type,
    data,
    endpoint,
    timestamp: Date.now(),
    status: OPERATION_STATUS.PENDING,
    attempts: 0,
    lastAttempt: null,
    error: null,
  };
  
  await db.add(STORE_NAME, operation);
  console.log('🔄 Opération ajoutée à la queue offline:', type, data);
  
  // Tenter la synchronisation immédiatement si en ligne
  if (navigator.onLine) {
    processQueue();
  }
};

// Récupérer toutes les opérations en attente
export const getPendingOperations = async () => {
  const db = await initOfflineQueue();
  return db.getAllFromIndex(STORE_NAME, 'status', OPERATION_STATUS.PENDING);
};

// Traiter la queue (synchroniser avec le serveur)
export const processQueue = async () => {
  if (!navigator.onLine) {
    console.log('📴 Hors ligne - queue en attente');
    return;
  }
  
  const db = await initOfflineQueue();
  const pendingOps = await getPendingOperations();
  
  if (pendingOps.length === 0) {
    console.log('✅ Queue vide - rien à synchroniser');
    return;
  }
  
  console.log(`🔄 Synchronisation de ${pendingOps.length} opération(s)...`);
  
  for (const operation of pendingOps) {
    try {
      // Marquer comme en cours de synchronisation
      await updateOperationStatus(operation.id, OPERATION_STATUS.SYNCING);
      
      // Effectuer la requête API
      const response = await fetch(operation.endpoint, {
        method: getMethodForOperationType(operation.type),
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(operation.data),
      });
      
      if (response.ok) {
        // Succès - marquer comme complété
        await updateOperationStatus(operation.id, OPERATION_STATUS.COMPLETED);
        console.log('✅ Opération synchronisée:', operation.type);
        
        // Supprimer de la queue après 24h (nettoyage)
        setTimeout(() => {
          deleteOperation(operation.id);
        }, 24 * 60 * 60 * 1000);
        
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
    } catch (error) {
      console.error('❌ Erreur sync:', error);
      
      // Incrémenter les tentatives
      const attempts = operation.attempts + 1;
      
      if (attempts >= 3) {
        // Échec définitif après 3 tentatives
        await updateOperationStatus(operation.id, OPERATION_STATUS.FAILED, error.message);
      } else {
        // Remettre en pending pour une nouvelle tentative
        await db.put(STORE_NAME, {
          ...operation,
          attempts,
          lastAttempt: Date.now(),
          status: OPERATION_STATUS.PENDING,
          error: error.message,
        });
      }
    }
  }
};

// Mettre à jour le statut d'une opération
const updateOperationStatus = async (id, status, error = null) => {
  const db = await initOfflineQueue();
  const operation = await db.get(STORE_NAME, id);
  
  if (operation) {
    operation.status = status;
    operation.lastAttempt = Date.now();
    if (error) operation.error = error;
    
    await db.put(STORE_NAME, operation);
  }
};

// Supprimer une opération
const deleteOperation = async (id) => {
  const db = await initOfflineQueue();
  await db.delete(STORE_NAME, id);
};

// Déterminer la méthode HTTP selon le type d'opération
const getMethodForOperationType = (type) => {
  switch (type) {
    case OPERATION_TYPES.CREATE_EQUIPMENT:
    case OPERATION_TYPES.CREATE_MAINTENANCE:
    case OPERATION_TYPES.CHECKOUT:
    case OPERATION_TYPES.RETURN:
      return 'POST';
    case OPERATION_TYPES.UPDATE_EQUIPMENT:
    case OPERATION_TYPES.UPDATE_MAINTENANCE:
      return 'PUT';
    case OPERATION_TYPES.DELETE_EQUIPMENT:
      return 'DELETE';
    default:
      return 'POST';
  }
};

// Statistiques de la queue
export const getQueueStats = async () => {
  const db = await initOfflineQueue();
  const all = await db.getAll(STORE_NAME);
  
  const stats = {
    total: all.length,
    pending: all.filter(op => op.status === OPERATION_STATUS.PENDING).length,
    syncing: all.filter(op => op.status === OPERATION_STATUS.SYNCING).length,
    completed: all.filter(op => op.status === OPERATION_STATUS.COMPLETED).length,
    failed: all.filter(op => op.status === OPERATION_STATUS.FAILED).length,
  };
  
  return stats;
};

// Vider la queue (nettoyage manuel)
export const clearQueue = async () => {
  const db = await initOfflineQueue();
  await db.clear(STORE_NAME);
  console.log('🗑️ Queue offline vidée');
};

// Écouter les changements de connectivité
export const setupConnectivityListener = () => {
  const handleOnline = () => {
    console.log('🌐 Connexion rétablie - traitement de la queue');
    processQueue();
  };
  
  const handleOffline = () => {
    console.log('📴 Connexion perdue - mode offline activé');
  };
  
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  // Nettoyer les listeners
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};