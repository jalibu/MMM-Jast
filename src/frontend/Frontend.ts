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
    displayMode: 'vertical',
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
    showPortfolioPerformanceValue: false,
    showPortfolioPerformancePercent: false,
    showStockPerformanceValue: false,
    showStockPerformanceValueSum: false,
    showStockPerformancePercent: false,
    updateIntervalInSeconds: 600,
    useGrouping: false,
    virtualHorizontalMultiplier: 2,
    stocksPerPage: 2,
    stocks: [
      { name: 'BASF', symbol: 'BAS.DE', quantity: 10, purchasePrice: 70.4 },
      { name: 'SAP', symbol: 'SAP.DE', quantity: 15, purchasePrice: 90.3 },
      { name: 'Henkel', symbol: 'HEN3.DE', hidden: true },
      { name: 'Bitcoin', symbol: 'BTC-EUR' }
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
    if(this.config.scroll){
      console.warn("MMM-JAST config property 'scroll' is deprecated. Please use displayMode instead.")
      this.config.displayMode = this.config.scroll
    }
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
      this.updateDom()
      console.log('data', payload)
    }
  }
})
