import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginHeader = () => {
  return (
    <div className="text-center mb-8">
      {/* Logo */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-industrial-md">
          <Icon name="Wrench" size={32} color="white" />
        </div>
      </div>

      {/* App Title */}
      <h1 className="text-3xl font-bold text-foreground mb-2">
        EquipTracker Local
      </h1>
      
      {/* Subtitle */}
      <p className="text-muted-foreground text-lg">
        Système de gestion d'équipements industriels
      </p>
      
      {/* Version Info */}
      <div className="mt-4 inline-flex items-center space-x-2 px-3 py-1 bg-muted/50 rounded-full">
        <Icon name="Shield" size={14} className="text-success" />
        <span className="text-xs font-medium text-muted-foreground">
          Version 2.1.0 - Mode Local
        </span>
      </div>
    </div>
  );
};

export default LoginHeader;