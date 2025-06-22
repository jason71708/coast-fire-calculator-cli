export const sleep = (ms = 2000) => new Promise((resolve) => setTimeout(resolve, ms));

// Function to format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
