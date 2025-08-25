import React from 'react';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const MaintenanceCostChart = () => {
  const data = [
    { month: 'Jan', preventif: 12500, correctif: 8200, total: 20700 },
    { month: 'Fév', preventif: 11800, correctif: 9500, total: 21300 },
    { month: 'Mar', preventif: 13200, correctif: 7800, total: 21000 },
    { month: 'Avr', preventif: 12900, correctif: 11200, total: 24100 },
    { month: 'Mai', preventif: 14100, correctif: 6900, total: 21000 },
    { month: 'Jun', preventif: 13500, correctif: 10800, total: 24300 },
    { month: 'Jul', preventif: 15200, correctif: 8500, total: 23700 },
    { month: 'Aoû', preventif: 14800, correctif: 9200, total: 24000 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-industrial-md">
          <p className="text-sm font-medium text-foreground mb-2">{`Mois: ${label}`}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {`${entry?.name}: ${entry?.value?.toLocaleString('fr-FR')} €`}
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
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="preventifGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="correctifGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-warning)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="var(--color-warning)" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis 
            dataKey="month" 
            tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--color-border)' }}
          />
          <YAxis 
            tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--color-border)' }}
            tickFormatter={(value) => `${(value / 1000)?.toFixed(0)}k €`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="preventif"
            stackId="1"
            stroke="var(--color-success)"
            fill="url(#preventifGradient)"
            name="Maintenance préventive"
          />
          <Area
            type="monotone"
            dataKey="correctif"
            stackId="1"
            stroke="var(--color-warning)"
            fill="url(#correctifGradient)"
            name="Maintenance corrective"
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="var(--color-primary)"
            strokeWidth={2}
            dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
            name="Coût total"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MaintenanceCostChart;