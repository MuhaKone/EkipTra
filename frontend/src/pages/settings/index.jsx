import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Wifi, 
  WifiOff, 
  Key, 
  Server, 
  Cloud, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Database,
  CreditCard,
} from 'lucide-react';
import {
  API_MODES,
  LICENSE_STATUS,
  loadApiConfig,
  setApiMode,
  setLicenseKey,
  validateLicense,
  getApiStatus,
  onApiModeChange,
} from '@/lib/apiMode';
import { getQueueStats, clearQueue } from '@/lib/offlineQueue';

const SettingsPage = () => {
  const [config, setConfig] = useState(loadApiConfig());
  const [apiStatus, setApiStatus] = useState(null);
  const [queueStats, setQueueStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [licenseInput, setLicenseInput] = useState('');
  const [validationResult, setValidationResult] = useState(null);

  useEffect(() => {
    loadStatus();
    
    // Écouter les changements de mode
    const unsubscribe = onApiModeChange((details) => {
      setConfig(loadApiConfig());
      loadStatus();
    });
    
    return unsubscribe;
  }, []);

  const loadStatus = async () => {
    try {
      const [status, queue] = await Promise.all([
        getApiStatus(),
        getQueueStats(),
      ]);
      setApiStatus(status);
      setQueueStats(queue);
    } catch (error) {
      console.error('Erreur chargement statut:', error);
    }
  };

  const handleModeChange = async (newMode) => {
    setLoading(true);
    try {
      await setApiMode(newMode);
      setConfig(loadApiConfig());
      await loadStatus();
    } catch (error) {
      console.error('Erreur changement mode:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleValidateLicense = async () => {
    if (!licenseInput.trim()) return;
    
    setLoading(true);
    setValidationResult(null);
    
    try {
      const result = await validateLicense(licenseInput.trim());
      setValidationResult(result);
      setConfig(result.config);
      
      if (result.valid) {
        setLicenseInput('');
        await loadStatus();
      }
    } catch (error) {
      setValidationResult({
        valid: false,
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearQueue = async () => {
    if (confirm('Êtes-vous sûr de vouloir vider la queue offline ? Les opérations non synchronisées seront perdues.')) {
      await clearQueue();
      await loadStatus();
    }
  };

  const getLicenseStatusBadge = (status) => {
    switch (status) {
      case LICENSE_STATUS.VALID:
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Valide</Badge>;
      case LICENSE_STATUS.INVALID:
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Invalide</Badge>;
      case LICENSE_STATUS.EXPIRED:
        return <Badge className="bg-orange-100 text-orange-800"><AlertTriangle className="w-3 h-3 mr-1" />Expirée</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Non configurée</Badge>;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6" />
        <h1 className="text-2xl font-bold">Paramètres EkipTra</h1>
      </div>

      <Tabs defaultValue="mode" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="mode">Mode & Abonnement</TabsTrigger>
          <TabsTrigger value="offline">Données Offline</TabsTrigger>
          <TabsTrigger value="advanced">Avancé</TabsTrigger>
        </TabsList>

        {/* Onglet Mode & Abonnement */}
        <TabsContent value="mode" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Server className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Mode de Fonctionnement</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-blue-600" />
                  <div>
                    <h3 className="font-medium">Mode Offline (Gratuit)</h3>
                    <p className="text-sm text-gray-600">Données stockées localement uniquement</p>
                  </div>
                </div>
                <Switch
                  checked={config.mode === API_MODES.OFFLINE}
                  onCheckedChange={() => handleModeChange(API_MODES.OFFLINE)}
                  disabled={loading}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Cloud className="w-5 h-5 text-purple-600" />
                  <div>
                    <h3 className="font-medium">Mode Online (Payant)</h3>
                    <p className="text-sm text-gray-600">Synchronisation cloud + sauvegarde</p>
                  </div>
                </div>
                <Switch
                  checked={config.mode === API_MODES.ONLINE}
                  onCheckedChange={() => handleModeChange(API_MODES.ONLINE)}
                  disabled={loading || config.licenseStatus !== LICENSE_STATUS.VALID}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Key className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Licence & Abonnement</h2>
              {getLicenseStatusBadge(config.licenseStatus)}
            </div>

            {config.licenseStatus === LICENSE_STATUS.NOT_SET && (
              <Alert className="mb-4">
                <CreditCard className="h-4 w-4" />
                <AlertDescription>
                  Pour utiliser le mode Online, vous devez saisir une clé de licence valide.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Clé de licence (ex: EKT-XXXX-XXXX-XXXX)"
                  value={licenseInput}
                  onChange={(e) => setLicenseInput(e.target.value)}
                  className="font-mono"
                />
                <Button 
                  onClick={handleValidateLicense}
                  disabled={loading || !licenseInput.trim()}
                  className="shrink-0"
                >
                  {loading ? 'Validation...' : 'Valider'}
                </Button>
              </div>

              {validationResult && (
                <Alert className={validationResult.valid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                  {validationResult.valid ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription>
                    {validationResult.valid 
                      ? 'Licence validée avec succès ! Vous pouvez maintenant utiliser le mode Online.'
                      : `Erreur: ${validationResult.error || 'Licence invalide'}`
                    }
                  </AlertDescription>
                </Alert>
              )}

              {config.licenseKey && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <Label className="text-sm font-medium">Licence actuelle</Label>
                  <p className="font-mono text-sm mt-1">
                    {config.licenseKey.replace(/(.{4})/g, '$1-').slice(0, -1)}
                  </p>
                  {config.lastValidation && (
                    <p className="text-xs text-gray-600 mt-1">
                      Dernière validation: {new Date(config.lastValidation).toLocaleString('fr-FR')}
                    </p>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Statut de connectivité */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Wifi className="w-5 h-5" />
              <h2 className="text-lg font-semibold">État de la Connectivité</h2>
            </div>
            
            {apiStatus && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  {apiStatus.connectivity.online ? (
                    <Wifi className="w-4 h-4 text-green-600" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-red-600" />
                  )}
                  <span className="text-sm">
                    {apiStatus.connectivity.online ? 'En ligne' : 'Hors ligne'}
                  </span>
                </div>

                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  {apiStatus.connectivity.localApiAvailable ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                  <span className="text-sm">API Locale</span>
                </div>

                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  {apiStatus.connectivity.cloudApiAvailable ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                  <span className="text-sm">API Cloud</span>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Onglet Données Offline */}
        <TabsContent value="offline" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Queue de Synchronisation</h2>
            </div>

            {queueStats && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{queueStats.total}</div>
                    <div className="text-sm text-blue-800">Total</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{queueStats.pending}</div>
                    <div className="text-sm text-yellow-800">En attente</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{queueStats.syncing}</div>
                    <div className="text-sm text-purple-800">En cours</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{queueStats.completed}</div>
                    <div className="text-sm text-green-800">Terminées</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{queueStats.failed}</div>
                    <div className="text-sm text-red-800">Échouées</div>
                  </div>
                </div>

                {queueStats.pending > 0 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      {queueStats.pending} opération(s) en attente de synchronisation. 
                      Elles seront traitées dès que la connexion sera rétablie.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={loadStatus}
                    disabled={loading}
                  >
                    Actualiser
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleClearQueue}
                    disabled={loading || queueStats.total === 0}
                  >
                    Vider la queue
                  </Button>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Settings className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Stockage Local</h2>
            </div>

            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  En mode offline, toutes vos données sont stockées localement dans le navigateur. 
                  Assurez-vous de ne pas vider le cache du navigateur pour éviter la perte de données.
                </AlertDescription>
              </Alert>

              <div className="text-sm text-gray-600">
                <p><strong>IndexedDB:</strong> Utilisé pour la queue de synchronisation</p>
                <p><strong>LocalStorage:</strong> Configuration et paramètres utilisateur</p>
                <p><strong>Cache API:</strong> Ressources de l'application pour le mode offline</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Onglet Avancé */}
        <TabsContent value="advanced" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Server className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Configuration API</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">API Locale</Label>
                <Input 
                  value={config.apiEndpoints.local} 
                  readOnly 
                  className="mt-1 bg-gray-50 font-mono text-sm"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">API Cloud</Label>
                <Input 
                  value={config.apiEndpoints.cloud} 
                  readOnly 
                  className="mt-1 bg-gray-50 font-mono text-sm"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">API Actuelle</Label>
                <Input 
                  value={apiStatus?.currentApiUrl || 'Chargement...'} 
                  readOnly 
                  className="mt-1 bg-blue-50 font-mono text-sm font-semibold"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <h2 className="text-lg font-semibold">Actions de Maintenance</h2>
            </div>

            <div className="space-y-3">
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Recharger l'Application
              </Button>

              <Button 
                variant="outline" 
                onClick={() => {
                  if (confirm('Réinitialiser tous les paramètres ? Cette action est irréversible.')) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                className="w-full text-red-600 hover:text-red-700"
              >
                Réinitialiser les Paramètres
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;