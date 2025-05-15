import React, { useState, useEffect } from 'react';
import { Info, Database } from 'lucide-react';
import { BlockchainData, TimeRange, BackfillProgress } from '../types/common';
import { TimeSelector } from './TimeSelector';
import { StatsGrid } from './StatsGrid';
import { TransactionChart } from './TransactionChart';
import * as api from '../services/api';
import { TopAccountsTable } from './TopAccountsTable';
import { UniqueAddressesTrendChart } from './UniqueAddressesTrendChart';

// Dashboard component types

interface DashboardProps {
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ timeRange, setTimeRange }) => {
  // Custom type with nullable backfill progress
  type DashboardData = Omit<BlockchainData, 'backfillProgress'> & {
    backfillProgress: BackfillProgress | null;
  };

  const [data, setData] = useState<DashboardData | null>(null);
  const [blockMetrics, setBlockMetrics] = useState<{ averageTransactionsPerBlock: number; averageBlockTime: number } | null>(null);
  const [topAccounts, setTopAccounts] = useState<{ address: string; netValue: string }[]>([]);
  const [uniqueAddressesTrend, setUniqueAddressesTrend] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Group API requests by priority to enable progressive loading
  const fetchCriticalData = async () => {
    try {
      // Fetch critical data in parallel (core metrics and status)
      const [txCountResp, valueResp, gasResp, typesResp, blocksResp, statusResp] = await Promise.allSettled([
        api.fetchTransactionCount(timeRange),
        api.fetchTransactionValue(timeRange),
        api.fetchGasUsage(timeRange),
        api.fetchTransactionTypes(timeRange),
        api.fetchBlockMetrics(timeRange),
        api.fetchIndexerStatus()
      ]);

      return {
        txCount: txCountResp.status === 'fulfilled' ? txCountResp.value : { count: 0 },
        value: valueResp.status === 'fulfilled' ? valueResp.value : { totalValue: '0' },
        gas: gasResp.status === 'fulfilled' ? gasResp.value : { totalGasUsed: 0 },
        types: typesResp.status === 'fulfilled' ? typesResp.value : { distribution: { transfer: 0, stake: 0, unstake: 0 } },
        blocks: blocksResp.status === 'fulfilled' ? blocksResp.value : { totalBlocks: 0, averageTransactionsPerBlock: 0, averageBlockTime: 0 },
        status: statusResp.status === 'fulfilled' ? statusResp.value : { backfill: { percentageComplete: 0, blocksProcessed: 0, blocksRemaining: 0 } }
      };
    } catch (error) {
      console.error('Error fetching critical data:', error);
      return null;
    }
  };

  // Fetch secondary data that's not needed for initial render
  const fetchSecondaryData = async () => {
    try {
      // Fetch secondary data in parallel
      const [uniqueAccountsResp, topAccountsResp, addressesTrendResp] = await Promise.allSettled([
        api.fetchUniqueAccounts(timeRange),
        api.fetchTopAccounts(timeRange, 10),
        api.fetchUniqueAddressesTrend(timeRange)
      ]);

      return {
        uniqueAccounts: uniqueAccountsResp.status === 'fulfilled' ? uniqueAccountsResp.value : { uniqueAccountCount: 0 },
        topAccounts: topAccountsResp.status === 'fulfilled' ? topAccountsResp.value : { topAccounts: [] },
        addressesTrend: addressesTrendResp.status === 'fulfilled' ? addressesTrendResp.value : null
      };
    } catch (error) {
      console.error('Error fetching secondary data:', error);
      return {
        uniqueAccounts: { uniqueAccountCount: 0 },
        topAccounts: { topAccounts: [] },
        addressesTrend: null
      };
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Fetching data for time range: ${timeRange}`);
      
      // First fetch critical data needed for initial render
      const criticalData = await fetchCriticalData();
      
      if (!criticalData) {
        throw new Error('Failed to fetch critical dashboard data');
      }
      
      const { txCount, value, gas, types, blocks, status } = criticalData;
      
      // Process critical data and update UI immediately
      let totalTransactions = 0;
      if (types && types.distribution) {
        totalTransactions = Object.values(types.distribution as Record<string, number>).reduce((a, b) => a + b, 0);
      }
      
      // Create backfill and catch-up progress data
      let backfillProgress = null;
      if (status) {
        const latestBlockOnChain = status.latestBlockOnChain || 0;
        const currentForwardHead = status.currentForwardHead || 0;
        const backfillPercentage = status.backfill?.percentageComplete || 0;
        
        let catchUpPercentage = 100;
        let blocksBehind = 0;
        
        if (latestBlockOnChain > currentForwardHead) {
          blocksBehind = latestBlockOnChain - currentForwardHead;
          catchUpPercentage = Math.max(0, Math.min(100, ((currentForwardHead / latestBlockOnChain) * 100)));
        }
        
        backfillProgress = {
          percentage: backfillPercentage,
          blocksProcessed: status.backfill?.blocksProcessed || 0,
          blocksRemaining: status.backfill?.blocksRemaining || 0,
          latestBlockOnChain,
          currentForwardHead,
          catchUpPercentage,
          blocksBehind
        };
      }
      
      // Create transaction distribution data
      const transactionDistribution = {
        transfer: {
          count: types?.distribution?.transfer || 0,
          percentage: totalTransactions > 0 ? ((types?.distribution?.transfer || 0) / totalTransactions) * 100 : 0
        },
        stake: {
          count: types?.distribution?.stake || 0,
          percentage: totalTransactions > 0 ? ((types?.distribution?.stake || 0) / totalTransactions) * 100 : 0
        },
        unstake: {
          count: types?.distribution?.unstake || 0,
          percentage: totalTransactions > 0 ? ((types?.distribution?.unstake || 0) / totalTransactions) * 100 : 0
        }
      };
      
      // Set initial data with critical metrics
      setData({
        metrics: {
          transactions: txCount?.count || 0,
          valueTransacted: parseFloat(value?.totalValue || '0') / 1e18, // Convert from Wei to SHM
          uniqueAccounts: 0, // Will be updated with secondary data
          blocksProduced: blocks?.totalBlocks || 0,
          gasSpent: gas?.totalGasUsed || 0
        },
        transactionDistribution,
        backfillProgress
      });
      
      // Set block metrics
      if (blocks && blocks.averageTransactionsPerBlock !== undefined) {
        setBlockMetrics({
          averageTransactionsPerBlock: blocks.averageTransactionsPerBlock,
          averageBlockTime: blocks.averageBlockTime
        });
      }
      
      // Show content with critical data
      setLoading(false);
      
      // Fetch secondary data in the background
      const secondaryData = await fetchSecondaryData();
      const { uniqueAccounts, topAccounts: topAccountsData, addressesTrend } = secondaryData;
      
      // Update with secondary data
      if (data) {
        // Update unique accounts count
        setData(prevData => {
          if (!prevData) return null;
          return {
            ...prevData,
            metrics: {
              ...prevData.metrics,
              uniqueAccounts: uniqueAccounts?.uniqueAccountCount || 0
            }
          };
        });
      }
      
      // Set top accounts
      setTopAccounts(topAccountsData?.topAccounts || []);
      
      // Set unique addresses trend
      setUniqueAddressesTrend(addressesTrend);

      // Check if we have any data
      const hasAnyData = txCount?.count > 0 || parseFloat(value?.totalValue || '0') > 0 || gas?.totalGasUsed > 0 || uniqueAccounts?.uniqueAccountCount > 0;
      if (!hasAnyData) {
        setError('No data available for the selected time range.');
      } else {
        setError(null);
      }
    } catch (error) {
      console.error('Failed to fetch blockchain data:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      
      setError(`${errorMessage}`);
      
      // Reset data states 
      setData(null);
      setBlockMetrics(null);
      setTopAccounts([]);
      setUniqueAddressesTrend(null);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    // Clear any previous error when changing time range
    setError(null);
    fetchData();
  }, [timeRange]);

  return (
    <div className="animate-fade-in px-2 sm:px-4 md:px-6 xl:px-8 max-w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 sm:mb-6 space-y-3 md:space-y-0">
        <TimeSelector activeRange={timeRange} onSelectRange={setTimeRange} />
      </div>

      {error && (
        <div className="mb-4 p-4 bg-warning-50 border border-warning-200 rounded-lg">
          <p className="text-warning-700">{error}</p>
        </div>
      )}
      
      {/* Progress Info Component - show when either backfill or catch-up is not 100% complete */}
      {!loading && data?.backfillProgress && (data.backfillProgress.percentage !== 100 || (data.backfillProgress.catchUpPercentage !== undefined && data.backfillProgress.catchUpPercentage < 100)) && (
        <div className="flex flex-col mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg text-orange-800">
          {/* Backfill Progress - only show when not 100% complete */}
          {data.backfillProgress.percentage !== 100 && (
            <div className="flex items-center mb-3">
              <Info className="h-5 w-5 mr-3 text-orange-400 flex-shrink-0" />
              <div className="flex flex-col w-full">
                <span className="font-semibold">Backfill Progress</span>
                <div className="w-full mt-1 mb-1 h-2 bg-orange-100 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-orange-400 rounded-full transition-all duration-500"
                    style={{ width: `${data.backfillProgress.percentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs">
                  <span>{(data.backfillProgress.blocksProcessed ?? 0).toLocaleString()} blocks processed</span>
                  <span>{(data.backfillProgress.blocksRemaining ?? 0).toLocaleString()} remaining</span>
                  <span>{(data.backfillProgress.percentage ?? 0).toFixed(2)}% complete</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Catch-up Progress - only show when not 100% caught up */}
          {data.backfillProgress.catchUpPercentage !== undefined && data.backfillProgress.catchUpPercentage < 100 && (
            <div className="flex items-center">
              <Info className="h-5 w-5 mr-3 text-blue-400 flex-shrink-0" />
              <div className="flex flex-col w-full">
                <span className="font-semibold">Chain Sync Progress</span>
                <div className="w-full mt-1 mb-1 h-2 bg-blue-100 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-primary-700 rounded-full transition-all duration-500"
                    style={{ width: `${data.backfillProgress.catchUpPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Current head: {(data.backfillProgress.currentForwardHead ?? 0).toLocaleString()}</span>
                  <span>{(data.backfillProgress.blocksBehind ?? 0).toLocaleString()} blocks behind</span>
                  <span>{(data.backfillProgress.catchUpPercentage ?? 0).toFixed(2)}% synced</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {loading ? (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          <div className="xl:col-span-3">
            <StatsGrid loading={true} metrics={null} timeRange={timeRange} />
          </div>
          <div className="card p-4 sm:p-6 h-60 sm:h-80">
            <div className="animate-pulse h-full flex flex-col">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="flex-1 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Main Stats Grid */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-4">
            <div className="xl:col-span-4">
              {data?.metrics ? (
                <StatsGrid
                  loading={false}
                  metrics={data.metrics}
                  timeRange={timeRange}

                />
              ) : (
                <div className="card p-4 sm:p-6 flex items-center justify-center text-gray-400">No stats data available</div>
              )}
            </div>
          </div>
          
          {/* Transaction Chart and Blocks */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 mt-4">
            <div className="card p-4 sm:p-6">
              {data?.transactionDistribution ? (
                <TransactionChart distribution={data.transactionDistribution} />
              ) : (
                <div className="text-gray-400">No transaction type data available</div>
              )}
            </div>
            
            {/* Blocks Produced Card */}
            {blockMetrics && data?.metrics && typeof data.metrics.blocksProduced === 'number' ? (
              <div className="card p-4 sm:p-6 flex flex-col items-center justify-center">
                <div className="p-3 rounded-full bg-success-100 mb-3">
                  <Database className="h-6 w-6 text-success-500" />
                </div>
                <div className="text-lg font-semibold text-gray-900 mb-1">Blocks Produced</div>
                <div className="text-3xl font-bold text-gray-900 mb-4">{data.metrics.blocksProduced.toLocaleString()}</div>
                <div className="flex flex-col gap-1 w-full">
                  <div className="text-sm text-gray-600">
                    Avg. Transactions per Block: <span className="font-semibold text-gray-900">{blockMetrics.averageTransactionsPerBlock.toFixed(2)}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Avg. Block Time: <span className="font-semibold text-gray-900">{blockMetrics.averageBlockTime.toFixed(2)} s</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card p-4 sm:p-6 flex items-center justify-center text-gray-400">No block metrics available</div>
            )}
          </div>
          {/* Top Accounts Table */}
          {!loading && topAccounts && topAccounts.length > 0 ? (
            <TopAccountsTable accounts={topAccounts} />
          ) : (
            <div className="card p-6 mt-6 text-gray-400"> more data coming soon</div>
          )}
          {/* Unique Addresses Trend Chart */}
          {!loading && uniqueAddressesTrend ? (
            <UniqueAddressesTrendChart trendData={uniqueAddressesTrend} />
          ) : (
            <div className="card p-6 mt-6 text-gray-400"> more data coming soon</div>
          )}
        </>
      )}
    </div>
  );
};