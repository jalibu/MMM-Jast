import * as Log from 'logger'
import Utils from './JastFrontendUtils'
import { Config } from '../types/Config'

// Global or injected variable declarations
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const moment: any

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
    lastUpdateFormat: 'HH:mm',
    scroll: 'vertical',
    maxWidth: '100%',
    maxChangeAge: 1 * 24 * 60 * 60 * 1000,
    numberDecimalsValues: 2,
    numberDecimalsPercentages: 1,
    showColors: true,
    showCurrency: true,
    showChangePercent: true,
    showChangeValue: false,
    showChangeValueCurrency: false,
    showLastUpdate: false,
    showPortfolioValue: false,
    showPortfolioGrowth: false,
    showPortfolioGrowthPercent: false,
    virtualHorizontalMultiplier: 2
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
    const utils = new Utils(this.config)

    return {
      config: this.config,
      stocks: this.state?.stocks,
      lastUpdate: moment(this.state?.lastUpdate).format(this.config.lastUpdateFormat),
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
      this.state = payload
      Log.log('JAST_STOCKS_RESPONSE', this.state)
      this.updateDom()
    }
  }
})
