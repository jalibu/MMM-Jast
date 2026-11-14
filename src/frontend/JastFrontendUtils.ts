import * as Log from 'logger'
import { Portfolio } from '../types/Portfolio'
import { StockResponse } from '../types/StockResponse'
import { Config } from '../types/Config'

interface CurrencyStyle {
  useGrouping: boolean
  style: 'currency' | 'decimal'
  currency?: string
  currencyDisplay: 'symbol' | 'narrowSymbol' | 'code' | 'name'
  minimumFractionDigits: number
  maximumFractionDigits: number
}

interface PercentStyle {
  useGrouping: boolean
  style: 'percent'
  minimumFractionDigits: number
}

type Trend = 'high' | 'low' | ''

/** A change (daily change, performance, ...) with everything a template needs to show it. */
interface Delta {
  trend: Trend
  sign: '+' | ''
  value: string
  percent: string
}

interface StockView {
  name: string
  visible: boolean
  value: string
  change: Delta
  performance: Delta
  performanceSum: string
  purchasePrice?: string
}

interface PortfolioView {
  value: string
  change: Delta
  performance: Delta
}

const JastUtils = {
  getCurrentValueStyle(config: Config): CurrencyStyle {
    return {
      style: config.showCurrency ? 'currency' : 'decimal',
      useGrouping: config.useGrouping,
      currencyDisplay: config.currencyStyle,
      minimumFractionDigits: config.numberDecimalsValues <= 8 ? config.numberDecimalsValues : 8,
      maximumFractionDigits: config.numberDecimalsValues <= 8 ? config.numberDecimalsValues : 8
    }
  },

  getChangeValueStyle(config: Config): CurrencyStyle {
    return {
      style: config.showChangeValueCurrency ? 'currency' : 'decimal',
      useGrouping: config.useGrouping,
      currencyDisplay: config.currencyStyle,
      minimumFractionDigits: config.numberDecimalsValues <= 8 ? config.numberDecimalsValues : 8,
      maximumFractionDigits: config.numberDecimalsValues <= 8 ? config.numberDecimalsValues : 8
    }
  },

  getPercentStyle(config: Config): PercentStyle {
    return {
      style: 'percent',
      useGrouping: config.useGrouping,
      minimumFractionDigits: config.numberDecimalsPercentages <= 8 ? config.numberDecimalsPercentages : 8
    }
  },

  getNumberOfDisplayedStocks(stocks: StockResponse[], config: Config): number {
    return config.showHiddenStocks ? stocks.length : stocks.filter((stock) => !stock.meta.hidden).length
  },

  /**
   * Returns one page of stocks, wrapping around to the start so the pages rotate endlessly.
   * @param stocks - All stocks
   * @param offset - Index of the first stock on the page
   * @param pageSize - Maximum number of stocks per page
   * @returns The stocks of the page
   */
  getStockPage(stocks: StockResponse[], offset: number, pageSize: number): StockResponse[] {
    const size = Math.min(pageSize, stocks.length)
    return Array.from({ length: size }, (_, i) => stocks[(offset + i) % stocks.length])
  },

  getTrend(delta: number): Trend {
    if (delta > 0) return 'high'
    if (delta < 0) return 'low'
    return ''
  },

  createDelta(delta: number, value: string, percent: string): Delta {
    const trend = JastUtils.getTrend(delta)
    return { trend, sign: trend === 'high' ? '+' : '', value, percent }
  },

  getStockView(stock: StockResponse, config: Config): StockView {
    return {
      name: JastUtils.getStockName(stock),
      visible: !stock.meta.hidden || config.showHiddenStocks,
      value: JastUtils.getCurrentValueAsString(stock, config),
      change: JastUtils.createDelta(
        JastUtils.getStockChange(stock),
        JastUtils.getStockChangeAsString(stock, config),
        JastUtils.getStockChangePercentAsString(stock, config)
      ),
      performance: JastUtils.createDelta(
        JastUtils.getStockPerformance(stock),
        JastUtils.getStockPerformanceAsString(stock, config),
        JastUtils.getStockPerformancePercentAsString(stock, config)
      ),
      performanceSum: JastUtils.getStockPerformanceSumAsString(stock, config),
      purchasePrice: stock.meta.purchasePrice ? JastUtils.getPurchasePriceAsString(stock, config) : undefined
    }
  },

  getPortfolioView(portfolio: Portfolio, config: Config): PortfolioView {
    return {
      value: JastUtils.getPortfolioValueAsString(portfolio, config),
      change: JastUtils.createDelta(
        portfolio.value - portfolio.oldValue,
        JastUtils.getPortfolioChangeAsString(portfolio, config),
        JastUtils.getPortfolioChangePercentAsString(portfolio, config)
      ),
      performance: JastUtils.createDelta(
        portfolio.value - portfolio.purchaseValue,
        JastUtils.getPortfolioPerformanceValueAsString(portfolio, config),
        JastUtils.getPortfolioPerformancePercentAsString(portfolio, config)
      )
    }
  },

  /**
   * Counts the list items of the vertical ticker: displayed stocks plus the optional portfolio and update lines.
   * @param stocks - All stocks
   * @param config - Module config
   * @returns The number of ticker items
   */
  getTickerItemCount(stocks: StockResponse[], config: Config): number {
    const hasPortfolio = config.showPortfolioValue || config.showPortfolioGrowth || config.showPortfolioGrowthPercent
    return JastUtils.getNumberOfDisplayedStocks(stocks, config) + Number(hasPortfolio) + Number(config.showLastUpdate)
  },

  getStockChange(stock: StockResponse): number {
    return stock.price?.regularMarketChange ?? 0
  },

  getStockPerformance(stock: StockResponse): number {
    return stock.meta.purchasePrice ? JastUtils.getCurrentValue(stock) - stock.meta.purchasePrice : 0
  },

  getStockPerformanceAsString(stock: StockResponse, config: Config): string {
    return JastUtils.getStockPerformance(stock).toLocaleString(
      config.locale,
      Object.assign(JastUtils.getChangeValueStyle(config), {
        currency: stock.price?.currency ?? 'USD'
      })
    )
  },

  getStockPerformanceSumAsString(stock: StockResponse, config: Config): string {
    return (JastUtils.getStockPerformance(stock) * (stock.meta.quantity ?? 0)).toLocaleString(
      config.locale,
      Object.assign(JastUtils.getChangeValueStyle(config), {
        currency: stock.price?.currency ?? 'USD'
      })
    )
  },

  getStockPerformancePercentAsString(stock: StockResponse, config: Config): string {
    const change = stock.meta.purchasePrice
      ? (JastUtils.getCurrentValue(stock) - stock.meta.purchasePrice) / stock.meta.purchasePrice
      : 0

    return change.toLocaleString(config.locale, JastUtils.getPercentStyle(config))
  },

  getStockChangePercent(stock: StockResponse): number {
    return stock.price?.regularMarketChangePercent ?? 0
  },

  getCurrentValue(stock: StockResponse): number {
    return stock.price?.regularMarketPrice ?? 0
  },

  getStockChangeAsString(stock: StockResponse, config: Config): string {
    return JastUtils.getStockChange(stock).toLocaleString(
      config.locale,
      Object.assign(JastUtils.getChangeValueStyle(config), {
        currency: stock.price?.currency ?? 'USD'
      })
    )
  },

  getStockChangePercentAsString(stock: StockResponse, config: Config): string {
    return JastUtils.getStockChangePercent(stock).toLocaleString(config.locale, JastUtils.getPercentStyle(config))
  },

  getCurrentValueAsString(stock: StockResponse, config: Config): string {
    return JastUtils.getCurrentValue(stock).toLocaleString(
      config.locale,
      Object.assign(JastUtils.getCurrentValueStyle(config), {
        currency: stock.price?.currency ?? 'USD'
      })
    )
  },

  getPurchasePriceAsString(stock: StockResponse, config: Config): string {
    return (stock.meta.purchasePrice ?? 0).toLocaleString(
      config.locale,
      Object.assign(JastUtils.getCurrentValueStyle(config), {
        currency: stock.price?.currency ?? 'USD'
      })
    )
  },

  getStockName(stock: StockResponse): string {
    return stock.meta.name || stock.price?.longName || ''
  },

  getPortfolioValueAsString(portfolio: Portfolio, config: Config): string {
    return portfolio.value.toLocaleString(
      config.locale,
      Object.assign(JastUtils.getCurrentValueStyle(config), {
        currency: portfolio.currency
      })
    )
  },

  getPortfolioPerformanceValueAsString(portfolio: Portfolio, config: Config): string {
    return (portfolio.value - portfolio.purchaseValue).toLocaleString(
      config.locale,
      Object.assign(JastUtils.getCurrentValueStyle(config), {
        currency: portfolio.currency
      })
    )
  },

  getPortfolioPerformancePercentAsString(portfolio: Portfolio, config: Config): string {
    const change = portfolio.purchaseValue ? (portfolio.value - portfolio.purchaseValue) / portfolio.purchaseValue : 0

    return change.toLocaleString(config.locale, JastUtils.getPercentStyle(config))
  },

  getPortfolioChangeAsString(portfolio: Portfolio, config: Config): string {
    const change = portfolio.value - portfolio.oldValue

    return change.toLocaleString(
      config.locale,
      Object.assign(JastUtils.getCurrentValueStyle(config), {
        currency: portfolio.currency
      })
    )
  },

  getPortfolioChangePercentAsString(portfolio: Portfolio, config: Config): string {
    const change = portfolio.oldValue ? (portfolio.value - portfolio.oldValue) / portfolio.oldValue : 0

    return change.toLocaleString(config.locale, JastUtils.getPercentStyle(config))
  },

  getPortfolio(stocks: StockResponse[], config: Config): Portfolio[] {
    const portfolio: Portfolio[] = []
    for (const stock of stocks) {
      try {
        const configStock = config.stocks?.find((current) => current.symbol === stock.meta?.symbol)
        if (configStock?.quantity && stock.price) {
          const currentStockValue = (stock.price.regularMarketPrice ?? 0) * configStock.quantity
          const lastStockValue =
            ((stock.price.regularMarketPrice ?? 0) - (stock.price.regularMarketChange ?? 0)) * configStock.quantity
          const existingCurrency = portfolio.find((growth) => growth.currency === stock.price?.currency)

          const purchaseValue = configStock.purchasePrice
            ? configStock.purchasePrice * configStock.quantity
            : currentStockValue

          if (existingCurrency) {
            existingCurrency.value += currentStockValue
            existingCurrency.oldValue += lastStockValue
            existingCurrency.purchaseValue += purchaseValue
          } else {
            portfolio.push({
              value: currentStockValue,
              purchaseValue,
              oldValue: lastStockValue,
              currency: stock.price.currency ?? ''
            })
          }
        }
      } catch (err) {
        Log.warn('There was a problem calculating the detpot growth', err)
      }
    }

    return portfolio
  }
}

export default JastUtils
