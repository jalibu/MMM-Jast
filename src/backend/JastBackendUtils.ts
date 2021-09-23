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
          quantity: config.stocks[index].quantity
        }
        stocks.push({ price: response.price, meta })
      } else {
        Log.warn(`Response for ${config.stocks[index].symbol} does not satisfy expected payload.`)
      }
    }

    return stocks
  }
}
