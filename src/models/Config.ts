export type Config = {
  locale: string
  header: string
  updateIntervalInSeconds: number
  fadeSpeedInSeconds: number
  stocks: Stock[]
  scroll: 'vertical' | 'horizontal' | 'none'
  maxWidth: string
  numberDecimalsValues: number
  numberDecimalsPercentages: number
  showCurrency: boolean
  currencyStyle: 'symbol' | 'code' | 'name'
  useGrouping: boolean
  showChangePercent: boolean
  showChangeValue: boolean
  showChangeValueCurrency: boolean
  showDepotGrowth: boolean
}

type Stock = {
  symbol: string
  name?: string
  quantity?: number
}
