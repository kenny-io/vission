import React from 'react';

interface LineChartProps {
  data: {
    day: string;
    value: number;
    highlighted?: boolean;
  }[];
  className?: string;
}

export const LineChart: React.FC<LineChartProps> = ({ 
  data, 
  className = '' 
}) => {
  // Simple SVG line chart
  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));
  const range = maxValue - minValue;
  
  // Create points for the SVG path
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((item.value - minValue) / range) * 100;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <div className={`h-full ${className}`}>
      <svg 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none" 
        className="w-full h-full"
      >
        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Highlighted points */}
        {data.map((item, index) => {
          if (item.highlighted) {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - ((item.value - minValue) / range) * 100;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill="#3b82f6"
                stroke="#fff"
                strokeWidth="1"
              />
            );
          }
          return null;
        })}
      </svg>
      
      <div className="mt-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
        {data.map((item, index) => (
          <div 
            key={index} 
            className={`${item.highlighted ? 'font-semibold text-blue-500' : ''}`}
          >
            {item.day}
          </div>
        ))}
      </div>
    </div>
  );
};
