/**
 * Demo configuration for MMM-Jast module development
 * This config is used for testing the module in isolation
 *
 * Usage: node --run demo
 */

let config = {
  port: 8080,
  address: 'localhost',
  language: 'en',
  logLevel: ['INFO', 'LOG', 'WARN', 'ERROR', 'DEBUG'],
  timeFormat: 24,
  units: 'metric',

  modules: [
    {
      module: 'alert'
    },
    {
      module: 'clock',
      position: 'middle_center',
      config: {
        timeFormat: 'HH:mm:ss'
      }
    },

    // Top Left: Vertical Display with all features enabled
    {
      module: 'MMM-Jast',
      position: 'top_left',
      header: 'Stock Ticker (Vertical)',
      config: {
        currencyStyle: 'symbol',
        displayMode: 'vertical',
        fadeSpeedInSeconds: 3.5,
        lastUpdateFormat: 'HH:mm',
        maxChangeAge: 1 * 24 * 60 * 60 * 1000, // 1 day
        maxWidth: '400px',
        numberDecimalsPercentages: 2,
        numberDecimalsValues: 2,
        showColors: true,
        showCurrency: true,
        showChangePercent: true,
        showChangeValue: true,
        showChangeValueCurrency: true,
        showHiddenStocks: false,
        showLastUpdate: true,
        showPortfolioValue: true,
        showPortfolioGrowth: true,
        showPortfolioGrowthPercent: true,
        showPortfolioPerformanceValue: true,
        showPortfolioPerformancePercent: true,
        showStockPerformanceValue: true,
        showStockPerformanceValueSum: true,
        showStockPerformancePercent: true,
        updateIntervalInSeconds: 300,
        useGrouping: true,
        stocks: [
          { name: 'Apple', symbol: 'AAPL', quantity: 10, purchasePrice: 150.0 },
          { name: 'Microsoft', symbol: 'MSFT', quantity: 5, purchasePrice: 300.0 },
          { name: 'Amazon', symbol: 'AMZN', quantity: 2, purchasePrice: 3000.0 },
          { name: 'Google', symbol: 'GOOGL', quantity: 3, purchasePrice: 2500.0 }
        ]
      }
    },

    // Top Right: Horizontal Display with minimal settings
    {
      module: 'MMM-Jast',
      position: 'top_left',
      header: 'Stock Ticker (Horizontal)',
      config: {
        currencyStyle: 'code',
        displayMode: 'horizontal',
        fadeSpeedInSeconds: 20, // Slower animation for horizontal scroll
        maxWidth: '600px',
        numberDecimalsPercentages: 1,
        numberDecimalsValues: 2,
        showColors: true,
        showCurrency: true,
        showChangePercent: true,
        showChangeValue: false,
        showLastUpdate: false,
        showPortfolioValue: false,
        showPortfolioGrowth: false,
        updateIntervalInSeconds: 300,
        useGrouping: false,
        virtualHorizontalMultiplier: 2,
        stocks: [
          { name: 'Tesla', symbol: 'TSLA' },
          { name: 'NVIDIA', symbol: 'NVDA' },
          { name: 'AMD', symbol: 'AMD' },
          { name: 'Meta', symbol: 'META' },
          { name: 'Netflix', symbol: 'NFLX' }
        ]
      }
    },

    // Bottom Left: German stocks with Euro display
    {
      module: 'MMM-Jast',
      position: 'bottom_left',
      header: 'Deutsche Aktien',
      config: {
        currencyStyle: 'symbol',
        displayMode: 'vertical',
        lastUpdateFormat: 'DD.MM HH:mm',
        maxWidth: '350px',
        numberDecimalsPercentages: 2,
        numberDecimalsValues: 2,
        showColors: true,
        showCurrency: true,
        showChangePercent: true,
        showChangeValue: true,
        showChangeValueCurrency: true,
        showLastUpdate: true,
        showPortfolioValue: true,
        updateIntervalInSeconds: 300,
        useGrouping: true,
        stocks: [
          { name: 'BASF', symbol: 'BAS.DE', quantity: 10, purchasePrice: 70.4 },
          { name: 'SAP', symbol: 'SAP.DE', quantity: 15, purchasePrice: 90.3 },
          { name: 'Siemens', symbol: 'SIE.DE', quantity: 8, purchasePrice: 120.5 },
          { name: 'Henkel', symbol: 'HEN3.DE', hidden: true }
        ]
      }
    },

    // Bottom Left (2): Table Display Mode
    {
      module: 'MMM-Jast',
      position: 'bottom_left',
      header: 'Crypto (Default-Table)',
      config: {
        currencyStyle: 'code',
        displayMode: 'default-table',
        fadeSpeedInSeconds: 20, // Table page switch duration
        maxWidth: '450px',
        numberDecimalsPercentages: 2,
        numberDecimalsValues: 0,
        showColors: true,
        showCurrency: true,
        showChangePercent: true,
        showChangeValue: true,
        showLastUpdate: false,
        updateIntervalInSeconds: 300,
        useGrouping: true,
        stocksPerPage: 3, // Show 3 cryptos per page
        stocks: [
          { name: 'Bitcoin', symbol: 'BTC-USD' },
          { name: 'Ethereum', symbol: 'ETH-USD' },
          { name: 'Cardano', symbol: 'ADA-USD' },
          { name: 'Ripple', symbol: 'XRP-USD' },
          { name: 'Polkadot', symbol: 'DOT-USD' },
          { name: 'Solana', symbol: 'SOL-USD' }
        ]
      }
    },

    // Bottom Right: Static Display (no animation)
    {
      module: 'MMM-Jast',
      position: 'bottom_right',
      header: 'Indices (Static)',
      config: {
        currencyStyle: 'code',
        displayMode: 'none', // Static display
        maxWidth: '350px',
        numberDecimalsPercentages: 2,
        numberDecimalsValues: 2,
        showColors: true,
        showCurrency: false, // Indices typically don't show currency
        showChangePercent: true,
        showChangeValue: true,
        showChangeValueCurrency: false,
        showLastUpdate: true,
        updateIntervalInSeconds: 300,
        useGrouping: true,
        stocks: [
          { name: 'DAX', symbol: '^GDAXI' },
          { name: 'S&P 500', symbol: '^GSPC' },
          { name: 'Dow Jones', symbol: '^DJI' }
        ]
      }
    }
  ]
}

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== 'undefined') {
  module.exports = config
}
