import { TimeRange } from '../types/common';

export interface NetworkHealthResponse {
  status: string;
  uptime: number;
  timestamp: string;
  database: string;
  isServiceValidatorMode: boolean;
}

// Set API and Network Health URLs from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://34.173.3.206:3002';
const NETWORK_HEALTH_URL = import.meta.env.VITE_NETWORK_HEALTH_URL || 'http://35.238.62.173:8000';

const handleApiError = async (response: Response, endpoint: string, timeRange?: string) => {
  if (!response.ok) {
    // Special handling for 30d range - log but don't throw
    if (timeRange === '30d') {
      console.warn(`API Error for 30d range (${endpoint}):`, {
        status: response.status,
        statusText: response.statusText
      });
      
      // Return appropriate empty data structures based on endpoint
      if (endpoint.includes('count')) {
        return { count: 0 };
      } else if (endpoint.includes('value')) {
        return { totalValue: '0' };
      } else if (endpoint.includes('gas')) {
        return { totalGasUsed: 0 };
      } else if (endpoint.includes('types')) {
        return { distribution: { transfer: 0, stake: 0, unstake: 0 } };
      } else if (endpoint.includes('metrics')) {
        return { totalBlocks: 0, averageTransactionsPerBlock: 0, averageBlockTime: 0 };
      } else if (endpoint.includes('unique')) {
        return { uniqueAccountCount: 0 };
      } else if (endpoint.includes('top')) {
        return { topAccounts: [] };
      } else if (endpoint.includes('trend')) {
        return { trend: [] };
      } else {
        return {};
      }
    }
    
    // For other time ranges, throw an error as before
    const errorBody = await response.text().catch(() => 'No error details available');
    console.error(`API Error (${endpoint}):`, {
      status: response.status,
      statusText: response.statusText,
      body: errorBody
    });
    throw new Error(`API Error (${response.status}): ${response.statusText}`);
  }
  return response.json();
};

export async function fetchIndexerStatus() {
  try {
    const response = await fetch(`${API_BASE_URL}/status`);
    return handleApiError(response, 'status');
  } catch (error) {
    console.error('Failed to fetch indexer status:', error);
    throw new Error('Failed to fetch indexer status. Please check if the API server is running.');
  }
}

export async function fetchTransactionCount(range: TimeRange) {
  try {
    const mappedRange = mapTimeRange(range);
    const response = await fetch(`${API_BASE_URL}/transactions/count?range=${mappedRange}`);
    return handleApiError(response, 'transactions/count', mappedRange);
  } catch (error) {
    console.error('Failed to fetch transaction count:', error);
    if (mapTimeRange(range) === '30d') {
      return { count: 0 };
    }
    throw new Error('Failed to fetch transaction count. Please check if the API server is running.');
  }
}

export async function fetchNetworkHealth(): Promise<NetworkHealthResponse> {
  try {
    const response = await fetch(`${NETWORK_HEALTH_URL}/is-healthy`);
    return handleApiError(response, 'network-health');
  } catch (error) {
    console.error('Failed to fetch network health:', error);
    throw new Error('Failed to fetch network health. Please check if the network health service is running.');
  }
}

export async function fetchTransactionValue(range: TimeRange) {
  try {
    const mappedRange = mapTimeRange(range);
    const response = await fetch(`${API_BASE_URL}/value?range=${mappedRange}`);
    return handleApiError(response, 'value', mappedRange);
  } catch (error) {
    console.error('Failed to fetch transaction value:', error);
    if (mapTimeRange(range) === '30d') {
      return { totalValue: '0' };
    }
    throw new Error('Failed to fetch transaction value. Please check if the API server is running.');
  }
}

export async function fetchGasUsage(range: TimeRange) {
  try {
    const mappedRange = mapTimeRange(range);
    const response = await fetch(`${API_BASE_URL}/gas?range=${mappedRange}`);
    return handleApiError(response, 'gas', mappedRange);
  } catch (error) {
    console.error('Failed to fetch gas usage:', error);
    if (mapTimeRange(range) === '30d') {
      return { totalGasUsed: 0 };
    }
    throw new Error('Failed to fetch gas usage. Please check if the API server is running.');
  }
}

export async function fetchTransactionTypes(range: TimeRange) {
  try {
    const mappedRange = mapTimeRange(range);
    const response = await fetch(`${API_BASE_URL}/transactions/types?range=${mappedRange}`);
    return handleApiError(response, 'transactions/types', mappedRange);
  } catch (error) {
    console.error('Failed to fetch transaction types:', error);
    if (mapTimeRange(range) === '30d') {
      return { distribution: { transfer: 0, stake: 0, unstake: 0 } };
    }
    throw new Error('Failed to fetch transaction types. Please check if the API server is running.');
  }
}

export async function fetchBlockMetrics(range: TimeRange) {
  try {
    const mappedRange = mapTimeRange(range);
    const response = await fetch(`${API_BASE_URL}/blocks/metrics?range=${mappedRange}`);
    return handleApiError(response, 'blocks/metrics', mappedRange);
  } catch (error) {
    console.error('Failed to fetch block metrics:', error);
    if (mapTimeRange(range) === '30d') {
      return { totalBlocks: 0, averageTransactionsPerBlock: 0, averageBlockTime: 0 };
    }
    throw new Error('Failed to fetch block metrics. Please check if the API server is running.');
  }
}

export async function fetchUniqueAccounts(range: TimeRange) {
  try {
    const mappedRange = mapTimeRange(range);
    const response = await fetch(`${API_BASE_URL}/stats/accounts/unique-count?range=${mappedRange}`);
    return handleApiError(response, 'stats/accounts/unique-count', mappedRange);
  } catch (error) {
    console.error('Failed to fetch unique accounts:', error);
    throw new Error('Failed to fetch unique accounts. Please check if the API server is running.');
  }
}

export async function fetchTopAccounts(range: TimeRange, limit = 10) {
  try {
    const mappedRange = mapTimeRange(range);
    const response = await fetch(`${API_BASE_URL}/accounts/top?range=${mappedRange}&limit=${limit}`);
    return handleApiError(response, 'accounts/top', mappedRange);
  } catch (error) {
    console.error('Failed to fetch top accounts:', error);
    if (mapTimeRange(range) === '30d') {
      return { topAccounts: [] };
    }
    throw new Error('Failed to fetch top accounts. Please check if the API server is running.');
  }
}

export async function fetchRecentTransactions(range: TimeRange, limit = 10) {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions?range=${mapTimeRange(range)}&limit=${limit}`);
    return handleApiError(response, 'transactions');
  } catch (error) {
    console.error('Failed to fetch recent transactions:', error);
    throw new Error('Failed to fetch recent transactions. Please check if the API server is running.');
  }
}

export async function fetchRecentBlocks(range: TimeRange, limit = 10) {
  try {
    const response = await fetch(`${API_BASE_URL}/blocks?range=${mapTimeRange(range)}&limit=${limit}`);
    return handleApiError(response, 'blocks');
  } catch (error) {
    console.error('Failed to fetch recent blocks:', error);
    throw new Error('Failed to fetch recent blocks. Please check if the API server is running.');
  }
}

export async function fetchUniqueAddressesTrend(range: TimeRange) {
  try {
    const mappedRange = mapTimeRange(range);
    const response = await fetch(`${API_BASE_URL}/stats?range=${mappedRange}`);
    return handleApiError(response, 'stats', mappedRange);
  } catch (error) {
    console.error('Failed to fetch unique addresses trend:', error);
    if (mapTimeRange(range) === '30d') {
      return { trend: [] };
    }
    throw new Error('Failed to fetch unique addresses trend. Please check if the API server is running.');
  }
}

// Maps UI time ranges to API parameters
function mapTimeRange(range: TimeRange): string {
  switch (range) {
    case '1d':
      return '1d';
    case '7d':
      return '7d';
    case '1m':
      return '1m';
    case 'all':
      return 'all';
    default:
      return '1d';
  }
}