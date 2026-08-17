export function calculateDiscountedPrice(
  price: number,
  discountPercentage: number,
): number {
  return price * (1 - discountPercentage / 100);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value);
}
