import * as NodeHelper from 'node_helper'
import * as Log from 'logger'
import { State } from '../types/State'
import JastBackendUtils from './JastBackendUtils'

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
    Log.log(`${this.name} helper method started...`)
  },

  async socketNotificationReceived(notification, payload) {
    if (notification.includes('JAST_STOCKS_REQUEST')) {
      const identifier = notification.substring('JAST_STOCKS_REQUEST'.length + 1)
      let stocks = await JastBackendUtils.requestStocks(payload)

      stocks = stocks.filter((stock) =>
        sanityFields.every((item) => {
          if (Object.prototype.hasOwnProperty.call(stock.price, item)) {
            return true
          }
          Log.warn(
            `Skipped symbol '${stock.meta.symbol}' as it's response did not have required property '${item}'. This is usually the case when a symbol is misspelled`
          )

          return false
        })
      )

      const response: State = {
        lastUpdate: Date.now(),
        stocks
      }

      this.sendSocketNotification(`JAST_STOCKS_RESPONSE-${identifier}`, response)
    } else {
      Log.warn(`${notification} is invalid notification`)
    }
  }
})
