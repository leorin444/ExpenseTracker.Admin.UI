export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (
  typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? 'https://adminapi.raminshrestha.com.np/api/admin'
    : 'http://localhost:6423/api/admin'
);
export const CURRENCY_SYMBOL = 'Rs.';

export function formatCurrency(amount, decimals = 2) {
  const num = Number(amount || 0);
  return `${CURRENCY_SYMBOL} ${num.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}
