import React, { useEffect, useMemo, useState } from 'react';
import { 
  getCurrentMode, 
  setApiMode, 
  getLicenseKey, 
  setLicenseKey, 
  getLicenseStatus,
  setLicenseStatus,
  API_MODES,
  LICENSE_STATUS,
  getSubscriptionInfo,
  isFeatureAvailable
} from '../../lib/apiMode';
import { api } from '../../lib/api';
import { listPending, flush, getQueueStats, retryFailed, clearAllDone } from '../../lib/offlineQueue';
import NavigationHeader from '../../components/ui/NavigationHeader';
import PrimaryNavigation from '../../components/ui/PrimaryNavigation';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

const SettingsPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState('Administrateur');
  const [mode, setMode] = useState(getCurrentMode());
  const [license, setLic] = useState(getLicenseKey());
  const [licenseStatus, setLicStatus] = useState(getLicenseStatus());
  const [status, setStatus] = useState('');
  const [queueStats, setQueueStats] = useState({ total: 0, pending: 0, done: 0, failed: 0 });
  const [isValidating, setIsValidating] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole') || 'Administrateur';
    setUserRole(savedRole);
    
    setMode(getCurrentMode());
    setLic(getLicenseKey());
    setLicStatus(getLicenseStatus());
    setSubscriptionInfo(getSubscriptionInfo());
    refreshQueueStats();
    
    // Listen for queue updates
    const handleQueueSync = () => refreshQueueStats();
    window.addEventListener('queueSynced', handleQueueSync);
    
    return () => {
      window.removeEventListener('queueSynced', handleQueueSync);
    };
  }, []);

  const refreshQueueStats = async () => {
    try {
      const stats = await getQueueStats();
      setQueueStats(stats);
    } catch (error) {
      console.error('Failed to get queue stats:', error);
    }
  };

  const handleModeChange = (e) => {
    const val = e.target.value;
    setMode(val);
    setApiMode(val);
    setStatus(`Mode changé vers: ${val === API_MODES.ONLINE ? 'Online' : 'Offline'}`);
    setSubscriptionInfo(getSubscriptionInfo());
  };

  const handleLicenseChange = (e) => setLic(e.target.value);

  const validateLicense = async () => {
    if (!license.trim()) {
      setStatus('Veuillez entrer une clé de licence');
      return;
    }
    
    setIsValidating(true);
    setLicStatus(LICENSE_STATUS.CHECKING);
    setLicenseKey(license);
    
    try {
      const response = await api.license.validate(license);
      
      if (response?.valid) {
        setLicStatus(LICENSE_STATUS.VALID);
        setLicenseStatus(LICENSE_STATUS.VALID);
        setApiMode('online');
        setMode('online');
        setStatus('✅ Licence valide. Mode Online activé.');
        setSubscriptionInfo(getSubscriptionInfo());
      } else {
        setLicStatus(LICENSE_STATUS.INVALID);
        setLicenseStatus(LICENSE_STATUS.INVALID);
        setStatus('❌ Licence invalide ou expirée.');
      }
    } catch (e) {
      setLicStatus(LICENSE_STATUS.INVALID);
      setLicenseStatus(LICENSE_STATUS.INVALID);
      setStatus('⚠️ Impossible de vérifier la licence. Vérifiez votre connexion.');
    } finally {
      setIsValidating(false);
    }
  };

  const syncQueue = async () => {
    setIsSyncing(true);
    setStatus('🔄 Synchronisation en cours...');
    
    try {
      const result = await flush();
      await refreshQueueStats();
      
      if (result.successCount > 0) {
        setStatus(`✅ ${result.successCount} opération(s) synchronisée(s).`);
      } else {
        setStatus('ℹ️ Aucune opération en attente.');
      }
      
      if (result.failureCount > 0) {
        setStatus(prev => `${prev} ${result.failureCount} échec(s).`);
      }
    } catch (e) {
      setStatus('❌ Échec de la synchronisation.');
      console.error('Sync failed:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  const retryFailedOperations = async () => {
    try {
      await retryFailed();
      await refreshQueueStats();
      setStatus('🔄 Opérations échouées remises en queue.');
    } catch (error) {
      setStatus('❌ Erreur lors de la remise en queue.');
    }
  };

  const clearQueue = async () => {
    if (confirm('Êtes-vous sûr de vouloir vider la queue ? Cette action est irréversible.')) {
      try {
        await clearAllDone();
        await refreshQueueStats();
        setStatus('🗑️ Queue vidée.');
      } catch (error) {
        setStatus('❌ Erreur lors du vidage de la queue.');
      }
    }
  };

  const getLicenseStatusBadge = () => {
    const statusConfig = {
      [LICENSE_STATUS.VALID]: { color: 'bg-success text-success-foreground', label: 'Valide', icon: 'CheckCircle' },
      [LICENSE_STATUS.INVALID]: { color: 'bg-error text-error-foreground', label: 'Invalide', icon: 'XCircle' },
      [LICENSE_STATUS.EXPIRED]: { color: 'bg-warning text-warning-foreground', label: 'Expirée', icon: 'AlertTriangle' },
      [LICENSE_STATUS.CHECKING]: { color: 'bg-accent text-accent-foreground', label: 'Vérification...', icon: 'Loader2' }
    };
    
    const config = statusConfig[licenseStatus] || statusConfig[LICENSE_STATUS.INVALID];
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon name={config.icon} size={12} className={`mr-1 ${licenseStatus === LICENSE_STATUS.CHECKING ? 'animate-spin' : ''}`} />
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader 
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
        isMenuOpen={isMenuOpen}
        userRole={userRole}
      />
      
      <PrimaryNavigation 
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        userRole={userRole}
      />

      <main className="lg:ml-60 pt-16">
        <BreadcrumbNavigation customBreadcrumbs={[
          { label: 'Accueil', path: '/dashboard', icon: 'Home' },
          { label: 'Paramètres', path: null, icon: 'Settings' }
        ]} />
        
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center">
                <Icon name="Settings" size={28} className="mr-3" />
                Paramètres Système
              </h1>
              <p className="text-muted-foreground mt-1">
                Configuration du mode de fonctionnement et synchronisation
              </p>
            </div>
          </div>

          {/* Subscription & Mode Section */}
          <div className="bg-card rounded-lg border border-border p-6 shadow-industrial-sm">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                <Icon name="CreditCard" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Abonnement & Mode</h2>
                <p className="text-sm text-muted-foreground">Gérez votre mode de fonctionnement et licence</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Mode Selection */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Mode de Fonctionnement
                  </label>
                  <Select
                    options={[
                      { value: API_MODES.OFFLINE, label: '🏠 Mode Offline (Gratuit)' },
                      { value: API_MODES.ONLINE, label: '☁️ Mode Online (Payant)' }
                    ]}
                    value={mode}
                    onChange={handleModeChange}
                  />
                </div>
                
                {/* Current Status */}
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Statut actuel</span>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${mode === API_MODES.ONLINE ? 'bg-success' : 'bg-warning'}`} />
                      <span className="text-sm text-foreground">
                        {mode === API_MODES.ONLINE ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>
                  {mode === API_MODES.ONLINE && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Licence</span>
                      {getLicenseStatusBadge()}
                    </div>
                  )}
                </div>
              </div>

              {/* License Section */}
              {mode === API_MODES.ONLINE && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      Clé de Licence
                    </label>
                    <div className="flex space-x-2">
                      <Input
                        type="text"
                        value={license}
                        onChange={handleLicenseChange}
                        placeholder="LIC-XXXX-XXXX-XXXX-XXXX"
                        className="flex-1"
                      />
                      <Button
                        onClick={validateLicense}
                        loading={isValidating}
                        disabled={!license.trim() || isValidating}
                        iconName="Key"
                        iconPosition="left"
                      >
                        Valider
                      </Button>
                    </div>
                  </div>
                  
                  {/* License Info */}
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-foreground mb-2">Avantages Mode Online</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li className="flex items-center space-x-2">
                        <Icon name="Check" size={14} className="text-success" />
                        <span>Synchronisation cloud automatique</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Icon name="Check" size={14} className="text-success" />
                        <span>Sauvegarde automatique</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Icon name="Check" size={14} className="text-success" />
                        <span>Rapports avancés</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Icon name="Check" size={14} className="text-success" />
                        <span>Notifications email</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Icon name="Check" size={14} className="text-success" />
                        <span>Accès API externe</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Status Message */}
            {status && (
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-foreground">{status}</p>
              </div>
            )}
          </div>

          {/* Subscription Info */}
          {subscriptionInfo && (
            <div className="bg-card rounded-lg border border-border p-6 shadow-industrial-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-accent/10 text-accent rounded-lg">
                  <Icon name="Info" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Informations d'Abonnement</h3>
                  <p className="text-sm text-muted-foreground">Limites et fonctionnalités disponibles</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground">Utilisateurs max</div>
                  <div className="text-lg font-semibold text-foreground">
                    {subscriptionInfo.features.maxUsers}
                  </div>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground">Équipements max</div>
                  <div className="text-lg font-semibold text-foreground">
                    {subscriptionInfo.features.maxEquipments}
                  </div>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground">Sauvegarde cloud</div>
                  <div className="text-lg font-semibold text-foreground">
                    {subscriptionInfo.features.cloudBackup ? '✅' : '❌'}
                  </div>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground">Rapports avancés</div>
                  <div className="text-lg font-semibold text-foreground">
                    {subscriptionInfo.features.advancedReports ? '✅' : '❌'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Offline Queue Management */}
          <div className="bg-card rounded-lg border border-border p-6 shadow-industrial-sm">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-warning/10 text-warning rounded-lg">
                <Icon name="Database" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Synchronisation Offline</h3>
                <p className="text-sm text-muted-foreground">Gestion de la queue des opérations en attente</p>
              </div>
            </div>
            
            {/* Queue Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-muted/30 rounded-lg p-3 text-center">
                <div className="text-lg font-semibold text-foreground">{queueStats.total}</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
              <div className="bg-warning/10 rounded-lg p-3 text-center">
                <div className="text-lg font-semibold text-warning">{queueStats.pending}</div>
                <div className="text-xs text-muted-foreground">En attente</div>
              </div>
              <div className="bg-success/10 rounded-lg p-3 text-center">
                <div className="text-lg font-semibold text-success">{queueStats.done}</div>
                <div className="text-xs text-muted-foreground">Terminées</div>
              </div>
              <div className="bg-error/10 rounded-lg p-3 text-center">
                <div className="text-lg font-semibold text-error">{queueStats.failed}</div>
                <div className="text-xs text-muted-foreground">Échouées</div>
              </div>
            </div>
            
            {/* Queue Actions */}
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={syncQueue}
                loading={isSyncing}
                disabled={isSyncing || queueStats.pending === 0}
                iconName="RefreshCw"
                iconPosition="left"
              >
                Synchroniser maintenant
              </Button>
              
              <Button
                variant="outline"
                onClick={refreshQueueStats}
                iconName="RotateCcw"
                iconPosition="left"
              >
                Actualiser
              </Button>
              
              {queueStats.failed > 0 && (
                <Button
                  variant="warning"
                  onClick={retryFailedOperations}
                  iconName="Repeat"
                  iconPosition="left"
                >
                  Réessayer échecs
                </Button>
              )}
              
              <Button
                variant="destructive"
                onClick={clearQueue}
                iconName="Trash2"
                iconPosition="left"
                disabled={queueStats.total === 0}
              >
                Vider la queue
              </Button>
            </div>
            
            {/* Queue Info */}
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-start space-x-2">
                <Icon name="Info" size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-muted-foreground">
                  <div className="font-medium text-foreground mb-1">À propos de la synchronisation</div>
                  <div>Les opérations effectuées hors ligne sont automatiquement synchronisées dès que la connexion est rétablie. Vous pouvez aussi forcer la synchronisation manuellement.</div>
                </div>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div className="bg-card rounded-lg border border-border p-6 shadow-industrial-sm">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-secondary/10 text-secondary rounded-lg">
                <Icon name="Monitor" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Informations Système</h3>
                <p className="text-sm text-muted-foreground">État et configuration du système</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Version</span>
                  <span className="text-sm font-medium text-foreground">2.1.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Mode actuel</span>
                  <span className="text-sm font-medium text-foreground">
                    {mode === API_MODES.ONLINE ? 'Online' : 'Offline'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Connexion réseau</span>
                  <span className={`text-sm font-medium ${navigator.onLine ? 'text-success' : 'text-error'}`}>
                    {navigator.onLine ? 'Connecté' : 'Déconnecté'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">API locale</span>
                  <span className="text-sm font-medium text-foreground">
                    {import.meta.env.VITE_API_LOCAL || 'http://localhost:4000/api'}
                  </span>
                </div>
                {mode === API_MODES.ONLINE && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">API cloud</span>
                    <span className="text-sm font-medium text-foreground">
                      {import.meta.env.VITE_API_CLOUD || 'Non configurée'}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Service Worker</span>
                  <span className="text-sm font-medium text-success">Actif</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Information */}
          {mode === API_MODES.OFFLINE && (
            <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/20 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-primary/20 text-primary rounded-lg">
                  <Icon name="Zap" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Passer au Mode Online</h3>
                  <p className="text-sm text-muted-foreground">Débloquez toutes les fonctionnalités avancées</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-card rounded-lg p-4 border border-border">
                  <h4 className="font-semibold text-foreground mb-2">Starter</h4>
                  <div className="text-2xl font-bold text-primary mb-2">29€<span className="text-sm text-muted-foreground">/mois</span></div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Jusqu'à 50 équipements</li>
                    <li>• 10 utilisateurs</li>
                    <li>• Sauvegarde cloud</li>
                  </ul>
                </div>
                
                <div className="bg-card rounded-lg p-4 border-2 border-primary">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-foreground">Professional</h4>
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">Populaire</span>
                  </div>
                  <div className="text-2xl font-bold text-primary mb-2">79€<span className="text-sm text-muted-foreground">/mois</span></div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Équipements illimités</li>
                    <li>• Utilisateurs illimités</li>
                    <li>• Rapports avancés</li>
                    <li>• Support prioritaire</li>
                  </ul>
                </div>
                
                <div className="bg-card rounded-lg p-4 border border-border">
                  <h4 className="font-semibold text-foreground mb-2">Enterprise</h4>
                  <div className="text-2xl font-bold text-primary mb-2">Sur mesure</div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Configuration personnalisée</li>
                    <li>• Intégrations sur mesure</li>
                    <li>• Support dédié</li>
                  </ul>
                </div>
              </div>
              
              <div className="text-center">
                <Button
                  size="lg"
                  iconName="CreditCard"
                  iconPosition="left"
                  onClick={() => window.open('https://equiptracker.fr/pricing', '_blank')}
                >
                  Choisir un Abonnement
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;