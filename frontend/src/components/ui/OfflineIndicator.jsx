import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import { getCurrentMode, API_MODES } from '../../lib/apiMode';
import { getQueueStats, flush } from '../../lib/offlineQueue';

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queueStats, setQueueStats] = useState({ pending: 0, failed: 0 });
  const [isSyncing, setIsSyncing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Update queue stats
    const updateStats = async () => {
      try {
        const stats = await getQueueStats();
        setQueueStats(stats);
      } catch (error) {
        console.error('Failed to get queue stats:', error);
      }
    };
    
    updateStats();
    const interval = setInterval(updateStats, 10000); // Update every 10 seconds
    
    // Listen for queue sync events
    const handleQueueSync = () => updateStats();
    window.addEventListener('queueSynced', handleQueueSync);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('queueSynced', handleQueueSync);
      clearInterval(interval);
    };
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await flush();
      const stats = await getQueueStats();
      setQueueStats(stats);
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const currentMode = getCurrentMode();
  const hasPendingOperations = queueStats.pending > 0 || queueStats.failed > 0;

  // Don't show if online and no pending operations
  if (isOnline && !hasPendingOperations && currentMode === API_MODES.ONLINE) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-1000">
      <div className="bg-card border border-border rounded-lg shadow-industrial-lg p-4 max-w-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-success' : 'bg-error'}`} />
            <span className="text-sm font-medium text-foreground">
              {isOnline ? 'En ligne' : 'Hors ligne'}
            </span>
            {currentMode === API_MODES.OFFLINE && (
              <span className="text-xs bg-warning/20 text-warning px-2 py-1 rounded-full">
                Mode Offline
              </span>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowDetails(!showDetails)}
            className="h-6 w-6"
          >
            <Icon name={showDetails ? "ChevronDown" : "ChevronUp"} size={14} />
          </Button>
        </div>

        {hasPendingOperations && (
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-muted-foreground">
              {queueStats.pending} en attente, {queueStats.failed} échecs
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSync}
              loading={isSyncing}
              disabled={!isOnline || isSyncing}
              iconName="RefreshCw"
              iconPosition="left"
            >
              Sync
            </Button>
          </div>
        )}

        {showDetails && (
          <div className="space-y-2 pt-2 border-t border-border">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-muted/50 p-2 rounded">
                <div className="font-medium text-foreground">En attente</div>
                <div className="text-warning">{queueStats.pending}</div>
              </div>
              <div className="bg-muted/50 p-2 rounded">
                <div className="font-medium text-foreground">Échecs</div>
                <div className="text-error">{queueStats.failed}</div>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground">
              Les opérations seront synchronisées automatiquement dès la reconnexion.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfflineIndicator;