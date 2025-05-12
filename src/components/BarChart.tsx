import React from 'react';

interface BarChartProps {
  data: {
    period?: string;
    year?: string;
    value: number;
    highlighted?: boolean;
  }[];
  maxValue?: number;
  className?: string;
}

export const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  maxValue = 800, 
  className = '' 
}) => {
  // Find the maximum value to scale the chart
  const chartMaxValue = maxValue || Math.max(...data.map(item => item.value));
  
  return (
    <div className={`h-full flex flex-col ${className}`}>
      <div className="flex-1 flex items-end space-x-4">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="w-full relative h-full flex items-end">
              <div 
                className={`w-full rounded-t-lg ${item.highlighted ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                style={{ 
                  height: `${(item.value / chartMaxValue) * 100}%`,
                  minHeight: '4px'
                }}
              >
                {item.highlighted && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {item.value}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">{item.period || item.year}</div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <div>0</div>
        <div>${maxValue}</div>
      </div>
    </div>
  );
};
