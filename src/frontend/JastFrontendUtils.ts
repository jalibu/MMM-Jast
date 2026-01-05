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

  getStockChange(stock: StockResponse): number {
    return stock.price?.regularMarketChange
  },

  getStockPerformance(stock: StockResponse): number {
    return stock.meta.purchasePrice ? JastUtils.getCurrentValue(stock) - stock.meta.purchasePrice : 0
  },

  getStockPerformanceAsString(stock: StockResponse, config: Config): string {
    return JastUtils.getStockPerformance(stock).toLocaleString(
      config.locale,
      Object.assign(JastUtils.getChangeValueStyle(config), {
        currency: stock.price.currency
      })
    )
  },

  getStockPerformanceSumAsString(stock: StockResponse, config: Config): string {
    return (JastUtils.getStockPerformance(stock) * stock.meta.quantity).toLocaleString(
      config.locale,
      Object.assign(JastUtils.getChangeValueStyle(config), {
        currency: stock.price.currency
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
    return stock.price?.regularMarketChangePercent
  },

  getCurrentValue(stock: StockResponse): number {
    return stock.price?.regularMarketPrice
  },

  getStockChangeAsString(stock: StockResponse, config: Config): string {
    return JastUtils.getStockChange(stock).toLocaleString(
      config.locale,
      Object.assign(JastUtils.getChangeValueStyle(config), {
        currency: stock.price.currency
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
        currency: stock.price.currency
      })
    )
  },

  getPurchasePriceAsString(stock: StockResponse, config: Config): string {
    return stock.meta.purchasePrice.toLocaleString(
      config.locale,
      Object.assign(JastUtils.getCurrentValueStyle(config), {
        currency: stock.price.currency
      })
    )
  },

  getStockName(stock: StockResponse): string {
    return stock.meta.name || stock.price.longName
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
    const change = (portfolio.value - portfolio.purchaseValue) / portfolio.purchaseValue

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
    const change = (portfolio.value - portfolio.oldValue) / portfolio.oldValue

    return change.toLocaleString(config.locale, JastUtils.getPercentStyle(config))
  },

  getPortfolio(stocks: StockResponse[], config: Config): Portfolio[] {
    const portfolio: Portfolio[] = []
    for (const stock of stocks) {
      try {
        const configStock = config.stocks?.find((current) => current.symbol === stock.meta?.symbol)
        if (configStock?.quantity) {
          const currentStockValue = stock.price?.regularMarketPrice * configStock.quantity
          const lastStockValue =
            (stock.price?.regularMarketPrice - stock.price?.regularMarketChange) * configStock.quantity
          const existingCurrency = portfolio.find((growth) => growth.currency === stock.price.currency)

          const purchaseValue = configStock.purchasePrice
            ? configStock.purchasePrice * configStock.quantity
            : currentStockValue * configStock.quantity

          if (existingCurrency) {
            existingCurrency.value += currentStockValue
            existingCurrency.oldValue += lastStockValue
            existingCurrency.purchaseValue += purchaseValue
          } else {
            portfolio.push({
              value: currentStockValue,
              purchaseValue,
              oldValue: lastStockValue,
              currency: stock.price.currency
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
