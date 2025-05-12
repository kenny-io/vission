import React from 'react';
import { BackfillProgress } from '../types/common';
import { formatNumber, formatPercentage } from '../utils/format';

interface ProgressCardProps {
  progress: BackfillProgress | undefined;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({ progress }) => {
  // If progress is undefined, show loading state
  if (!progress) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3 mt-4"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Backfill Progress
        </h2>
        <span className="text-sm font-medium text-gray-500">
          {formatPercentage(progress.percentage)} complete
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div 
          className="bg-primary-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progress.percentage}%` }}
        ></div>
      </div>
      
      <div className="text-sm text-gray-600 mt-4 text-center">
        {formatNumber(progress.blocksProcessed)} blocks processed, 
        {' '}{formatNumber(progress.blocksRemaining)} remaining
      </div>
    </div>
  );
};