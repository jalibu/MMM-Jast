import type { Quote } from 'yahoo-finance2/modules/quote'

export interface StockResponse {
  price?: Quote
  meta: {
    purchasePrice?: number
    symbol: string
    displayCurrency?: string
    name?: string
    quantity?: number
    hidden?: boolean
  }
}
