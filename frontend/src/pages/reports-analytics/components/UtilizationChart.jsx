import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const UtilizationChart = () => {
  const data = [
    { month: 'Jan', utilisation: 85, maintenance: 12, disponible: 88 },
    { month: 'Fév', utilisation: 78, maintenance: 18, disponible: 82 },
    { month: 'Mar', utilisation: 92, maintenance: 8, disponible: 92 },
    { month: 'Avr', utilisation: 88, maintenance: 15, disponible: 85 },
    { month: 'Mai', utilisation: 95, maintenance: 5, disponible: 95 },
    { month: 'Jun', utilisation: 82, maintenance: 20, disponible: 80 },
    { month: 'Jul', utilisation: 89, maintenance: 11, disponible: 89 },
    { month: 'Aoû', utilisation: 91, maintenance: 9, disponible: 91 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-industrial-md">
          <p className="text-sm font-medium text-foreground mb-2">{`Mois: ${label}`}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {`${entry?.name}: ${entry?.value}%`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis 
            dataKey="month" 
            tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--color-border)' }}
          />
          <YAxis 
            tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--color-border)' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ color: 'var(--color-foreground)' }}
          />
          <Bar 
            dataKey="utilisation" 
            fill="var(--color-primary)" 
            name="Taux d'utilisation"
            radius={[2, 2, 0, 0]}
          />
          <Bar 
            dataKey="maintenance" 
            fill="var(--color-warning)" 
            name="En maintenance"
            radius={[2, 2, 0, 0]}
          />
          <Bar 
            dataKey="disponible" 
            fill="var(--color-success)" 
            name="Disponible"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UtilizationChart;