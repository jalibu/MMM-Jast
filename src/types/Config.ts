export type Config = {
  locale: string
  updateIntervalInSeconds: number
  fadeSpeedInSeconds: number
  stocks: Stock[]
  scroll: 'vertical' | 'horizontal' | 'none'
  maxWidth: string
  numberDecimalsValues: number
  numberDecimalsPercentages: number
  showCurrency: boolean
  showColors: boolean
  lastUpdateFormat: string
  currencyStyle: 'symbol' | 'code' | 'name'
  useGrouping: boolean
  showChangePercent: boolean
  showChangeValue: boolean
  showChangeValueCurrency: boolean
  showLastUpdate: boolean
  showPortfolioValue: boolean
  showPortfolioGrowth: boolean
  showPortfolioGrowthPercent: boolean
  virtualHorizontalMultiplier: number
}

export type Stock = {
  symbol: string
  name?: string
  quantity?: number
}
