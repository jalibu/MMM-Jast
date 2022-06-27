import * as Log from 'logger'
import Utils from './JastFrontendUtils'
import { Config } from '../types/Config'

// Global or injected variable declarations
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const moment: any

Module.register<Config>('MMM-Jast', {
  defaults: {
    currencyStyle: 'code',
    fadeSpeedInSeconds: 3.5,
    lastUpdateFormat: 'HH:mm',
    locale: config.locale || 'en-GB',
    maxChangeAge: 1 * 24 * 60 * 60 * 1000,
    maxWidth: '100%',
    numberDecimalsPercentages: 1,
    numberDecimalsValues: 2,
    scroll: 'vertical',
    showColors: true,
    showCurrency: true,
    showChangePercent: true,
    showChangeValue: false,
    showChangeValueCurrency: false,
    showHiddenStocks: false,
    showLastUpdate: false,
    showPortfolioGrowth: false,
    showPortfolioGrowthPercent: false,
    showPortfolioValue: false,
    updateIntervalInSeconds: 600,
    useGrouping: false,
    virtualHorizontalMultiplier: 2,
    stocks: [
      { name: 'BASF', symbol: 'BAS.DE', quantity: 100 },
      { name: 'SAP', symbol: 'SAP.DE', quantity: 200 },
      { name: 'Henkel', symbol: 'HEN3.DE' },
      { name: 'AbbVie', symbol: '4AB.DE' },
      { name: 'Bitcoin', symbol: 'BTC-EUR' },
      { name: 'Alibaba', symbol: 'BABA' }
    ]
  },

  getScripts() {
    return ['moment.js']
  },

  getStyles() {
    return ['MMM-Jast.css']
  },

  getTranslations() {
    return {
      en: 'translations/en.json',
      de: 'translations/de.json'
    }
  },

  getTemplate() {
    return 'templates/MMM-Jast.njk'
  },

  getTemplateData() {
    return {
      config: this.config,
      stocks: this.state?.stocks,
      lastUpdate: moment(this.state?.lastUpdate).format(this.config.lastUpdateFormat),
      utils: Utils
    }
  },

  start() {
    this.loadData()
    this.scheduleUpdate()
    this.updateDom()
  },

  scheduleUpdate() {
    this.config.updateIntervalInSeconds =
      this.config.updateIntervalInSeconds < 120 ? 120 : this.config.updateIntervalInSeconds
    setInterval(() => {
      this.loadData()
    }, this.config.updateIntervalInSeconds * 1000)
  },

  loadData() {
    this.sendSocketNotification(`JAST_STOCKS_REQUEST-${this.identifier}`, this.config)
  },

  socketNotificationReceived(notificationIdentifier: string, payload: unknown) {
    if (notificationIdentifier === `JAST_STOCKS_RESPONSE-${this.identifier}`) {
      this.state = payload
      Log.log('JAST_STOCKS_RESPONSE', this.state)
      this.updateDom()
    }
  }
})
