// Format large numbers with commas
export const formatNumber = (num: number, decimals = 0): string => {
  return new Intl.NumberFormat('en-US', { 
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals
  }).format(num);
};

// Format currency values
export const formatCurrency = (num: number): string => {
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(2)}B`;
  } else if (num >= 1000000) {
    return `${(num / 1000000).toFixed(2)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(2)}K`;
  }
  return num.toString();
};

// Format large gas values to more readable format
export const formatGas = (gas: number): string => {
  if (gas >= 1000000000000000) {
    return `${(gas / 1000000000000000).toFixed(2)} PGAS`;
  } else if (gas >= 1000000000000) {
    return `${(gas / 1000000000000).toFixed(2)} TGAS`;
  } else if (gas >= 1000000000) {
    return `${(gas / 1000000000).toFixed(2)} GGAS`;
  } else if (gas >= 1000000) {
    return `${(gas / 1000000).toFixed(2)} MGAS`;
  } else if (gas >= 1000) {
    return `${(gas / 1000).toFixed(2)} KGAS`;
  }
  return `${gas} GAS`;
};

// Format percentage
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};