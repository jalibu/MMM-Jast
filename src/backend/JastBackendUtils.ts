import * as Log from 'logger'
import yahooFinance from 'yahoo-finance2'
import { QuoteSummaryResult } from 'yahoo-finance2/dist/esm/src/modules/quoteSummary-iface'
import { Config } from '../types/Config'
import { StockResponse } from '../types/StockResponse'

export default class JastBackendUtils {
  static async requestStocks(config: Config): Promise<StockResponse[]> {
    const stocks = []
    const promises: Promise<QuoteSummaryResult>[] = []

    for (const stock of config.stocks) {
      promises.push(yahooFinance.quoteSummary(stock.symbol, { modules: ['price'] }))
    }

    const apiResponses = await Promise.all(promises.map((p) => p.catch((e) => e)))

    for (const [index, response] of apiResponses.entries()) {
      if (response instanceof Error) {
        Log.warn(`API request for ${config.stocks[index].symbol} failed:`, response.message)
      } else if (response.price) {
        const meta = {
          symbol: config.stocks[index].symbol,
          name: config.stocks[index].name,
          quantity: config.stocks[index].quantity,
          hidden: config.stocks[index].hidden
        }
        // Manually convert GBp to GBP
        if (response.price.currency === 'GBp') {
          response.price.regularMarketPrice /= 100
          response.price.regularMarketChange /= 100
          response.price.currency = 'GBP'
        }

        // Override changes if they are older than maxChangeAge
        if (config.maxChangeAge > 0) {
          const maxChangeAge = new Date().getTime() - config.maxChangeAge
          try {
            const lastChange = Date.parse(response.price.regularMarketTime)

            if (maxChangeAge > lastChange) {
              response.price.regularMarketPreviousClose = response.price?.regularMarketPrice
              response.price.regularMarketChange = 0
              response.price.regularMarketChangePercent = 0
            }
          } catch (err) {
            Log.warn('Could not parse lastChange date', err)
          }
        }

        stocks.push({ price: response.price, meta })
      } else {
        Log.warn(`Response for ${config.stocks[index].symbol} does not satisfy expected payload.`)
      }
    }

    return stocks
  }
}
