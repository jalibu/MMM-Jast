import * as NodeHelper from 'node_helper'
import { Config } from '../models/Config'
import yahooFinance from 'yahoo-finance2'
import { StockResponse } from '../models/StockResponse'

module.exports = NodeHelper.create({
  start() {
    console.log(`${this.name} helper method started...`)
  },

  async requestStocks(config: Config): Promise<StockResponse[]> {
    let results = []
    for (const stock of config.stocks) {
      try {
        const { summaryDetail, price } = await yahooFinance.quoteSummary(
          stock.symbol
        )
        if (summaryDetail && price) {
          const meta = {
            symbol: stock.symbol,
            name: stock.name,
            quantity: stock.quantity
          }
          results.push({ summaryDetail, price, meta })
        }
      } catch (err) {
        console.error('There was an error requesting the API.', err.message)
      }
    }

    return results
  },

  async socketNotificationReceived(notification, config) {
    if (notification) {
      const stocks = await this.requestStocks(config)

      this.sendSocketNotification('STOCKS_RESULT', stocks)
    } else {
      console.warn(`${notification} is invalid notification`)
    }
  }
})
