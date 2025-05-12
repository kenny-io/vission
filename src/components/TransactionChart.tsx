import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { TransactionDistribution } from '../types/common';
import { formatPercentage } from '../utils/format';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  TooltipItem,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface TransactionChartProps {
  distribution: TransactionDistribution | undefined;
}

interface LegendItem {
  color: string;
  label: string;
  count: number;
  percentage: number;
}

export const TransactionChart: React.FC<TransactionChartProps> = ({ distribution }) => {
  const [legendItems, setLegendItems] = useState<LegendItem[]>([]);

  // Colors for different transaction types
  const chartColors = ['#6d28d9', '#16a34a', '#f97316'];

  // Prepare chart data
  const chartData = {
    labels: ['Transfer', 'Stake', 'Unstake'],
    datasets: [
      {
        data: distribution ? [
          distribution.transfer.count,
          distribution.stake.count,
          distribution.unstake.count
        ] : [0, 0, 0],
        backgroundColor: chartColors,
        borderColor: chartColors.map(color => color),
        borderWidth: 1,
        hoverOffset: 10,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: TooltipItem<'pie'>) => {
            const label = tooltipItem.label || '';
            const value = tooltipItem.raw as number;
            return `${label}: ${formatPercentage(value)}`;
          }
        }
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
    },
  };

  // Update legend items when distribution changes
  useEffect(() => {
    if (distribution) {
      setLegendItems([
        {
          color: chartColors[0],
          label: 'Transfer',
          count: distribution.transfer.count,
          percentage: distribution.transfer.percentage,
        },
        {
          color: chartColors[1],
          label: 'Stake',
          count: distribution.stake.count,
          percentage: distribution.stake.percentage,
        },
        {
          color: chartColors[2],
          label: 'Unstake',
          count: distribution.unstake.count,
          percentage: distribution.unstake.percentage,
        },
      ]);
    }
  }, [distribution]);

  return (
    <div className="h-full">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">
        Transaction Type Distribution
      </h2>
      
      <div className="flex flex-col lg:flex-row w-full gap-4">
        <div className="relative flex justify-center items-center w-full lg:w-1/2 mb-4 lg:mb-0">
          <Pie data={chartData} options={chartOptions} />
        </div>
        <div className="flex flex-col justify-center w-full lg:w-1/2 p-2 sm:p-4">
          <div className="space-y-4">
            {legendItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-base font-semibold text-gray-900">{(item.count ?? 0).toLocaleString()}</span>
                  <span className="text-xs text-gray-500">({(item.percentage ?? 0).toFixed(2)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};