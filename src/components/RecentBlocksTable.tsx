import React from 'react';

interface RecentBlocksTableProps {
  blocks: any[];
}

export const RecentBlocksTable: React.FC<RecentBlocksTableProps> = ({ blocks }) => {
  return (
    <div className="card p-6 mt-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-900">Recent Blocks</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="py-2 pr-4">Block #</th>
              <th className="py-2 pr-4">Miner</th>
              <th className="py-2 pr-4">Tx Count</th>
              <th className="py-2">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {blocks.map((block) => (
              <tr key={block.block_number} className="border-b last:border-0">
                <td className="py-2 pr-4 font-mono text-xs text-primary-700">{block.block_number}</td>
                <td className="py-2 pr-4 font-mono text-xs text-gray-700 truncate max-w-[100px]">{block.miner}</td>
                <td className="py-2 pr-4">{block.transaction_count}</td>
                <td className="py-2">{new Date(block.timestamp * 1000).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 