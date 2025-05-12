import React from 'react';
import { MoreHorizontal } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    positive: boolean;
  };
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  trend, 
  className = '' 
}) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">{title}</div>
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <MoreHorizontal size={18} />
        </button>
      </div>
      
      <div className="flex items-end gap-2">
        <div className="text-3xl font-bold text-gray-900 dark:text-white">{value}</div>
        {trend && (
          <div className={`text-sm font-medium ${trend.positive ? 'text-green-500' : 'text-red-500'}`}>
            {trend.positive ? '+' : ''}{trend.value}%
          </div>
        )}
      </div>
      
      {subtitle && (
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{subtitle}</div>
      )}
    </div>
  );
};
