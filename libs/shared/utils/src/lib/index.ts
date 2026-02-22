/**
 * Shared utility functions and helpers
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}
