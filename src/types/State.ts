import { StockResponse } from './StockResponse'

export interface State {
  lastUpdate: number
  stocks: StockResponse[]
}
