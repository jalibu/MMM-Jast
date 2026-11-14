import { fileURLToPath } from 'node:url'
import nunjucks from 'nunjucks'
import { describe, expect, it, vi } from 'vitest'
import type { Config } from '../types/Config'
import type { StockResponse } from '../types/StockResponse'
import Utils from './JastFrontendUtils'

vi.mock('logger', () => ({
  warn: vi.fn(),
  log: vi.fn(),
  error: vi.fn(),
  debug: vi.fn()
}))

const env = nunjucks.configure(fileURLToPath(new URL('../..', import.meta.url)), { autoescape: true })
env.addFilter('translate', (key: string) => key)

// Only the options the templates and formatting helpers read; unlisted show* options are off
const config = {
  currencyStyle: 'symbol',
  fadeSpeedInSeconds: 2,
  locale: 'en-US',
  numberDecimalsPercentages: 1,
  numberDecimalsValues: 2,
  displayMode: 'none',
  showCurrency: true,
  showLastUpdate: false,
  showPortfolioValue: false,
  showPortfolioGrowth: false,
  showPortfolioGrowthPercent: false,
  showPortfolioPerformanceValue: false,
  showPortfolioPerformancePercent: false,
  virtualHorizontalMultiplier: 1,
  stocks: [{ symbol: 'ABC', quantity: 1, purchasePrice: 100 }]
} as Config

/**
 * Renders the module with one stock and returns its HTML.
 * @param options - Configuration overrides
 * @param price - Current price
 * @param dailyChange - Price change since the previous close
 * @returns Rendered HTML
 */
function render(options: Partial<Config>, price = 120, dailyChange = 0): string {
  const stock = {
    meta: { symbol: 'ABC', name: 'Example', quantity: 1, purchasePrice: 100 },
    price: {
      regularMarketPrice: price,
      regularMarketChange: dailyChange,
      regularMarketChangePercent: 0,
      currency: 'USD'
    }
  } as StockResponse
  return env.render('templates/MMM-Jast.njk', {
    config: { ...config, ...options },
    stocks: [stock],
    tableStocks: [stock],
    utils: Utils,
    lastUpdate: ''
  })
}

describe('portfolio summary template', () => {
  it.each(['none', 'vertical', 'horizontal', 'horizontal-static'] as const)(
    'shows only the requested performance percent with no daily change in %s mode',
    (displayMode) => {
      const html = render({ displayMode, showPortfolioPerformancePercent: true })

      expect(html).toContain('class="jast-stock portfolio"')
      expect(html).toContain('>+20.0%</span>')
      expect(html).not.toContain('>+$20.00</span>')
    }
  )

  it('shows only performance value even when daily growth is enabled', () => {
    const html = render({ showPortfolioGrowth: true, showPortfolioPerformanceValue: true }, 120, 10)

    expect(html).toContain('>+$20.00</span>')
    expect(html).not.toContain('>+20.0%</span>')
  })

  it('shows both requested metrics for a loss despite positive daily growth', () => {
    const html = render({ showPortfolioPerformanceValue: true, showPortfolioPerformancePercent: true }, 80, 10)

    expect(html).toContain('class="jast-portfolio-performance low"')
    expect(html).toContain('>-$20.00</span>')
    expect(html).toContain('>-20.0%</span>')
  })

  it('does not render a performance value or empty parentheses when performance is zero', () => {
    const html = render({ showPortfolioPerformanceValue: true, showPortfolioPerformancePercent: true }, 100, 10)

    expect(html).toContain('class="jast-stock portfolio"')
    expect(html).not.toContain('>$0.00</span>')
    expect(html).not.toMatch(/\(\s*\)/)
  })

  it('does not render a portfolio summary when all portfolio options are disabled', () => {
    expect(render({})).not.toContain('class="jast-stock portfolio"')
  })
})

describe('styling', () => {
  it('counts a performance-only portfolio in the vertical animation', () => {
    const html = render({ displayMode: 'vertical', showPortfolioPerformancePercent: true })

    expect(html).toContain('--jast-ticker-item-count: 2;')
    expect(html).toContain('--jast-ticker-speed: 2s;')
  })

  it('sets separate animation values for each ticker instance', () => {
    const vertical = render({ displayMode: 'vertical', showLastUpdate: true, fadeSpeedInSeconds: 3 })
    const horizontal = render({ displayMode: 'horizontal', fadeSpeedInSeconds: 7 })

    expect(vertical).toContain('--jast-ticker-item-count: 2;')
    expect(vertical).toContain('--jast-ticker-speed: 3s;')
    expect(horizontal).toContain('--jast-ticker-speed: 7s;')
    expect(vertical + horizontal).not.toContain('<style')
  })

  it.each([
    [10, 'high', '+'],
    [-10, 'low', ''],
    [0, '', '']
  ])('uses the matching default-table color class for change %s', (dailyChange, trend, sign) => {
    const html = render({ displayMode: 'default-table' }, 120, dailyChange)

    expect(html).toContain(`class="jast-default-table-change ${trend}">${sign}`)
    expect(html).not.toContain('<style')
  })
})
