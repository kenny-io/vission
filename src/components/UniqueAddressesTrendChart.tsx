import React from 'react';
// If you have chart.js or recharts, import the Line chart. Otherwise, render a placeholder.
// import { Line } from 'react-chartjs-2';

interface UniqueAddressesTrendChartProps {
  trendData: any;
}

export const UniqueAddressesTrendChart: React.FC<UniqueAddressesTrendChartProps> = ({ trendData }) => {
  // Placeholder: expects trendData to have an array of { timestamp, uniqueAddresses }
  if (!trendData || !trendData.trend) {
    return null;
  }

  // Prepare data for chart.js or similar
  // const data = {
  //   labels: trendData.trend.map((d: any) => new Date(d.timestamp * 1000).toLocaleDateString()),
  //   datasets: [
  //     {
  //       label: 'Unique Addresses',
  //       data: trendData.trend.map((d: any) => d.uniqueAddresses),
  //       borderColor: '#6d28d9',
  //       backgroundColor: 'rgba(109,40,217,0.1)',
  //     },
  //   ],
  // };

  return (
    <div className="card p-6 mt-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-900">Unique Addresses Trend</h2>
      {/* Uncomment and use chart.js or recharts for a real chart */}
      {/* <Line data={data} /> */}
      <div className="text-gray-500">[Line chart of unique addresses over time would appear here]</div>
    </div>
  );
}; 