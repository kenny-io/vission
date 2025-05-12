export type TimeRange = '1d' | '7d' | '1m' | 'all';

export interface BlockchainMetric {
  transactions: number;
  valueTransacted: number;
  uniqueAccounts: number;
  blocksProduced: number;
  gasSpent: number;
}

export interface TransactionDistribution {
  transfer: { count: number; percentage: number };
  stake: { count: number; percentage: number };
  unstake: { count: number; percentage: number };
}

export interface BackfillProgress {
  percentage: number;
  blocksProcessed: number;
  blocksRemaining: number;
}

export interface BlockchainData {
  metrics: BlockchainMetric;
  transactionDistribution: TransactionDistribution;
  backfillProgress: BackfillProgress;
}