import JastBackendUtils from './JastBackendUtils'
import { Config } from '../types/Config'
import { StockResponse } from '../types/StockResponse'
import * as mockYahooFinanceModule from 'yahoo-finance2'

describe('JastBackendUtils', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockQuoteSummary: jest.Mock<any, any>

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockYahooFinance = mockYahooFinanceModule as any
    mockQuoteSummary = mockYahooFinance.mockQuoteSummary
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
        price: {
          currency: 'USD',
          regularMarketPrice: 200,
          regularMarketChange: 5,
          regularMarketChangePercent: 2.5,
          regularMarketPreviousClose: 195,
          regularMarketTime: oldDate.toISOString(),
          longName: 'Apple Inc.',
          symbol: 'AAPL'
        }
      }

      mockQuoteSummary.mockResolvedValue(mockResponse)

      const configWithMaxAge: Config = {
        ...mockConfig,
        maxChangeAge: 3600000 // 1 hour in milliseconds
      }

      const result: StockResponse[] = await JastBackendUtils.requestStocks(configWithMaxAge)

      expect(result).toHaveLength(2)
      expect(result[0]).toMatchObject({
        price: {
          ...mockResponse.price,
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
      expect(mockQuoteSummary).toHaveBeenCalledTimes(2)
    })

    it('should handle GBp currency conversion', async () => {
      const mockResponse = {
        price: {
          currency: 'GBp',
          regularMarketPrice: 10000, // This should be converted to 100
          regularMarketChange: 500, // This should be converted to 5
          regularMarketChangePercent: 2.5,
          regularMarketPreviousClose: 195,
          regularMarketTime: '2024-01-01T10:00:00.000Z',
          longName: 'British Company',
          symbol: 'BRIT'
        }
      }

      mockQuoteSummary.mockResolvedValue(mockResponse)

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

      expect(result[0].price.currency).toBe('GBP')
      expect(result[0].price.regularMarketPrice).toBe(100)
      expect(result[0].price.regularMarketChange).toBe(5)
    })

    it('should handle API errors gracefully', async () => {
      mockQuoteSummary.mockRejectedValue(new Error('API Error'))

      const result: StockResponse[] = await JastBackendUtils.requestStocks(mockConfig)

      expect(result).toHaveLength(0)
      expect(mockQuoteSummary).toHaveBeenCalledTimes(2)
    })

    it('should handle responses without price data', async () => {
      mockQuoteSummary.mockResolvedValue({
        // No price property - triggers warning
        summaryDetail: { currency: 'USD' }
      })

      const result: StockResponse[] = await JastBackendUtils.requestStocks(mockConfig)

      expect(result).toHaveLength(0)
    })

    it('should handle invalid date parsing in maxChangeAge logic', async () => {
      const originalDateParse = Date.parse
      Date.parse = jest.fn(() => {
        throw new Error('Invalid date')
      })

      mockQuoteSummary.mockResolvedValue({
        price: {
          currency: 'USD',
          regularMarketPrice: 200,
          regularMarketChange: 5,
          regularMarketChangePercent: 2.5,
          regularMarketPreviousClose: 195,
          regularMarketTime: '2024-01-01T10:00:00.000Z',
          longName: 'Apple Inc.',
          symbol: 'AAPL'
        }
      })

      const configWithMaxAge: Config = {
        ...mockConfig,
        maxChangeAge: 3600000
      }

      const result: StockResponse[] = await JastBackendUtils.requestStocks(configWithMaxAge)

      expect(result).toHaveLength(2) // Stock is still returned despite date parsing error

      Date.parse = originalDateParse
    })
  })
})
