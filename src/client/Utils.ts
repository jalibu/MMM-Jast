import { Depot } from '../models/Depot'
import { StockResponse } from '../models/StockResponse'
import { Config } from '../models/Config'

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
      minimumFractionDigits:
        config.numberDecimalsValues <= 8 ? config.numberDecimalsValues : 8
    }

    this.changeValueStyle = {
      style: config.showChangeValueCurrency ? 'currency' : 'decimal',
      useGrouping: config.useGrouping,
      currencyDisplay: config.currencyStyle,
      minimumFractionDigits:
        config.numberDecimalsValues <= 8 ? config.numberDecimalsValues : 8
    }

    this.percentStyle = {
      style: 'percent',
      useGrouping: config.useGrouping,
      minimumFractionDigits:
        config.numberDecimalsPercentages <= 8
          ? config.numberDecimalsPercentages
          : 8
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
    return this.getStockChangePercent(stock).toLocaleString(
      this.config.locale,
      this.percentStyle
    )
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

  getDepotValueAsString(depot: Depot) {
    return depot.value.toLocaleString(
      this.config.locale,
      Object.assign(this.currentValueStyle, {
        currency: depot.currency
      })
    )
  }

  getDepotChangeAsString(depot: Depot) {
    const change = depot.value - depot.oldValue
    return change.toLocaleString(
      this.config.locale,
      Object.assign(this.currentValueStyle, {
        currency: depot.currency
      })
    )
  }

  getDepotChangePercentAsString(depot: Depot): string {
    const change = (depot.value - depot.oldValue) / depot.oldValue
    return change.toLocaleString(
      this.config.locale,
      this.percentStyle
    )
  }
  

  getDepot(stocks: StockResponse[]): Depot[] {
    let depot: Depot[] = []
    for (const stock of stocks) {
      try {
        const configStock = this.config.stocks?.find(
          (current) => current.symbol === stock.meta?.symbol
        )
        if (configStock?.quantity) {
          const currentStockValue =
            stock.price?.regularMarketPrice * configStock.quantity
          const lastStockValue =
            stock.price?.regularMarketPreviousClose * configStock.quantity
          const existingCurrency = depot.find(
            (growth) => growth.currency === stock.price.currency
          )
          
          if (existingCurrency) {
            existingCurrency.value = existingCurrency.value + currentStockValue
            existingCurrency.oldValue = existingCurrency.oldValue + lastStockValue
          } else {
            depot.push({
              value: currentStockValue,
              oldValue: lastStockValue,
              currency: stock.price.currency
            })
          }
        }
      } catch (err) {
        console.warn('There was a problem calculating the detpot growth', err)
      }
    }

    console.debug("Depot", depot)
    return depot
  }
}
