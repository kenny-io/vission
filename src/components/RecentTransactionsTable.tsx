import React from 'react';

interface RecentTransactionsTableProps {
  transactions: any[];
}

export const RecentTransactionsTable: React.FC<RecentTransactionsTableProps> = ({ transactions }) => {
  return (
    <div className="card p-6 mt-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-900">Recent Transactions</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="py-2 pr-4">Hash</th>
              <th className="py-2 pr-4">From</th>
              <th className="py-2 pr-4">To</th>
              <th className="py-2 pr-4">Value (ETH)</th>
              <th className="py-2">Block</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.tx_hash} className="border-b last:border-0">
                <td className="py-2 pr-4 font-mono text-xs text-primary-700 truncate max-w-[120px]">{tx.tx_hash}</td>
                <td className="py-2 pr-4 font-mono text-xs text-gray-700 truncate max-w-[100px]">{tx.from_address}</td>
                <td className="py-2 pr-4 font-mono text-xs text-gray-700 truncate max-w-[100px]">{tx.to_address}</td>
                <td className="py-2 pr-4">{(parseFloat(tx.value) / 1e18).toLocaleString(undefined, { maximumFractionDigits: 4 })}</td>
                <td className="py-2">{tx.block_number}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 