import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const EquipmentStatusChart = () => {
  const statusData = [
    { name: 'Disponible', value: 156, color: '#059669' },
    { name: 'En prêt', value: 89, color: '#0EA5E9' },
    { name: 'Maintenance', value: 23, color: '#D97706' },
    { name: 'Hors service', value: 12, color: '#DC2626' }
  ];

  const utilizationData = [
    { category: 'Construction', utilization: 85, total: 120 },
    { category: 'HSE', utilization: 92, total: 65 },
    { category: 'Minier', utilization: 78, total: 45 },
    { category: 'Électrique', utilization: 88, total: 50 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-industrial-md">
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-sm text-muted-foreground">
            Taux d'utilisation: <span className="font-medium text-foreground">{payload?.[0]?.value}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100)?.toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-industrial-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">État des Équipements</h3>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-md">
            Statut
          </button>
          <button className="px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-industrial">
            Utilisation
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Pie Chart */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-4">Répartition par Statut</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [value, 'Équipements']}
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {statusData?.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item?.color }}
                />
                <span className="text-xs text-muted-foreground">{item?.name}</span>
                <span className="text-xs font-medium text-foreground ml-auto">{item?.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Utilization Bar Chart */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-4">Taux d'Utilisation par Catégorie</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={utilizationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="category" 
                  tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                  axisLine={{ stroke: 'var(--color-border)' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                  axisLine={{ stroke: 'var(--color-border)' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="utilization" 
                  fill="var(--color-primary)" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentStatusChart;