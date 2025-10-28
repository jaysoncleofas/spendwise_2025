/**
 * Composable for currency formatting
 * Auto-imports in Nuxt 3 - use anywhere without import statement
 */

import { getCurrencySymbol, formatCurrency, formatCurrencyWithCommas, formatWalletAmount } from '~/utils/currency'

export const useCurrency = () => {
  /**
   * Get the default currency from wallets or user preference
   * Falls back to USD if no wallet currency is found
   */
  const getDefaultCurrency = (): string => {
    // SSR-safe: only access stores on client side
    if (!process.client) {
      return 'USD'
    }
    
    try {
      const walletsStore = useWalletsStore()
      
      // Get currency from first wallet, or default to USD
      if (walletsStore.wallets && walletsStore.wallets.length > 0) {
        return walletsStore.wallets[0].currency || 'USD'
      }
    } catch (e) {
      // If store is not available, return default
      return 'USD'
    }
    
    return 'USD'
  }

  /**
   * Format a transaction amount with the appropriate currency
   * If wallet is available, use wallet's currency, otherwise use default
   */
  const formatTransactionAmount = (amount: number, walletCurrency?: string): string => {
    const currency = walletCurrency || getDefaultCurrency()
    return formatCurrencyWithCommas(amount, currency)
  }

  return {
    getCurrencySymbol,
    formatCurrency,
    formatCurrencyWithCommas,
    formatWalletAmount,
    getDefaultCurrency,
    formatTransactionAmount,
  }
}

