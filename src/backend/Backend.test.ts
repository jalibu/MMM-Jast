import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { StockResponse } from '../types/StockResponse'

const mockRequestStocks = vi.fn()

vi.mock('./JastBackendUtils', () => ({
  default: { requestStocks: mockRequestStocks }
}))

vi.mock('logger', () => ({
  warn: vi.fn(),
  log: vi.fn(),
  error: vi.fn(),
  debug: vi.fn()
}))

vi.mock('node_helper', () => ({
  default: {
    create: (moduleDefinition: Record<string, unknown>) =>
      class {
        name = 'MMM-Jast'
        sendSocketNotification = vi.fn()

        constructor() {
          Object.assign(this, moduleDefinition)
        }
      }
  }
}))

const validStock = (overrides: Partial<StockResponse['price']> = {}): StockResponse => ({
  price: {
    currency: 'USD',
    regularMarketChange: 5,
    regularMarketChangePercent: 0.025,
    regularMarketPrice: 200,
    regularMarketPreviousClose: 195,
    longName: 'Apple Inc.',
    ...overrides
  } as StockResponse['price'],
  meta: { symbol: 'AAPL' }
})

describe('Backend', () => {
  let backend: {
    name: string
    sendSocketNotification: ReturnType<typeof vi.fn>
    socketNotificationReceived: (notification: string, payload: unknown) => Promise<void>
  }

  beforeEach(async () => {
    vi.clearAllMocks()
    vi.resetModules()
    // Backend.ts assigns `module.exports = NodeHelper.create(...)`, which TypeScript can't
    // statically type as a module export, so the dynamic import result is cast manually.
    const { default: BackendModule } = (await import('./Backend')) as unknown as {
      default: new () => typeof backend
    }
    backend = new BackendModule()
  })

  it('forwards sane stock responses under the request identifier', async () => {
    mockRequestStocks.mockResolvedValue([validStock()])

    await backend.socketNotificationReceived('JAST_STOCKS_REQUEST-instance_1', { stocks: [] })

    expect(backend.sendSocketNotification).toHaveBeenCalledWith(
      'JAST_STOCKS_RESPONSE-instance_1',
      expect.objectContaining({ stocks: [validStock()] })
    )
  })

  it('filters out stocks missing a required sanity field', async () => {
    const stock = validStock()
    delete (stock.price as Record<string, unknown>).currency
    mockRequestStocks.mockResolvedValue([stock])

    await backend.socketNotificationReceived('JAST_STOCKS_REQUEST-instance_1', { stocks: [] })

    expect(backend.sendSocketNotification).toHaveBeenCalledWith(
      'JAST_STOCKS_RESPONSE-instance_1',
      expect.objectContaining({ stocks: [] })
    )
  })

  it('returns an empty stock list without error', async () => {
    mockRequestStocks.mockResolvedValue([])

    await backend.socketNotificationReceived('JAST_STOCKS_REQUEST-instance_1', { stocks: [] })

    expect(backend.sendSocketNotification).toHaveBeenCalledWith(
      'JAST_STOCKS_RESPONSE-instance_1',
      expect.objectContaining({ stocks: [] })
    )
  })

  it('ignores notifications it is not responsible for', async () => {
    await backend.socketNotificationReceived('SOME_OTHER_NOTIFICATION', {})

    expect(backend.sendSocketNotification).not.toHaveBeenCalled()
    expect(mockRequestStocks).not.toHaveBeenCalled()
  })
})
