export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:6423/api/admin';
export const CURRENCY_SYMBOL = 'Rs.';

export function formatCurrency(amount, decimals = 2) {
  const num = Number(amount || 0);
  return `${CURRENCY_SYMBOL} ${num.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}
