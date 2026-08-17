import { calculateDiscountedPrice, formatCurrency } from '../utils';

describe('product utils', () => {
  it('calculates the discounted price with percentage applied', () => {
    expect(calculateDiscountedPrice(100, 25)).toBe(75);
    expect(calculateDiscountedPrice(59.99, 10)).toBeCloseTo(53.991, 3);
  });

  it('formats currency in USD', () => {
    expect(formatCurrency(1099.99)).toBe('$1,099.99');
    expect(formatCurrency(9)).toBe('$9.00');
  });
});
