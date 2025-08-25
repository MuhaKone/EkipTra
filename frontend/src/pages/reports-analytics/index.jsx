import { api } from '../../lib/api';
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import NavigationHeader from '../../components/ui/NavigationHeader';
import PrimaryNavigation from '../../components/ui/PrimaryNavigation';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import { RoleProvider } from '../../components/ui/RoleBasedMenuFilter';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

// Import all components
import KPICard from './components/KPICard';
import ChartContainer from './components/ChartContainer';
import ReportFilters from './components/ReportFilters';
import UtilizationChart from './components/UtilizationChart';
import CategoryDistributionChart from './components/CategoryDistributionChart';
import MaintenanceCostChart from './components/MaintenanceCostChart';
import EquipmentLifecycleTable from './components/EquipmentLifecycleTable';
import ExportActions from './components/ExportActions';

const ReportsAnalytics = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(false);
  const [userRole, setUserRole] = useState('Administrateur');
  const [currentLanguage, setCurrentLanguage] = useState('fr');
  const [lastSyncTime, setLastSyncTime] = useState(new Date());

  
useEffect(() => {
  (async () => {
    try {
      const util = await api.reports.utilization();
      kpiData = [
        { title: "Équipements en utilisation", value: util.used, trend: "+3,5%", icon: "Activity", tooltip: "Nombre d'équipements actuellement prêtés" },
        { title: "Équipements disponibles", value: util.available, trend: "-1,2%", icon: "Package", tooltip: "Nombre d'équipements disponibles" },
        { title: "En maintenance", value: util.maint, trend: "+0,8%", icon: "Wrench", tooltip: "Équipements en maintenance" },
        { title: "Retirés", value: util.retired, trend: "-0,3%", icon: "Archive", tooltip: "Équipements retirés" }
      ];
      const costs = await api.reports.maintenanceCosts();
      // store in state if components expect props (left as is)
    } catch(e) { console.error(e); }
  })();

    // Get user role and language from localStorage
    const savedRole = localStorage.getItem('userRole') || 'Administrateur';
    const savedLanguage = localStorage.getItem('currentLanguage') || 'fr';
    
    setUserRole(savedRole);
    setCurrentLanguage(savedLanguage);
    
    // Update last sync time
    const interval = setInterval(() => {
      setLastSyncTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleFiltersChange = (filters) => {
    console.log('Filters changed:', filters);
    // In a real application, this would trigger data refetch
  };

  const handleExport = (config) => {
    console.log('Export configuration:', config);
    // In a real application, this would trigger the export process
  };

  const handleChartExport = (chartType) => {
    console.log(`Exporting ${chartType} chart`);
    // Export individual chart
  };

  let kpiData = [
    {
      title: "Taux d\'utilisation moyen",
      value: "87.2",
      unit: "%",
      trend: "up",
      trendValue: "+2.4%",
      icon: "Activity",
      color: "primary"
    },
    {
      title: "Coût de maintenance mensuel",
      value: "24,000",
      unit: "€",
      trend: "down",
      trendValue: "-5.2%",
      icon: "Euro",
      color: "success"
    },
    {
      title: "Équipements en service",
      value: "403",
      unit: "/425",
      trend: "up",
      trendValue: "+12",
      icon: "Package",
      color: "primary"
    },
    {
      title: "Temps d\'arrêt moyen",
      value: "2.8",
      unit: "h/mois",
      trend: "down",
      trendValue: "-0.5h",
      icon: "Clock",
      color: "warning"
    }
  ];

  return (
    <RoleProvider>
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>Rapports & Analyses - EquipTracker Local</title>
          <meta name="description" content="Tableaux de bord analytiques et rapports de performance pour la gestion d'équipements industriels" />
        </Helmet>

        {/* Navigation Header */}
        <NavigationHeader
          onMenuToggle={handleMenuToggle}
          isMenuOpen={isMenuOpen}
          userRole={userRole}
        />

        {/* Primary Navigation */}
        <PrimaryNavigation
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          userRole={userRole}
        />

        {/* Main Content */}
        <div className="lg:ml-60 pt-16">
          {/* Breadcrumb Navigation */}
          <BreadcrumbNavigation />

          {/* Page Header */}
          <div className="px-6 py-6 border-b border-border bg-card">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Rapports & Analyses</h1>
                <p className="text-muted-foreground mt-1">
                  Tableaux de bord et analyses de performance des équipements
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Sync Status */}
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-success rounded-full pulse-status" />
                  <span>Dernière sync: {lastSyncTime?.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                
                {/* Quick Actions */}
                <Button variant="outline" size="sm">
                  <Icon name="RefreshCw" size={16} className="mr-2" />
                  Actualiser
                </Button>
                
                <Button size="sm">
                  <Icon name="Download" size={16} className="mr-2" />
                  Exporter
                </Button>
              </div>
            </div>
          </div>

          <div className="flex">
            {/* Filters Sidebar */}
            <ReportFilters
              onFiltersChange={handleFiltersChange}
              isCollapsed={isFiltersCollapsed}
              onToggleCollapse={() => setIsFiltersCollapsed(!isFiltersCollapsed)}
            />

            {/* Main Content Area */}
            <div className="flex-1 p-6 space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {kpiData?.map((kpi, index) => (
                  <KPICard
                    key={index}
                    title={kpi?.title}
                    value={kpi?.value}
                    unit={kpi?.unit}
                    trend={kpi?.trend}
                    trendValue={kpi?.trendValue}
                    icon={kpi?.icon}
                    color={kpi?.color}
                  />
                ))}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Utilization Chart */}
                <ChartContainer
                  title="Taux d'utilisation mensuel"
                  subtitle="Évolution de l'utilisation et de la disponibilité"
                  onExport={() => handleChartExport('utilization')}
                  onFullscreen={() => console.log('Fullscreen utilization chart')}
                  actions={[
                    { icon: 'Settings', onClick: () => console.log('Configure chart') }
                  ]}
                >
                  <UtilizationChart />
                </ChartContainer>

                {/* Category Distribution */}
                <ChartContainer
                  title="Répartition par catégorie"
                  subtitle="Distribution des équipements par type"
                  onExport={() => handleChartExport('category')}
                  onFullscreen={() => console.log('Fullscreen category chart')}
                >
                  <CategoryDistributionChart />
                </ChartContainer>
              </div>

              {/* Maintenance Cost Chart */}
              <ChartContainer
                title="Évolution des coûts de maintenance"
                subtitle="Coûts préventifs vs correctifs par mois"
                onExport={() => handleChartExport('maintenance')}
                onFullscreen={() => console.log('Fullscreen maintenance chart')}
                className="col-span-full"
              >
                <MaintenanceCostChart />
              </ChartContainer>

              {/* Equipment Lifecycle Table */}
              <div className="bg-card rounded-lg border border-border shadow-industrial-sm">
                <div className="p-6 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Cycle de vie des équipements</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Analyse détaillée de la dépréciation et des coûts
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Icon name="Filter" size={16} />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Icon name="Download" size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <EquipmentLifecycleTable />
                </div>
              </div>

              {/* Export Actions */}
              <ExportActions onExport={handleExport} />

              {/* Predictive Analytics Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card rounded-lg border border-border p-6 shadow-industrial-sm">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-primary/10 text-primary rounded-lg">
                      <Icon name="TrendingUp" size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Prédictions de maintenance</h3>
                      <p className="text-sm text-muted-foreground">Recommandations basées sur l'IA</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-warning/5 border border-warning/20 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon name="AlertTriangle" size={16} className="text-warning" />
                        <div>
                          <p className="text-sm font-medium text-foreground">EQ-001 - Excavatrice CAT</p>
                          <p className="text-xs text-muted-foreground">Maintenance recommandée dans 5 jours</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Icon name="ArrowRight" size={14} />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-error/5 border border-error/20 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon name="AlertCircle" size={16} className="text-error" />
                        <div>
                          <p className="text-sm font-medium text-foreground">EQ-004 - Grue Liebherr</p>
                          <p className="text-xs text-muted-foreground">Risque de panne élevé détecté</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Icon name="ArrowRight" size={14} />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg border border-border p-6 shadow-industrial-sm">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-success/10 text-success rounded-lg">
                      <Icon name="BarChart3" size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Optimisations suggérées</h3>
                      <p className="text-sm text-muted-foreground">Économies potentielles identifiées</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-3 bg-success/5 border border-success/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">Maintenance préventive</span>
                        <span className="text-sm font-bold text-success">-15% coûts</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Augmenter la fréquence de maintenance préventive pourrait réduire les pannes de 30%
                      </p>
                    </div>
                    
                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">Remplacement d'équipements</span>
                        <span className="text-sm font-bold text-primary">ROI +25%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        3 équipements identifiés pour remplacement avec retour sur investissement optimal
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleProvider>
  );
};

export default ReportsAnalytics;