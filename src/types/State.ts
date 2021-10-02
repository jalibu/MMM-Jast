import { StockResponse } from './StockResponse'

export type State = {
  lastUpdate: number
  stocks: StockResponse[]
}
