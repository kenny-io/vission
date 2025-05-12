import React from 'react';
import { TimeRange } from '../types/common';
import { cn } from '../utils/cn';

interface TimeSelectorProps {
  activeRange: TimeRange;
  onSelectRange: (range: TimeRange) => void;
}

export const TimeSelector: React.FC<TimeSelectorProps> = ({ 
  activeRange, 
  onSelectRange 
}) => {
  const handleRangeClick = (range: TimeRange) => {
    onSelectRange(range);
  };
  
  return (
    <div className="flex flex-wrap items-center gap-2 bg-white rounded-lg shadow-sm border border-gray-100 p-1">
      <button
        onClick={() => handleRangeClick('1d')}
        className={cn(
          'time-selector-btn text-xs sm:text-sm',
          activeRange === '1d' ? 'time-selector-btn-active' : 'time-selector-btn-inactive'
        )}
      >
        1d
      </button>
      <button
        onClick={() => handleRangeClick('7d')}
        className={cn(
          'time-selector-btn text-xs sm:text-sm',
          activeRange === '7d' ? 'time-selector-btn-active' : 'time-selector-btn-inactive'
        )}
      >
        7d
      </button>
      {/* 30d option removed in favor of 1m */}
      <button
        onClick={() => handleRangeClick('1m')}
        className={cn(
          'time-selector-btn text-xs sm:text-sm',
          activeRange === '1m' ? 'time-selector-btn-active' : 'time-selector-btn-inactive'
        )}
      >
        1m
      </button>
      <button
        onClick={() => handleRangeClick('all')}
        className={cn(
          'time-selector-btn text-xs sm:text-sm',
          activeRange === 'all' ? 'time-selector-btn-active' : 'time-selector-btn-inactive'
        )}
      >
        all
      </button>
      {/* Custom time option removed */}
    </div>
  );
};