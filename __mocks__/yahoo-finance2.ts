import { vi } from 'vitest'
import type { QuoteSummaryResult } from 'yahoo-finance2/esm/src/modules/quoteSummary'

export const mockQuoteSummary = vi.fn<(symbol: string, options?: object) => Promise<QuoteSummaryResult>>()

export default class YahooFinanceMock {
  quoteSummary = mockQuoteSummary
}
