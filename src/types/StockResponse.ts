export type StockResponse = {
  summaryDetail: any
  price: any
  meta: {
    symbol: string
    displayCurrency?: string
    name: string
    quantity?: number
    buyPrix?: number
    hidden?: boolean
  }
}
