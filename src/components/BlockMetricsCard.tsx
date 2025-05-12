import React from 'react';
import { Database } from 'lucide-react';
import { formatNumber } from '../utils/format';

interface BlockMetricsCardProps {
  blocksProduced: number;
  averageTransactionsPerBlock: number;
  averageBlockTime: number;
}

export const BlockMetricsCard: React.FC<BlockMetricsCardProps> = ({ blocksProduced, averageTransactionsPerBlock, averageBlockTime }) => {
  return (
    <div className="card p-6 flex flex-col justify-center items-start">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-3 rounded-full bg-success-100">
          <Database className="h-6 w-6 text-success-500" />
        </div>
        <div>
          <div className="text-lg font-semibold text-gray-900">Blocks Produced</div>
          <div className="text-2xl font-bold text-gray-900">{formatNumber(blocksProduced)}</div>
        </div>
      </div>
      <div className="flex flex-col gap-1 w-full mt-2">
        <div className="flex justify-between w-full">
          <span className="text-gray-700">Avg. Transactions per Block</span>
          <span className="font-semibold text-gray-900">{formatNumber(averageTransactionsPerBlock, 2)}</span>
        </div>
        <div className="flex justify-between w-full">
          <span className="text-gray-700">Avg. Block Time</span>
          <span className="font-semibold text-gray-900">{averageBlockTime.toFixed(2)} s</span>
        </div>
      </div>
    </div>
  );
}; 