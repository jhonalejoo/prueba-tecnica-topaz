import { NativeModules } from 'react-native';

export function calculateDiscountedPrice(
  price: number,
  discountPercentage: number,
): number {
  return price * (1 - discountPercentage / 100);
}

type CurrencyFormatterNativeModule = {
  formatCurrencySync?: (value: number) => string;
};

export function formatCurrency(value: number): string {
  const module = NativeModules.CurrencyFormatterModule as
    | CurrencyFormatterNativeModule
    | undefined;

  if (module?.formatCurrencySync) {
    return module.formatCurrencySync(value);
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value);
}
