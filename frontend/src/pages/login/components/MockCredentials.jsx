import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const MockCredentials = ({ onCredentialSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const mockUsers = [
    {
      username: 'admin@equiptracker.fr',
      password: 'admin123',
      role: 'Administrateur',
      name: 'Jean Dupont'
    },
    {
      username: 'hse.manager@equiptracker.fr',
      password: 'hse456',
      role: 'Gestionnaire HSE',
      name: 'Marie Martin'
    },
    {
      username: 'tech.user@equiptracker.fr',
      password: 'tech789',
      role: 'Technicien',
      name: 'Pierre Durand'
    },
    {
      username: 'employee@equiptracker.fr',
      password: 'emp321',
      role: 'Employé',
      name: 'Sophie Leblanc'
    }
  ];

  const handleCredentialClick = (user) => {
    onCredentialSelect(user);
    setIsExpanded(false);
  };

  return (
    <div className="mt-6 p-4 bg-muted/20 rounded-lg border border-border">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
        iconPosition="right"
        className="w-full justify-between text-muted-foreground hover:text-foreground"
      >
        Comptes de démonstration
      </Button>
      {isExpanded && (
        <div className="mt-4 space-y-2">
          <p className="text-xs text-muted-foreground mb-3">
            Cliquez sur un compte pour remplir automatiquement le formulaire :
          </p>
          
          {mockUsers?.map((user, index) => (
            <button
              key={index}
              onClick={() => handleCredentialClick(user)}
              className="w-full p-3 text-left bg-card hover:bg-muted/50 rounded-lg border border-border transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <Icon name="User" size={14} className="text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      {user?.name}
                    </span>
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                      {user?.role}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {user?.username}
                  </div>
                </div>
                <Icon 
                  name="ArrowRight" 
                  size={16} 
                  className="text-muted-foreground group-hover:text-primary transition-colors" 
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MockCredentials;