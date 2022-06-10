import * as Log from 'logger'
import { Portfolio } from '../types/Portfolio'
import { StockResponse } from '../types/StockResponse'
import { Config } from '../types/Config'

type CurrencyStyle = {
  useGrouping: boolean
  style: string
  currency?: string
  currencyDisplay: string
  minimumFractionDigits: number
}

type PercentStyle = {
  useGrouping: boolean
  style?: string
  minimumFractionDigits: number
}

export default class JastUtils {
  config: Config
  currentValueStyle: CurrencyStyle
  changeValueStyle: CurrencyStyle
  percentStyle: PercentStyle

  constructor(config: Config) {
    this.config = config

    this.currentValueStyle = {
      style: config.showCurrency ? 'currency' : 'decimal',
      useGrouping: config.useGrouping,
      currencyDisplay: config.currencyStyle,
      minimumFractionDigits: config.numberDecimalsValues <= 8 ? config.numberDecimalsValues : 8
    }

    this.changeValueStyle = {
      style: config.showChangeValueCurrency ? 'currency' : 'decimal',
      useGrouping: config.useGrouping,
      currencyDisplay: config.currencyStyle,
      minimumFractionDigits: config.numberDecimalsValues <= 8 ? config.numberDecimalsValues : 8
    }

    this.percentStyle = {
      style: 'percent',
      useGrouping: config.useGrouping,
      minimumFractionDigits: config.numberDecimalsPercentages <= 8 ? config.numberDecimalsPercentages : 8
    }
  }

  getStockChange(stock: StockResponse): number {
    return stock.price?.regularMarketChange
  }

  getStockChangePercent(stock: StockResponse): number {
    return stock.price?.regularMarketChangePercent
  }

  getCurrentValue(stock: StockResponse): number {
    return stock.price?.regularMarketPrice
  }

  getStockChangeAsString(stock: StockResponse): string {
    return this.getStockChange(stock).toLocaleString(
      this.config.locale,
      Object.assign(this.changeValueStyle, {
        currency: stock.price.currency
      })
    )
  }

  getStockChangePercentAsString(stock: StockResponse): string {
    return this.getStockChangePercent(stock).toLocaleString(this.config.locale, this.percentStyle)
  }

  getCurrentValueAsString(stock: StockResponse): string {
    return this.getCurrentValue(stock).toLocaleString(
      this.config.locale,
      Object.assign(this.currentValueStyle, {
        currency: stock.price.currency
      })
    )
  }

  getStockName(stock: StockResponse): string {
    return stock.meta.name || stock.price.longName
  }

  getPortfolioValueAsString(portfolio: Portfolio): string {
    return portfolio.value.toLocaleString(
      this.config.locale,
      Object.assign(this.currentValueStyle, {
        currency: portfolio.currency
      })
    )
  }

  getPortfolioChangeAsString(portfolio: Portfolio): string {
    const change = portfolio.value - portfolio.oldValue

    return change.toLocaleString(
      this.config.locale,
      Object.assign(this.currentValueStyle, {
        currency: portfolio.currency
      })
    )
  }

  getPortfolioChangePercentAsString(portfolio: Portfolio): string {
    const change = (portfolio.value - portfolio.oldValue) / portfolio.oldValue

    return change.toLocaleString(this.config.locale, this.percentStyle)
  }

  getPortfolio(stocks: StockResponse[]): Portfolio[] {
    const portfolio: Portfolio[] = []
    for (const stock of stocks) {
      try {
        const configStock = this.config.stocks?.find((current) => current.symbol === stock.meta?.symbol)
        if (configStock?.quantity) {
          const currentStockValue = stock.price?.regularMarketPrice * configStock.quantity
          const lastStockValue =
            (stock.price?.regularMarketPrice - stock.price?.regularMarketChange) * configStock.quantity
          const existingCurrency = portfolio.find((growth) => growth.currency === stock.price.currency)

          if (existingCurrency) {
            existingCurrency.value += currentStockValue
            existingCurrency.oldValue += lastStockValue
          } else {
            portfolio.push({
              value: currentStockValue,
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
