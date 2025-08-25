import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ChartContainer = ({ 
  title, 
  subtitle, 
  children, 
  onExport, 
  onFullscreen, 
  className = "",
  actions = []
}) => {
  return (
    <div className={`bg-card rounded-lg border border-border shadow-industrial-sm ${className}`}>
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {actions?.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={action?.onClick}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name={action?.icon} size={16} />
            </Button>
          ))}
          
          {onExport && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onExport}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="Download" size={16} />
            </Button>
          )}
          
          {onFullscreen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onFullscreen}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="Maximize2" size={16} />
            </Button>
          )}
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default ChartContainer;