import { DepotGrowth } from "../models/DepotGrowth";
import { StockResponse } from "../models/StockResponse"
import { Config } from "../models/Config"

export default class JastUtils {
  static getStockChange(stock: StockResponse, config: Config): number {
    return Number((stock.price?.regularMarketChange).toFixed(config.numberDecimalsValues)) || 0
  }

  static getStockChangePercent(stock: StockResponse, config: Config): number {
    return Number((stock.price?.regularMarketChangePercent * 100).toFixed(config.numberDecimalsPercentages)) || 0
  }

  static getCurrentValue(stock: StockResponse, config: Config): number {
    return Number(stock.price?.regularMarketPrice?.toFixed(config.numberDecimalsValues)) || 0
  }

  static getCurrency(stock: StockResponse): string {
    return stock.summaryDetail?.currency || "?"
  }

  static getStockName(stock: StockResponse): string {
    return stock.meta.name || stock.price.longName
  }

  static getDepotGrowth(stocks: StockResponse[], config: Config): DepotGrowth[] {
    let depotGrowth: DepotGrowth[] = []
    for (const stock of stocks) {
      try {
        const configStock = config.stocks?.find(current => current.symbol === stock.meta?.symbol)
        if (configStock?.quantity) {
          const growthForStock = stock.price?.regularMarketChange * configStock.quantity
          const existingCurrency = depotGrowth.find(growth => growth.currency === stock.price.currency)
          if (existingCurrency) {
            existingCurrency.value = existingCurrency.value + growthForStock
          } else {
            depotGrowth.push({ value: growthForStock, currency: stock.price.currency })
          }
        }
      } catch (err) {
        console.warn('There was a problem calculating the detpot growth', err)
      }

    }

    depotGrowth.forEach(growth => {
      growth.value = Number(growth.value.toFixed(config.numberDecimalsValues))
    })
    return depotGrowth
  }
}
