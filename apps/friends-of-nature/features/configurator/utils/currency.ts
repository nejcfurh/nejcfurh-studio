export type Currency = 'USD' | 'EUR' | 'GBP';

export interface CurrencyConfig {
  symbol: string;
  rate: number; // Exchange rate from USD
}

export const CURRENCY_CONFIG: Record<Currency, CurrencyConfig> = {
  USD: {
    symbol: '$',
    rate: 1
  },
  EUR: {
    symbol: '€',
    rate: 1 // Example rate USD to EUR
  },
  GBP: {
    symbol: '£',
    rate: 1 // Example rate USD to GBP
  }
};

export const convertPrice = (
  priceUSD: number,
  targetCurrency: Currency
): number => {
  const config = CURRENCY_CONFIG[targetCurrency];

  return Math.round(priceUSD * config.rate);
};

export const formatPrice = (price: number, currency: Currency): string => {
  const config = CURRENCY_CONFIG[currency];

  return `${config.symbol}${price}`;
};

export const detectUserCurrency = async (): Promise<Currency> => {
  try {
    const response = await fetch('/api/detect-currency');

    if (!response.ok) {
      return 'USD';
    }

    const { currency } = await response.json();

    return currency as Currency;
  } catch (error) {
    console.error(
      'Error detecting currency:',
      error instanceof Error ? error.message : error
    );

    return 'USD';
  }
};
