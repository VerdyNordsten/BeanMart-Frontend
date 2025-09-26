/**
 * Currency formatting utilities
 */

export interface CurrencyConfig {
  symbol: string;
  position: 'before' | 'after';
  decimalPlaces: number;
  thousandsSeparator: string;
  decimalSeparator: string;
}

const CURRENCY_CONFIGS: Record<string, CurrencyConfig> = {
  USD: {
    symbol: '$',
    position: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.'
  },
  IDR: {
    symbol: 'Rp',
    position: 'before',
    decimalPlaces: 0,
    thousandsSeparator: '.',
    decimalSeparator: ','
  },
  EUR: {
    symbol: '€',
    position: 'after',
    decimalPlaces: 2,
    thousandsSeparator: '.',
    decimalSeparator: ','
  }
};

/**
 * Format a price with the appropriate currency symbol and formatting
 * @param amount - The numeric amount to format
 * @param currency - The currency code (USD, IDR, EUR)
 * @returns Formatted price string
 */
export const formatPrice = (amount: number | string, currency: string = 'USD'): string => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numericAmount)) {
    return '0';
  }

  const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.USD;
  
  // Format the number with appropriate decimal places
  const formattedNumber = numericAmount.toLocaleString('en-US', {
    minimumFractionDigits: config.decimalPlaces,
    maximumFractionDigits: config.decimalPlaces
  });

  // Apply thousands and decimal separators based on currency
  let finalNumber = formattedNumber;
  if (currency === 'IDR') {
    finalNumber = formattedNumber.replace(/,/g, '.');
  } else if (currency === 'EUR') {
    finalNumber = formattedNumber.replace(/,/g, '.');
  }

  // Add currency symbol
  if (config.position === 'before') {
    return `${config.symbol}${finalNumber}`;
  } else {
    return `${finalNumber} ${config.symbol}`;
  }
};

/**
 * Format a price range with currency
 * @param minPrice - Minimum price
 * @param maxPrice - Maximum price  
 * @param currency - Currency code
 * @returns Formatted price range string
 */
export const formatPriceRange = (
  minPrice: number | string, 
  maxPrice: number | string, 
  currency: string = 'USD'
): string => {
  const formattedMin = formatPrice(minPrice, currency);
  const formattedMax = formatPrice(maxPrice, currency);
  
  return `${formattedMin} - ${formattedMax}`;
};

/**
 * Get currency symbol only
 * @param currency - Currency code
 * @returns Currency symbol
 */
export const getCurrencySymbol = (currency: string = 'USD'): string => {
  const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.USD;
  return config.symbol;
};
