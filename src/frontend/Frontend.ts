import * as Log from 'logger'
import Utils from './JastFrontendUtils'
import { Config } from '../types/Config'

Module.register<Config>('MMM-Jast', {
  defaults: {
    locale: config.locale || 'en-GB',
    updateIntervalInSeconds: 600,
    useGrouping: false,
    currencyStyle: 'code',
    fadeSpeedInSeconds: 3.5,
    stocks: [
      { name: 'BASF', symbol: 'BAS.DE', quantity: 100 },
      { name: 'SAP', symbol: 'SAP.DE', quantity: 200 },
      { name: 'Henkel', symbol: 'HEN3.DE' },
      { name: 'AbbVie', symbol: '4AB.DE' },
      { name: 'Bitcoin', symbol: 'BTC-EUR' },
      { name: 'Alibaba', symbol: 'BABA' }
    ],
    scroll: 'vertical',
    maxWidth: '100%',
    numberDecimalsValues: 2,
    numberDecimalsPercentages: 1,
    showColors: true,
    showCurrency: true,
    showChangePercent: true,
    showChangeValue: false,
    showChangeValueCurrency: false,
    showPortfolioValue: false,
    showPortfolioGrowth: false,
    showPortfolioGrowthPercent: false,
    virtualHorizontalMultiplier: 2
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
    const utils = new Utils(this.config)

    return {
      config: this.config,
      stocks: this.stocks,
      utils
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
    this.sendSocketNotification('JAST_STOCKS_REQUEST', this.config)
  },

  socketNotificationReceived(notificationIdentifier: string, payload: unknown) {
    if (notificationIdentifier === 'JAST_STOCKS_RESPONSE') {
      this.stocks = payload
      Log.log('Stocks', this.stocks)
      this.updateDom()
    }
  }
})
