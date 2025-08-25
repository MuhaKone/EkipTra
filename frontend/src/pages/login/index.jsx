import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import SystemStatus from './components/SystemStatus';
import MockCredentials from './components/MockCredentials';

import { api } from '../../lib/api';

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  
  useEffect(() => {
    // Check if user is already authenticated
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      navigate('/dashboard');
    }
  }, [navigate]);

  
  const handleLogin = async (formData) => {
    try {
      setLoginError('');
      setIsLoading(true);
      const userResp = await api.auth.login(formData.username, formData.password);
      const user = userResp.user;
      localStorage.setItem('userRole', formData.role || user?.role || 'viewer');
      localStorage.setItem('userName', user?.name || formData.username);
      localStorage.setItem('userEmail', user?.username || formData.username);
      navigate('/dashboard');
    } catch (error) {
      setLoginError(error?.message || 'Erreur de connexion');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleCredentialSelect = (user) => {
    // This would be handled by the LoginForm component
    // The form will auto-fill with selected credentials
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-card rounded-2xl shadow-industrial-lg border border-border p-8">
          {/* Header */}
          <LoginHeader />

          {/* Login Form */}
          <LoginForm 
            onLogin={handleLogin}
            isLoading={isLoading}
          />

          {/* Mock Credentials Helper */}
          <MockCredentials 
            onCredentialSelect={handleCredentialSelect}
          />
        </div>

        {/* System Status */}
        <div className="mt-6">
          <SystemStatus />
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date()?.getFullYear()} EquipTracker Local. Tous droits réservés.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Système de gestion d'équipements industriels - Mode hors ligne
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;