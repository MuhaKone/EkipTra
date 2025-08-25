import React, { useEffect, useMemo, useState } from 'react';
import { getApiMode, setApiMode, getLicenseKey, setLicenseKey } from '../../lib/apiMode';
import { api } from '../../lib/api';
import { listPending, flush } from '../../lib/offlineQueue';

const SettingsPage = () => {
  const [mode, setMode] = useState(getApiMode());
  const [license, setLic] = useState(getLicenseKey());
  const [status, setStatus] = useState('');
  const [pending, setPending] = useState([]);

  useEffect(() => {
    setMode(getApiMode());
    setLic(getLicenseKey());
    refreshPending();
  }, []);

  const refreshPending = async () => {
    const items = await listPending();
    setPending(items);
  };

  const handleModeChange = (e) => {
    const val = e.target.value;
    setMode(val);
    setApiMode(val);
    setStatus(`Mode API: ${val.toUpperCase()}`);
  };

  const handleLicenseChange = (e) => setLic(e.target.value);

  const verify = async () => {
    setLicenseKey(license);
    try {
      const { data } = await api.license.validate(license);
      if (data?.valid) {
        setStatus('Licence valide. Mode Online activé.');
        setApiMode('online');
        setMode('online');
      } else {
        setStatus('Licence invalide ou expirée.');
      }
    } catch (e) {
      setStatus('Impossible de vérifier la licence (réseau hors ligne ?).');
    }
  };

  const doFlush = async () => {
    setStatus('Synchronisation en cours...');
    try {
      await flush(async (item) => {
        // api flush is wired in api.js via attachAutoFlush, but we allow manual too
        const base = ''; // ignored by flush version
      });
      await refreshPending();
      setStatus('Synchronisation terminée.');
    } catch (e) {
      setStatus('Échec de la synchronisation.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Paramètres</h1>

      <div className="border rounded-2xl p-4 mb-6">
        <h2 className="font-medium mb-2">Abonnement & Mode</h2>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2">
            <span className="w-40">Mode</span>
            <select
              value={mode}
              onChange={handleModeChange}
              className="border rounded-xl px-3 py-2"
            >
              <option value="offline">Offline (gratuit)</option>
              <option value="online">Online (payant)</option>
            </select>
          </label>

          {mode === 'online' && (
            <div className="flex items-center gap-2">
              <span className="w-40">Clé licence</span>
              <input
                type="text"
                value={license}
                onChange={handleLicenseChange}
                className="border rounded-xl px-3 py-2 w-full"
                placeholder="LIC-XXXX-XXXX-XXXX"
              />
              <button
                type="button"
                onClick={verify}
                className="px-3 py-2 rounded-xl bg-blue-600 text-white"
              >
                Vérifier & Activer
              </button>
            </div>
          )}

          <div className="text-sm text-gray-600">{status}</div>
        </div>
      </div>

      <div className="border rounded-2xl p-4">
        <h2 className="font-medium mb-2">Synchronisation Offline</h2>
        <div className="flex items-center gap-2 mb-3">
          <button
            type="button"
            onClick={doFlush}
            className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200"
          >
            Forcer la synchro maintenant
          </button>
          <button
            type="button"
            onClick={refreshPending}
            className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200"
          >
            Rafraîchir la file
          </button>
        </div>
        <div className="text-sm text-gray-700">
          {pending.length} élément(s) en attente.
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;