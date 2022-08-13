export type Config = {
  currencyStyle: 'symbol' | 'code' | 'name'
  fadeSpeedInSeconds: number
  lastUpdateFormat: string
  locale: string
  maxChangeAge: number
  maxWidth: string
  numberDecimalsPercentages: number
  numberDecimalsValues: number
  scroll: 'vertical' | 'horizontal' | 'none'
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
  stocks: Stock[]
  updateIntervalInSeconds: number
  useGrouping: boolean
  virtualHorizontalMultiplier: number
}

export type Stock = {
  symbol: string
  name?: string
  quantity?: number
  hidden?: boolean
}
