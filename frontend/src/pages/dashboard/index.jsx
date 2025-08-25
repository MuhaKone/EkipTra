import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationHeader from '../../components/ui/NavigationHeader';
import PrimaryNavigation from '../../components/ui/PrimaryNavigation';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import MetricCard from './components/MetricCard';
import ActivityFeed from './components/ActivityFeed';
import EquipmentStatusChart from './components/EquipmentStatusChart';
import AlertsPanel from './components/AlertsPanel';
import MaintenanceSchedule from './components/MaintenanceSchedule';
import QuickActions from './components/QuickActions';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [userRole, setUserRole] = useState('Technicien');

  useEffect(() => {
    // Check authentication
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      navigate('/login');
      return;
    }

    // Get user role
    const savedRole = localStorage.getItem('userRole') || 'Technicien';
    setUserRole(savedRole);

    // Handle responsive menu collapse
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [navigate]);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  // Mock metrics data
  const metricsData = [
    {
      title: 'Total Équipements',
      value: '280',
      change: '+12 ce mois',
      changeType: 'positive',
      icon: 'Package',
      color: 'primary'
    },
    {
      title: 'Disponibles',
      value: '156',
      change: '55,7% du total',
      changeType: 'neutral',
      icon: 'CheckCircle',
      color: 'success'
    },
    {
      title: 'En Maintenance',
      value: '23',
      change: '-5 cette semaine',
      changeType: 'positive',
      icon: 'Wrench',
      color: 'warning'
    },
    {
      title: 'Retours en Retard',
      value: '8',
      change: '+2 aujourd\'hui',
      changeType: 'negative',
      icon: 'AlertTriangle',
      color: 'error'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <NavigationHeader
        onMenuToggle={handleMenuToggle}
        isMenuOpen={isMenuOpen}
        userRole={userRole}
      />
      {/* Primary Navigation */}
      <PrimaryNavigation
        isCollapsed={isMenuCollapsed}
        isOpen={isMenuOpen}
        onClose={handleMenuClose}
        userRole={userRole}
      />
      {/* Main Content */}
      <main className={`transition-smooth ${isMenuCollapsed ? 'lg:ml-16' : 'lg:ml-60'} pt-16`}>
        {/* Breadcrumb Navigation */}
        <BreadcrumbNavigation />

        {/* Dashboard Content */}
        <div className="p-6 space-y-6">
          {/* Welcome Section */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Tableau de Bord - EquipTracker Local
            </h1>
            <p className="text-muted-foreground">
              Vue d'ensemble de votre inventaire d'équipements et des activités récentes
            </p>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {metricsData?.map((metric, index) => (
              <MetricCard
                key={index}
                title={metric?.title}
                value={metric?.value}
                change={metric?.change}
                changeType={metric?.changeType}
                icon={metric?.icon}
                color={metric?.color}
              />
            ))}
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Left Column - Main Content */}
            <div className="xl:col-span-8 space-y-6">
              {/* Equipment Status Chart */}
              <EquipmentStatusChart />

              {/* Activity Feed */}
              <ActivityFeed />
            </div>

            {/* Right Column - Sidebar */}
            <div className="xl:col-span-4 space-y-6">
              {/* Alerts Panel */}
              <AlertsPanel />

              {/* Maintenance Schedule */}
              <MaintenanceSchedule />

              {/* Quick Actions */}
              <QuickActions />
            </div>
          </div>

          {/* Additional Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-card rounded-lg border border-border p-6 shadow-industrial-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Utilisation Mensuelle</h3>
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">€</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground mb-2">€15 420,00</p>
              <p className="text-sm text-success">+8,2% par rapport au mois dernier</p>
            </div>

            <div className="bg-card rounded-lg border border-border p-6 shadow-industrial-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Taux d'Utilisation</h3>
                <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-success">%</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground mb-2">84,5%</p>
              <p className="text-sm text-success">Objectif: 80% atteint</p>
            </div>

            <div className="bg-card rounded-lg border border-border p-6 shadow-industrial-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Économies Réalisées</h3>
                <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-warning">€</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground mb-2">€3 280,00</p>
              <p className="text-sm text-muted-foreground">Grâce à la maintenance préventive</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;