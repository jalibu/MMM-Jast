import Utils from './Utils'
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
      stocks: this._stocks,
      utils
    }
  },

  start() {
    this.loadData()
    this.scheduleUpdate()
    this.updateDom()
  },

  scheduleUpdate() {
    const self = this
    this.config.updateIntervalInSeconds =
      this.config.updateIntervalInSeconds < 120 ? 120 : this.config.updateIntervalInSeconds
    setInterval(() => {
      self.loadData()
    }, this.config.updateIntervalInSeconds * 1000)
  },

  loadData() {
    this.sendSocketNotification('GET_STOCKS', this.config)
  },

  socketNotificationReceived(notificationIdentifier: string, payload: any) {
    if (notificationIdentifier === 'STOCKS_RESULT') {
      this._stocks = payload
      console.log("Stocks", this._stocks)
      this.updateDom()
    }
  }
})
