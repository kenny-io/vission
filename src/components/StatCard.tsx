import React from 'react';
import { cn } from '../utils/cn';

type ColorVariant = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';

interface StatCardProps {
  title: string;
  value: number;
  valueFormatted: string;
  icon: React.ReactNode;
  color: ColorVariant;
  period: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  valueFormatted,
  icon,
  color,
  period,
}) => {
  // Determine icon background color based on color prop
  const iconBgColorClass = {
    primary: 'bg-primary-100',
    secondary: 'bg-secondary-100',
    accent: 'bg-accent-100',
    success: 'bg-success-100',
    warning: 'bg-warning-100',
    error: 'bg-error-100',
  }[color];

  return (
    <div className="card p-4 md:p-6 transition duration-300 hover:translate-y-[-2px]">
      <div className="flex flex-col h-full">
        <div className={cn('p-3 rounded-full w-fit mb-4', iconBgColorClass)}>
          {icon}
        </div>
        
        <div className="space-y-1 mt-auto">
          <div className="stat-value" title={value.toString()}>
            {valueFormatted}
          </div>
          <div className="stat-label">
            {title}
          </div>
          <div className="stat-period">
            {period}
          </div>
        </div>
      </div>
    </div>
  );
};