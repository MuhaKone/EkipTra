import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const SystemStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSync, setLastSync] = useState(new Date());

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Update last sync time every minute when online
    const syncInterval = setInterval(() => {
      if (isOnline) {
        setLastSync(new Date());
      }
    }, 60000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(syncInterval);
    };
  }, [isOnline]);

  const formatTime = (date) => {
    return date?.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex items-center justify-center space-x-4 p-4 bg-muted/30 rounded-lg border border-border">
      {/* Connection Status */}
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-success pulse-status' : 'bg-warning'}`} />
        <span className="text-sm font-medium text-foreground">
          {isOnline ? 'En ligne' : 'Hors ligne'}
        </span>
      </div>

      {/* Separator */}
      <div className="w-px h-4 bg-border" />

      {/* System Status */}
      <div className="flex items-center space-x-2">
        <Icon 
          name="Server" 
          size={16} 
          className={isOnline ? 'text-success' : 'text-muted-foreground'} 
        />
        <span className="text-sm text-muted-foreground">
          Système actif
        </span>
      </div>

      {/* Last Sync */}
      {isOnline && (
        <>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center space-x-2">
            <Icon name="RefreshCw" size={16} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Dernière sync: {formatTime(lastSync)}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default SystemStatus;