import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { Quote } from 'yahoo-finance2/modules/quote'
import { Config } from '../types/Config'
import { StockResponse } from '../types/StockResponse'

// JastBackendUtils now creates its YahooFinance instance at module load time, so the mock
// needs to exist before that import runs too - vi.hoisted() lifts it above the imports.
const { mockQuoteCombine } = vi.hoisted(() => ({ mockQuoteCombine: vi.fn() }))

// Mocks must be called before imports
vi.mock('yahoo-finance2', () => ({
  default: class YahooFinanceMock {
    quoteCombine = mockQuoteCombine
  }
}))

vi.mock('logger', () => ({
  warn: vi.fn(),
  log: vi.fn(),
  error: vi.fn(),
  debug: vi.fn()
}))

import JastBackendUtils from './JastBackendUtils'

describe('JastBackendUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('requestStocks', () => {
    const mockConfig: Config = {
      currencyStyle: 'symbol',
      fadeSpeedInSeconds: 1,
      lastUpdateFormat: 'HH:mm',
      locale: 'en-US',
      maxChangeAge: 0,
      maxWidth: '100%',
      numberDecimalsPercentages: 2,
      numberDecimalsValues: 2,
      displayMode: 'vertical',
      showCurrency: true,
      showColors: true,
      showChangePercent: true,
      showChangeValue: true,
      showChangeValueCurrency: true,
      showHiddenStocks: false,
      showLastUpdate: true,
      showPortfolioGrowth: true,
      showPortfolioGrowthPercent: true,
      showPortfolioValue: true,
      showPortfolioPerformanceValue: true,
      showPortfolioPerformancePercent: true,
      showStockPerformanceValue: true,
      showStockPerformanceValueSum: true,
      showStockPerformancePercent: true,
      stocks: [
        {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          quantity: 10,
          hidden: false,
          purchasePrice: 150
        },
        {
          symbol: 'GOOGL',
          name: 'Alphabet Inc.',
          quantity: 5,
          hidden: false,
          purchasePrice: 2500
        }
      ],
      stocksPerPage: 10,
      updateIntervalInSeconds: 300,
      useGrouping: true,
      virtualHorizontalMultiplier: 1
    }

    it('should handle successful API calls with all features', async () => {
      const oldDate = new Date()
      oldDate.setHours(oldDate.getHours() - 2) // 2 hours ago

      const mockResponse = {
        currency: 'USD',
        regularMarketPrice: 200,
        regularMarketChange: 5,
        regularMarketChangePercent: 2.5,
        regularMarketPreviousClose: 195,
        regularMarketTime: oldDate,
        longName: 'Apple Inc.',
        symbol: 'AAPL'
      } as unknown as Quote

      mockQuoteCombine.mockResolvedValue(mockResponse)

      const configWithMaxAge: Config = {
        ...mockConfig,
        maxChangeAge: 3600000 // 1 hour in milliseconds
      }

      const result: StockResponse[] = await JastBackendUtils.requestStocks(configWithMaxAge)

      expect(result).toHaveLength(2)
      expect(result[0]).toMatchObject({
        price: {
          ...mockResponse,
          regularMarketChange: 0, // Should be zeroed due to old data
          regularMarketChangePercent: 0,
          regularMarketPreviousClose: 200
        },
        meta: {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          quantity: 10,
          hidden: false,
          purchasePrice: 150
        }
      })
      expect(mockQuoteCombine).toHaveBeenCalledTimes(2)
    })

    it('should pass an abort signal to time out hanging requests', async () => {
      mockQuoteCombine.mockResolvedValue({
        currency: 'USD',
        regularMarketPrice: 200,
        regularMarketChange: 5,
        regularMarketChangePercent: 0.025,
        regularMarketPreviousClose: 195,
        regularMarketTime: new Date('2024-01-01T10:00:00.000Z'),
        longName: 'Apple Inc.',
        symbol: 'AAPL'
      } as unknown as Quote)

      await JastBackendUtils.requestStocks(mockConfig)

      expect(mockQuoteCombine).toHaveBeenCalledWith(
        'AAPL',
        { fields: expect.arrayContaining(['regularMarketPrice', 'currency']) },
        { fetchOptions: { signal: expect.any(AbortSignal) } }
      )
    })

    it('should handle GBp currency conversion', async () => {
      const mockResponse = {
        currency: 'GBp',
        regularMarketPrice: 10000, // This should be converted to 100
        regularMarketChange: 500, // This should be converted to 5
        regularMarketChangePercent: 2.5,
        regularMarketPreviousClose: 195,
        regularMarketTime: new Date('2024-01-01T10:00:00.000Z'),
        longName: 'British Company',
        symbol: 'BRIT'
      } as unknown as Quote

      mockQuoteCombine.mockResolvedValue(mockResponse)

      const configWithGBP: Config = {
        ...mockConfig,
        stocks: [
          {
            symbol: 'BRIT',
            name: 'British Company',
            quantity: 1,
            hidden: false,
            purchasePrice: 100
          }
        ]
      }

      const result: StockResponse[] = await JastBackendUtils.requestStocks(configWithGBP)

      expect(result[0].price?.currency).toBe('GBP')
      expect(result[0].price?.regularMarketPrice).toBe(100)
      expect(result[0].price?.regularMarketChange).toBe(5)
    })

    it('should return an empty list without calling the API when stocks is empty', async () => {
      const configWithNoStocks: Config = { ...mockConfig, stocks: [] }

      const result: StockResponse[] = await JastBackendUtils.requestStocks(configWithNoStocks)

      expect(result).toEqual([])
      expect(mockQuoteCombine).not.toHaveBeenCalled()
    })

    it('should handle API errors gracefully', async () => {
      mockQuoteCombine.mockRejectedValue(new Error('API Error'))

      const result: StockResponse[] = await JastBackendUtils.requestStocks(mockConfig)

      expect(result).toHaveLength(0)
      expect(mockQuoteCombine).toHaveBeenCalledTimes(2)
    })

    it('should skip symbols that yahoo-finance2 resolves to undefined', async () => {
      // quoteCombine() resolves with `undefined` (not a rejection) for unknown/misspelled symbols.
      mockQuoteCombine.mockResolvedValue(undefined)

      const result: StockResponse[] = await JastBackendUtils.requestStocks(mockConfig)

      expect(result).toHaveLength(0)
    })
  })
})
