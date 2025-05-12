import React from 'react';
import { Copy, ExternalLink } from 'lucide-react';

interface TopAccountsTableProps {
  accounts: { address: string; netValue: string }[];
}

type RankIconProps = {
  rank: number;
};

const RankIcon: React.FC<RankIconProps> = ({ rank }) => {
  if (rank === 1) {
    return <div className="flex items-center justify-center w-6 h-6 bg-yellow-100 rounded-full">🥇</div>;
  } else if (rank === 2) {
    return <div className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full">🥈</div>;
  } else if (rank === 3) {
    return <div className="flex items-center justify-center w-6 h-6 bg-amber-100 rounded-full">🥉</div>;
  } else {
    return <div className="flex items-center justify-center w-6 h-6 text-gray-500">{rank}</div>;
  }
};

export const TopAccountsTable: React.FC<TopAccountsTableProps> = ({ accounts }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const openExplorer = (address: string) => {
    window.open(`https://explorer.shardeum.org/account/${address}`, '_blank');
  };

  // Format address to show first 6 and last 4 characters
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Format SHM value with appropriate suffix
  const formatSHM = (value: string) => {
    const valueInSHM = parseFloat(value) / 1e18;
    
    if (valueInSHM >= 1000000) {
      return `${(valueInSHM / 1000000).toFixed(2)}M SHM`;
    } else if (valueInSHM >= 1000) {
      return `${(valueInSHM / 1000).toFixed(2)}K SHM`;
    } else {
      return `${valueInSHM.toFixed(2)} SHM`;
    }
  };

  // Calculate percentage based on total value of all accounts
  const totalValue = accounts.reduce((sum, acc) => sum + parseFloat(acc.netValue), 0);
  
  return (
    <div className="card p-6 mt-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-900">Top SHM Holders</h2>
      {/* <div className="text-xs text-gray-500 text-right mb-1">Updated recently</div> */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="py-2 px-4">Rank</th>
              <th className="py-2 px-4">Address</th>
              <th className="py-2 px-4">Balance</th>
              <th className="py-2 px-4">Percentage</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((acc, idx) => {
              const percentage = totalValue > 0 ? (parseFloat(acc.netValue) / totalValue) * 100 : 0;
              return (
                <tr key={acc.address} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <RankIcon rank={idx + 1} />
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-primary-600">
                    {formatAddress(acc.address)}
                  </td>
                  <td className="py-3 px-4 font-medium">
                    {formatSHM(acc.netValue)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-1.5 mr-2">
                        <div 
                          className="bg-primary-500 h-1.5 rounded-full" 
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                      <span>{percentage.toFixed(2)}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => copyToClipboard(acc.address)}
                        className="p-1 text-gray-500 hover:text-primary-600 transition-colors"
                        title="Copy address"
                      >
                        <Copy size={16} />
                      </button>
                      <button 
                        onClick={() => openExplorer(acc.address)}
                        className="p-1 text-gray-500 hover:text-primary-600 transition-colors"
                        title="View on explorer"
                      >
                        <ExternalLink size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 