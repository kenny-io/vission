import React from 'react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  Users, 
  Database, 
  Flame 
} from 'lucide-react';
import { BlockchainMetric } from '../types/common';
import { StatCard } from './StatCard';
import { formatNumber, formatGas } from '../utils/format';

interface StatsGridProps {
  metrics: BlockchainMetric | null;
  loading: boolean;
  timeRange: string;
  blockMetrics?: {
    blocksProduced: number;
    averageTransactionsPerBlock: number;
    averageBlockTime: number;
  };
}

const getPeriodLabel = (timeRange: string, fallback = '') => {
  switch (timeRange) {
    case '1d': return '1 Day';
    case '7d': return '7 Days';
    case '30d': return '30 Days';
    case '1m': return '1 Month';
    case 'all': return 'All Time';
    default: return fallback;
  }
};

export const StatsGrid: React.FC<StatsGridProps> = ({ metrics, loading, timeRange, blockMetrics }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="card p-3 sm:p-4 md:p-6 w-full max-w-full">
            <div className="animate-pulse flex flex-col">
              <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gray-200 rounded-full mb-3 sm:mb-4"></div>
              <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-2 sm:h-3 bg-gray-200 rounded w-1/4 mt-2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 w-full max-w-full">
      <StatCard
        title="Transactions"
        value={metrics?.transactions ?? 0}
        valueFormatted={formatNumber(metrics?.transactions ?? 0)}
        icon={<TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-primary-500" />}
        color="primary"
        period={getPeriodLabel(timeRange)}
      />
      
      <StatCard
        title="Value Transacted"
        value={metrics?.valueTransacted ?? 0}
        valueFormatted={`${formatNumber(metrics?.valueTransacted ?? 0, 4)} SHM`}
        icon={<ArrowUpRight className="h-5 w-5 sm:h-6 sm:w-6 text-secondary-500" />}
        color="secondary"
        period={getPeriodLabel(timeRange)}
      />
      
      <StatCard
        title="Unique Accounts"
        value={metrics?.uniqueAccounts ?? 0}
        valueFormatted={formatNumber(metrics?.uniqueAccounts ?? 0)}
        icon={<Users className="h-5 w-5 sm:h-6 sm:w-6 text-accent-500" />}
        color="accent"
        period={timeRange === 'custom' ? 'Custom' : 'Total'}
      />
      
      <StatCard
        title="Gas Spent"
        value={metrics?.gasSpent ?? 0}
        valueFormatted={formatGas(metrics?.gasSpent ?? 0)}
        icon={<Flame className="h-5 w-5 sm:h-6 sm:w-6 text-warning-500" />}
        color="warning"
        period={getPeriodLabel(timeRange)}
      />
      
      {blockMetrics && (
        <div className="card p-4 sm:p-6 flex flex-col items-center w-full max-w-full text-center">
          <div className="p-3 rounded-full bg-success-100 mb-3">
            <Database className="h-6 w-6 text-success-500" />
          </div>
          <div className="text-lg font-semibold text-gray-900 mb-1">Blocks Produced</div>
          <div className="text-3xl font-bold text-gray-900 mb-4">{formatNumber(blockMetrics.blocksProduced)}</div>
          <div className="flex flex-col gap-1 w-full">
            <div className="text-sm text-gray-600">
              Avg. Transactions per Block: <span className="font-semibold text-gray-900">{formatNumber(blockMetrics.averageTransactionsPerBlock, 2)}</span>
            </div>
            <div className="text-sm text-gray-600">
              Avg. Block Time: <span className="font-semibold text-gray-900">{blockMetrics.averageBlockTime.toFixed(2)} s</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};