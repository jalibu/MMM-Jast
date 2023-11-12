export type Config = {
  currencyStyle: 'symbol' | 'code' | 'name'
  fadeSpeedInSeconds: number
  lastUpdateFormat: string
  locale: string
  maxChangeAge: number
  maxWidth: string
  numberDecimalsPercentages: number
  numberDecimalsValues: number
  displayMode: 'vertical' | 'horizontal' | 'none' | 'table'
  scroll?: 'vertical' | 'horizontal' | 'none' | 'table'
  showCurrency: boolean
  showColors: boolean
  showChangePercent: boolean
  showChangeValue: boolean
  showChangeValueCurrency: boolean
  showHiddenStocks: boolean
  showLastUpdate: boolean
  showPortfolioGrowth: boolean
  showPortfolioGrowthPercent: boolean
  showPortfolioValue: boolean
  showPortfolioPerformanceValue: boolean
  showPortfolioPerformancePercent: boolean
  showStockPerformanceValue: boolean
  showStockPerformanceValueSum: boolean
  showStockPerformancePercent: boolean
  stocks: Stock[]
  stocksPerPage: number
  updateIntervalInSeconds: number
  useGrouping: boolean
  virtualHorizontalMultiplier: number
}

export type Stock = {
  symbol: string
  name?: string
  quantity?: number
  hidden?: boolean
  purchasePrice?: number
}
