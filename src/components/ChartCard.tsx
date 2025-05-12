import React from 'react';
import { MoreHorizontal, ExternalLink } from 'lucide-react';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  expandable?: boolean;
}

export const ChartCard: React.FC<ChartCardProps> = ({ 
  title, 
  children, 
  className = '',
  expandable = true
}) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</div>
        <div className="flex items-center gap-2">
          <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <MoreHorizontal size={18} />
          </button>
          {expandable && (
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <ExternalLink size={18} />
            </button>
          )}
        </div>
      </div>
      
      <div className="h-full">
        {children}
      </div>
    </div>
  );
};
