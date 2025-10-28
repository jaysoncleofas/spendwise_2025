/**
 * Currency formatting utilities
 * Provides accurate currency symbols and formatting across the application
 */

// Currency symbol mapping
export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'C$',
  AUD: 'A$',
  CHF: 'CHF',
  CNY: '¥',
  INR: '₹',
  MXN: 'MX$',
  PHP: '₱',
  SGD: 'S$',
  HKD: 'HK$',
  KRW: '₩',
  THB: '฿',
  VND: '₫',
}

/**
 * Get currency symbol for a given currency code
 * @param currencyCode - ISO currency code (e.g., 'USD', 'EUR')
 * @returns Currency symbol (e.g., '$', '€')
 */
export function getCurrencySymbol(currencyCode: string): string {
  return CURRENCY_SYMBOLS[currencyCode] || currencyCode
}

/**
 * Format amount with correct currency symbol
 * @param amount - Numeric amount to format
 * @param currencyCode - ISO currency code
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string (e.g., '$100.00', '€50.50', '₱1,000.00')
 */
export function formatCurrency(amount: number, currencyCode: string = 'USD', decimals: number = 2): string {
  const symbol = getCurrencySymbol(currencyCode)
  const formattedAmount = amount.toFixed(decimals)
  
  // For currencies that typically use symbol after amount
  const suffixCurrencies = ['EUR']
  
  if (suffixCurrencies.includes(currencyCode)) {
    return `${formattedAmount}${symbol}`
  }
  
  return `${symbol}${formattedAmount}`
}

/**
 * Format amount with thousands separator
 * @param amount - Numeric amount to format
 * @param currencyCode - ISO currency code
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string with commas (e.g., '$1,000.00', '₱10,000.00')
 */
export function formatCurrencyWithCommas(amount: number, currencyCode: string = 'USD', decimals: number = 2): string {
  const symbol = getCurrencySymbol(currencyCode)
  const parts = amount.toFixed(decimals).split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const formattedAmount = parts.join('.')
  
  // For currencies that typically use symbol after amount
  const suffixCurrencies = ['EUR']
  
  if (suffixCurrencies.includes(currencyCode)) {
    return `${formattedAmount}${symbol}`
  }
  
  return `${symbol}${formattedAmount}`
}

/**
 * Format amount for display in wallets (with currency code)
 * @param amount - Numeric amount to format
 * @param currencyCode - ISO currency code
 * @returns Formatted string (e.g., '$100.00 USD', '₱1,000.00 PHP')
 */
export function formatWalletAmount(amount: number, currencyCode: string = 'USD'): string {
  return `${formatCurrencyWithCommas(amount, currencyCode)} ${currencyCode}`
}

/**
 * Get all supported currencies
 * @returns Array of currency objects with code, name, and symbol
 */
export function getAllCurrencies() {
  return [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$' },
    { code: 'PHP', name: 'Philippine Peso', symbol: '₱' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
    { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
    { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
    { code: 'THB', name: 'Thai Baht', symbol: '฿' },
    { code: 'VND', name: 'Vietnamese Dong', symbol: '₫' },
  ]
}

