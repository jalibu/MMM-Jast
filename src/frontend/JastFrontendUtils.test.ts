/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Config } from '../types/Config'
import { StockResponse } from '../types/StockResponse'

vi.mock('logger', () => ({
  warn: vi.fn(),
  log: vi.fn(),
  error: vi.fn(),
  debug: vi.fn()
}))

import JastFrontendUtils from './JastFrontendUtils'

describe('JastFrontendUtils', () => {
  let baseConfig: Config

  beforeEach(() => {
    baseConfig = {
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
      stocks: [],
      stocksPerPage: 10,
      updateIntervalInSeconds: 300,
      useGrouping: true,
      virtualHorizontalMultiplier: 1
    }
  })

  describe('Style Configuration', () => {
    describe('getCurrentValueStyle', () => {
      it('should return currency style when showCurrency is true', () => {
        const style = JastFrontendUtils.getCurrentValueStyle(baseConfig)

        expect(style.style).toBe('currency')
        expect(style.currencyDisplay).toBe('symbol')
        expect(style.useGrouping).toBe(true)
        expect(style.minimumFractionDigits).toBe(2)
        expect(style.maximumFractionDigits).toBe(2)
      })

      it('should return decimal style when showCurrency is false', () => {
        const config = { ...baseConfig, showCurrency: false }
        const style = JastFrontendUtils.getCurrentValueStyle(config)

        expect(style.style).toBe('decimal')
      })

      it('should cap decimals at 8', () => {
        const config = { ...baseConfig, numberDecimalsValues: 10 }
        const style = JastFrontendUtils.getCurrentValueStyle(config)

        expect(style.minimumFractionDigits).toBe(8)
        expect(style.maximumFractionDigits).toBe(8)
      })

      it('should respect custom currency display style', () => {
        const config = { ...baseConfig, currencyStyle: 'code' as const }
        const style = JastFrontendUtils.getCurrentValueStyle(config)

        expect(style.currencyDisplay).toBe('code')
      })

      it('should disable grouping when useGrouping is false', () => {
        const config = { ...baseConfig, useGrouping: false }
        const style = JastFrontendUtils.getCurrentValueStyle(config)

        expect(style.useGrouping).toBe(false)
      })
    })

    describe('getChangeValueStyle', () => {
      it('should return currency style when showChangeValueCurrency is true', () => {
        const style = JastFrontendUtils.getChangeValueStyle(baseConfig)

        expect(style.style).toBe('currency')
        expect(style.currencyDisplay).toBe('symbol')
      })

      it('should return decimal style when showChangeValueCurrency is false', () => {
        const config = { ...baseConfig, showChangeValueCurrency: false }
        const style = JastFrontendUtils.getChangeValueStyle(config)

        expect(style.style).toBe('decimal')
      })
    })

    describe('getPercentStyle', () => {
      it('should return percent style with correct decimals', () => {
        const style = JastFrontendUtils.getPercentStyle(baseConfig)

        expect(style.style).toBe('percent')
        expect(style.useGrouping).toBe(true)
        expect(style.minimumFractionDigits).toBe(2)
      })

      it('should cap percentage decimals at 8', () => {
        const config = { ...baseConfig, numberDecimalsPercentages: 12 }
        const style = JastFrontendUtils.getPercentStyle(config)

        expect(style.minimumFractionDigits).toBe(8)
      })
    })
  })

  describe('Stock Value Calculations', () => {
    const mockStock: StockResponse = {
      price: {
        currency: 'USD',
        regularMarketPrice: 200,
        regularMarketChange: 5,
        regularMarketChangePercent: 0.025, // Yahoo returns changePercent as a fraction, e.g. 0.025 for 2.5%
        regularMarketPreviousClose: 195,
        regularMarketTime: new Date('2024-01-01T10:00:00.000Z'),
        longName: 'Apple Inc.',
        symbol: 'AAPL'
      } as any,
      meta: {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        quantity: 10,
        hidden: false,
        purchasePrice: 150
      }
    }

    describe('getStockChange', () => {
      it('should return regularMarketChange', () => {
        expect(JastFrontendUtils.getStockChange(mockStock)).toBe(5)
      })

      it('should return 0 when price is undefined', () => {
        const stockWithoutPrice: StockResponse = {
          ...mockStock,
          price: undefined
        }
        expect(JastFrontendUtils.getStockChange(stockWithoutPrice)).toBe(0)
      })

      it('should return 0 when regularMarketChange is undefined', () => {
        const stock: StockResponse = {
          ...mockStock,
          price: { ...mockStock.price!, regularMarketChange: undefined as any }
        }
        expect(JastFrontendUtils.getStockChange(stock)).toBe(0)
      })
    })

    describe('getStockChangePercent', () => {
      it('should return regularMarketChangePercent', () => {
        expect(JastFrontendUtils.getStockChangePercent(mockStock)).toBe(0.025)
      })

      it('should return 0 when price is undefined', () => {
        const stockWithoutPrice: StockResponse = {
          ...mockStock,
          price: undefined
        }
        expect(JastFrontendUtils.getStockChangePercent(stockWithoutPrice)).toBe(0)
      })
    })

    describe('getCurrentValue', () => {
      it('should return regularMarketPrice', () => {
        expect(JastFrontendUtils.getCurrentValue(mockStock)).toBe(200)
      })

      it('should return 0 when price is undefined', () => {
        const stockWithoutPrice: StockResponse = {
          ...mockStock,
          price: undefined
        }
        expect(JastFrontendUtils.getCurrentValue(stockWithoutPrice)).toBe(0)
      })
    })

    describe('getStockPerformance', () => {
      it('should calculate performance vs purchase price', () => {
        expect(JastFrontendUtils.getStockPerformance(mockStock)).toBe(50) // 200 - 150
      })

      it('should return 0 when no purchase price', () => {
        const stock: StockResponse = {
          ...mockStock,
          meta: { ...mockStock.meta, purchasePrice: undefined }
        }
        expect(JastFrontendUtils.getStockPerformance(stock)).toBe(0)
      })

      it('should handle negative performance', () => {
        const stock: StockResponse = {
          ...mockStock,
          meta: { ...mockStock.meta, purchasePrice: 250 }
        }
        expect(JastFrontendUtils.getStockPerformance(stock)).toBe(-50) // 200 - 250
      })
    })
  })

  describe('String Formatting', () => {
    const mockStock: StockResponse = {
      price: {
        currency: 'USD',
        regularMarketPrice: 200,
        regularMarketChange: 5.5,
        regularMarketChangePercent: 0.0275, // Yahoo returns changePercent as a fraction, e.g. 0.0275 for 2.75%
        regularMarketPreviousClose: 194.5,
        regularMarketTime: new Date('2024-01-01T10:00:00.000Z'),
        longName: 'Apple Inc.',
        symbol: 'AAPL'
      } as any,
      meta: {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        quantity: 10,
        hidden: false,
        purchasePrice: 150
      }
    }

    describe('getCurrentValueAsString', () => {
      it('should format current value with currency', () => {
        const formatted = JastFrontendUtils.getCurrentValueAsString(mockStock, baseConfig)
        expect(formatted).toMatch(/\$200\.00/)
      })

      it('should format with German locale', () => {
        const config = { ...baseConfig, locale: 'de-DE' }
        const formatted = JastFrontendUtils.getCurrentValueAsString(mockStock, config)
        expect(formatted).toMatch(/200,00/)
      })

      it('should format without currency symbol when showCurrency is false', () => {
        const config = { ...baseConfig, showCurrency: false }
        const formatted = JastFrontendUtils.getCurrentValueAsString(mockStock, config)
        expect(formatted).not.toContain('$')
        expect(formatted).toMatch(/200\.00/)
      })

      it('should handle EUR currency', () => {
        const euroStock: StockResponse = {
          ...mockStock,
          price: { ...mockStock.price!, currency: 'EUR' }
        }
        const formatted = JastFrontendUtils.getCurrentValueAsString(euroStock, baseConfig)
        expect(formatted).toContain('200')
      })
    })

    describe('getStockChangeAsString', () => {
      it('should format change value with currency', () => {
        const formatted = JastFrontendUtils.getStockChangeAsString(mockStock, baseConfig)
        expect(formatted).toMatch(/\$5\.50/)
      })

      it('should format without currency when showChangeValueCurrency is false', () => {
        const config = { ...baseConfig, showChangeValueCurrency: false }
        const formatted = JastFrontendUtils.getStockChangeAsString(mockStock, config)
        expect(formatted).not.toContain('$')
      })
    })

    describe('getStockChangePercentAsString', () => {
      it('should format percentage change', () => {
        const formatted = JastFrontendUtils.getStockChangePercentAsString(mockStock, baseConfig)
        // toLocaleString with style:'percent' turns the 0.0275 fraction into "2.75%"
        expect(formatted).toMatch(/2\.75/)
      })

      it('should respect decimal configuration', () => {
        const config = { ...baseConfig, numberDecimalsPercentages: 4 }
        const formatted = JastFrontendUtils.getStockChangePercentAsString(mockStock, config)
        expect(formatted).toContain('2.75')
      })
    })

    describe('getStockPerformanceAsString', () => {
      it('should format performance value', () => {
        const formatted = JastFrontendUtils.getStockPerformanceAsString(mockStock, baseConfig)
        expect(formatted).toMatch(/\$50\.00/) // 200 - 150
      })

      it('should handle zero performance when no purchase price', () => {
        const stock: StockResponse = {
          ...mockStock,
          meta: { ...mockStock.meta, purchasePrice: undefined }
        }
        const formatted = JastFrontendUtils.getStockPerformanceAsString(stock, baseConfig)
        expect(formatted).toMatch(/0\.00/)
      })
    })

    describe('getStockPerformanceSumAsString', () => {
      it('should multiply performance by quantity', () => {
        const formatted = JastFrontendUtils.getStockPerformanceSumAsString(mockStock, baseConfig)
        expect(formatted).toMatch(/\$500\.00/) // (200 - 150) * 10
      })

      it('should handle zero quantity', () => {
        const stock: StockResponse = {
          ...mockStock,
          meta: { ...mockStock.meta, quantity: 0 }
        }
        const formatted = JastFrontendUtils.getStockPerformanceSumAsString(stock, baseConfig)
        expect(formatted).toMatch(/0\.00/)
      })
    })

    describe('getStockPerformancePercentAsString', () => {
      it('should calculate percentage performance', () => {
        const formatted = JastFrontendUtils.getStockPerformancePercentAsString(mockStock, baseConfig)
        // (200 - 150) / 150 = 0.3333... = 33.33%
        expect(formatted).toMatch(/33\.33/)
      })

      it('should handle zero when no purchase price', () => {
        const stock: StockResponse = {
          ...mockStock,
          meta: { ...mockStock.meta, purchasePrice: undefined }
        }
        const formatted = JastFrontendUtils.getStockPerformancePercentAsString(stock, baseConfig)
        expect(formatted).toMatch(/0/)
      })
    })

    describe('getPurchasePriceAsString', () => {
      it('should format purchase price', () => {
        const formatted = JastFrontendUtils.getPurchasePriceAsString(mockStock, baseConfig)
        expect(formatted).toMatch(/\$150\.00/)
      })

      it('should handle undefined purchase price', () => {
        const stock: StockResponse = {
          ...mockStock,
          meta: { ...mockStock.meta, purchasePrice: undefined }
        }
        const formatted = JastFrontendUtils.getPurchasePriceAsString(stock, baseConfig)
        expect(formatted).toMatch(/0\.00/)
      })
    })
  })

  describe('Helper Functions', () => {
    describe('getStockName', () => {
      it('should return meta name when available', () => {
        const stock: StockResponse = {
          price: { longName: 'Long Name', symbol: 'AAPL' } as any,
          meta: { symbol: 'AAPL', name: 'Meta Name', quantity: 1, hidden: false }
        }
        expect(JastFrontendUtils.getStockName(stock)).toBe('Meta Name')
      })

      it('should fallback to longName when meta name is empty', () => {
        const stock: StockResponse = {
          price: { longName: 'Long Name', symbol: 'AAPL' } as any,
          meta: { symbol: 'AAPL', name: '', quantity: 1, hidden: false }
        }
        expect(JastFrontendUtils.getStockName(stock)).toBe('Long Name')
      })

      it('should return empty string when no name available', () => {
        const stock: StockResponse = {
          price: { symbol: 'AAPL' } as any,
          meta: { symbol: 'AAPL', quantity: 1, hidden: false }
        }
        expect(JastFrontendUtils.getStockName(stock)).toBe('')
      })
    })

    describe('getNumberOfDisplayedStocks', () => {
      const stocks: StockResponse[] = [
        {
          price: { symbol: 'AAPL' } as any,
          meta: { symbol: 'AAPL', quantity: 1, hidden: false }
        },
        {
          price: { symbol: 'GOOGL' } as any,
          meta: { symbol: 'GOOGL', quantity: 1, hidden: true }
        },
        {
          price: { symbol: 'MSFT' } as any,
          meta: { symbol: 'MSFT', quantity: 1, hidden: false }
        }
      ]

      it('should count all stocks when showHiddenStocks is true', () => {
        const config = { ...baseConfig, showHiddenStocks: true }
        expect(JastFrontendUtils.getNumberOfDisplayedStocks(stocks, config)).toBe(3)
      })

      it('should exclude hidden stocks when showHiddenStocks is false', () => {
        const config = { ...baseConfig, showHiddenStocks: false }
        expect(JastFrontendUtils.getNumberOfDisplayedStocks(stocks, config)).toBe(2)
      })

      it('should handle empty array', () => {
        expect(JastFrontendUtils.getNumberOfDisplayedStocks([], baseConfig)).toBe(0)
      })
    })
  })

  describe('Portfolio Calculations', () => {
    describe('getPortfolio', () => {
      it('should calculate portfolio for single currency', () => {
        const stocks: StockResponse[] = [
          {
            price: {
              currency: 'USD',
              regularMarketPrice: 200,
              regularMarketChange: 5,
              symbol: 'AAPL'
            } as any,
            meta: { symbol: 'AAPL', quantity: 10, hidden: false, purchasePrice: 150 }
          },
          {
            price: {
              currency: 'USD',
              regularMarketPrice: 100,
              regularMarketChange: 2,
              symbol: 'MSFT'
            } as any,
            meta: { symbol: 'MSFT', quantity: 5, hidden: false, purchasePrice: 80 }
          }
        ]

        const config = {
          ...baseConfig,
          stocks: [
            { symbol: 'AAPL', quantity: 10, purchasePrice: 150 },
            { symbol: 'MSFT', quantity: 5, purchasePrice: 80 }
          ]
        }
        const portfolio = JastFrontendUtils.getPortfolio(stocks, config)

        expect(portfolio).toHaveLength(1)
        expect(portfolio[0].currency).toBe('USD')
        expect(portfolio[0].value).toBe(2500) // 200*10 + 100*5
        expect(portfolio[0].oldValue).toBe(2440) // 195*10 + 98*5
        expect(portfolio[0].purchaseValue).toBe(1900) // 150*10 + 80*5
      })

      it('should separate multiple currencies', () => {
        const stocks: StockResponse[] = [
          {
            price: {
              currency: 'USD',
              regularMarketPrice: 200,
              regularMarketChange: 5,
              symbol: 'AAPL'
            } as any,
            meta: { symbol: 'AAPL', quantity: 10, hidden: false, purchasePrice: 150 }
          },
          {
            price: {
              currency: 'EUR',
              regularMarketPrice: 100,
              regularMarketChange: 2,
              symbol: 'BMW'
            } as any,
            meta: { symbol: 'BMW', quantity: 5, hidden: false, purchasePrice: 80 }
          }
        ]

        const config = {
          ...baseConfig,
          stocks: [
            { symbol: 'AAPL', quantity: 10, purchasePrice: 150 },
            { symbol: 'BMW', quantity: 5, purchasePrice: 80 }
          ]
        }
        const portfolio = JastFrontendUtils.getPortfolio(stocks, config)

        expect(portfolio).toHaveLength(2)
        expect(portfolio.find((p) => p.currency === 'USD')).toBeDefined()
        expect(portfolio.find((p) => p.currency === 'EUR')).toBeDefined()
      })

      it('should skip stocks without quantity', () => {
        const stocks: StockResponse[] = [
          {
            price: {
              currency: 'USD',
              regularMarketPrice: 200,
              regularMarketChange: 5,
              symbol: 'AAPL'
            } as any,
            meta: { symbol: 'AAPL', quantity: undefined, hidden: false, purchasePrice: 150 }
          }
        ]

        const config = {
          ...baseConfig,
          stocks: [{ symbol: 'AAPL', purchasePrice: 150 }]
        }
        const portfolio = JastFrontendUtils.getPortfolio(stocks, config)

        expect(portfolio).toHaveLength(0)
      })

      it('should skip stocks without price', () => {
        const stocks: StockResponse[] = [
          {
            meta: { symbol: 'AAPL', quantity: 10, hidden: false, purchasePrice: 150 }
          }
        ]

        const config = {
          ...baseConfig,
          stocks: [{ symbol: 'AAPL', quantity: 10, purchasePrice: 150 }]
        }
        const portfolio = JastFrontendUtils.getPortfolio(stocks, config)

        expect(portfolio).toHaveLength(0)
      })

      it('should use current value as purchase value when no purchase price', () => {
        const stocks: StockResponse[] = [
          {
            price: {
              currency: 'USD',
              regularMarketPrice: 200,
              regularMarketChange: 5,
              symbol: 'AAPL'
            } as any,
            meta: { symbol: 'AAPL', quantity: 10, hidden: false, purchasePrice: undefined }
          }
        ]

        const config = {
          ...baseConfig,
          stocks: [{ symbol: 'AAPL', quantity: 10 }]
        }
        const portfolio = JastFrontendUtils.getPortfolio(stocks, config)

        expect(portfolio[0].purchaseValue).toBe(2000) // currentStockValue when no purchasePrice
      })

      it('should handle missing regularMarketChange gracefully', () => {
        const stocks: StockResponse[] = [
          {
            price: {
              currency: 'USD',
              regularMarketPrice: 200,
              symbol: 'AAPL'
            } as any,
            meta: { symbol: 'AAPL', quantity: 10, hidden: false, purchasePrice: 150 }
          }
        ]

        const config = {
          ...baseConfig,
          stocks: [{ symbol: 'AAPL', quantity: 10, purchasePrice: 150 }]
        }
        const portfolio = JastFrontendUtils.getPortfolio(stocks, config)

        expect(portfolio[0].oldValue).toBe(2000) // 200*10 (no change)
      })
    })

    describe('Portfolio Formatting', () => {
      const mockPortfolio = {
        value: 10000,
        purchaseValue: 8000,
        oldValue: 9500,
        currency: 'USD'
      }

      describe('getPortfolioValueAsString', () => {
        it('should format portfolio value', () => {
          const formatted = JastFrontendUtils.getPortfolioValueAsString(mockPortfolio, baseConfig)
          expect(formatted).toMatch(/\$10,000\.00/)
        })

        it('should respect locale', () => {
          const config = { ...baseConfig, locale: 'de-DE' }
          const formatted = JastFrontendUtils.getPortfolioValueAsString(mockPortfolio, config)
          expect(formatted).toMatch(/10\.000,00/)
        })
      })

      describe('getPortfolioPerformanceValueAsString', () => {
        it('should format performance value', () => {
          const formatted = JastFrontendUtils.getPortfolioPerformanceValueAsString(mockPortfolio, baseConfig)
          expect(formatted).toMatch(/\$2,000\.00/) // 10000 - 8000
        })
      })

      describe('getPortfolioPerformancePercentAsString', () => {
        it('should format performance percentage', () => {
          const formatted = JastFrontendUtils.getPortfolioPerformancePercentAsString(mockPortfolio, baseConfig)
          expect(formatted).toMatch(/25/) // (10000 - 8000) / 8000 = 0.25 = 25%
        })

        it('should return 0% instead of dividing by zero when purchaseValue is 0', () => {
          const portfolio = { ...mockPortfolio, purchaseValue: 0 }
          const formatted = JastFrontendUtils.getPortfolioPerformancePercentAsString(portfolio, baseConfig)
          expect(formatted).toMatch(/0%/)
          expect(formatted).not.toMatch(/Infinity|NaN/)
        })
      })

      describe('getPortfolioChangeAsString', () => {
        it('should format change value', () => {
          const formatted = JastFrontendUtils.getPortfolioChangeAsString(mockPortfolio, baseConfig)
          expect(formatted).toMatch(/\$500\.00/) // 10000 - 9500
        })
      })

      describe('getPortfolioChangePercentAsString', () => {
        it('should format change percentage', () => {
          const formatted = JastFrontendUtils.getPortfolioChangePercentAsString(mockPortfolio, baseConfig)
          expect(formatted).toMatch(/5\.26/) // (10000 - 9500) / 9500 ≈ 5.26%
        })

        it('should return 0% instead of dividing by zero when oldValue is 0', () => {
          const portfolio = { ...mockPortfolio, oldValue: 0 }
          const formatted = JastFrontendUtils.getPortfolioChangePercentAsString(portfolio, baseConfig)
          expect(formatted).toMatch(/0%/)
          expect(formatted).not.toMatch(/Infinity|NaN/)
        })
      })
    })
  })
})
