import * as NodeHelper from 'node_helper'
import yahooFinance from 'yahoo-finance2'
import { Config } from '../types/Config'
import { StockResponse } from '../types/StockResponse'

const sanityFields = [
  'regularMarketChange',
  'regularMarketChangePercent',
  'regularMarketPrice',
  'currency',
  'longName',
  'regularMarketPreviousClose'
]

module.exports = NodeHelper.create({
  start() {
    console.log(`${this.name} helper method started...`)
  },

  async requestStocks(config: Config): Promise<StockResponse[]> {
    const results = []
    for (const stock of config.stocks) {
      try {
        const { price } = await yahooFinance.quoteSummary(stock.symbol)
        if (price) {
          const meta = {
            symbol: stock.symbol,
            name: stock.name,
            quantity: stock.quantity
          }
          results.push({ price, meta })
        } else {
          console.warn(`Response for ${stock.symbol} does not satisfy expected payload.`)
        }
      } catch (err) {
        console.error('There was an error requesting the API.', err.message)
      }
    }

    return results
  },

  async socketNotificationReceived(notification, payload) {
    if (notification) {
      let stocks = await this.requestStocks(payload)

      stocks = stocks.filter((stock) =>
        sanityFields.every((item) => {
          if (Object.prototype.hasOwnProperty.call(stock.price, item)) {
            return true
          }
          console.warn(
            `Skipped symbol '${stock.meta.symbol}' as it's response did not have required property '${item}'. This is usually the case when a symbol is misspelled`
          )

          return false
        })
      )

      this.sendSocketNotification('STOCKS_RESULT', stocks)
    } else {
      console.warn(`${notification} is invalid notification`)
    }
  }
})
