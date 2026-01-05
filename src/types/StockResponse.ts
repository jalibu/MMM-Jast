import type { Price, SummaryDetail } from 'yahoo-finance2/esm/src/modules/quoteSummary-iface'

export interface StockResponse {
  summaryDetail?: SummaryDetail
  price?: Price
  meta: {
    purchasePrice: number
    symbol: string
    displayCurrency?: string
    name: string
    quantity?: number
    hidden?: boolean
  }
}
