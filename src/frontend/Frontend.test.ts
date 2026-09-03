import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest'
import type { Config } from '../types/Config'

vi.mock('logger', () => ({
  warn: vi.fn(),
  log: vi.fn(),
  error: vi.fn(),
  debug: vi.fn()
}))

interface FrontendModule {
  defaults: Config
  start: () => void
  scheduleUpdate: () => void
  stop: () => void
  loadData: () => void
  getTemplateData: () => Record<string, unknown>
  socketNotificationReceived: (notificationIdentifier: string, payload: unknown) => void
  [key: string]: unknown
}

let registeredModule: FrontendModule

beforeAll(async () => {
  ;(globalThis as unknown as { config: { locale?: string } }).config = { locale: 'de-DE' }
  ;(globalThis as unknown as { Module: { register: (name: string, props: FrontendModule) => void } }).Module = {
    register: (_name: string, props: FrontendModule) => {
      registeredModule = props
    }
  }

  await import('./Frontend')
})

/**
 * Builds a module instance for testing, mimicking what MagicMirror does after Module.register.
 * @param configOverrides - Config values to override the module defaults with
 * @returns A module instance with mocked instance methods
 */
function createInstance(configOverrides: Partial<Config> = {}) {
  return {
    ...registeredModule,
    config: { ...registeredModule.defaults, ...configOverrides },
    identifier: 'instance_1',
    state: undefined,
    sendSocketNotification: vi.fn(),
    updateDom: vi.fn()
  }
}

describe('Frontend', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  it('uses the global locale as the default', () => {
    expect(registeredModule.defaults.locale).toBe('de-DE')
  })

  it('requests data and schedules updates on start', () => {
    const instance = createInstance()

    instance.start()

    expect(instance.sendSocketNotification).toHaveBeenCalledWith('JAST_STOCKS_REQUEST-instance_1', instance.config)
    expect(instance.updateDom).toHaveBeenCalled()

    instance.sendSocketNotification.mockClear()
    vi.advanceTimersByTime(instance.config.updateIntervalInSeconds * 1000)

    expect(instance.sendSocketNotification).toHaveBeenCalledWith('JAST_STOCKS_REQUEST-instance_1', instance.config)
  })

  it('maps the deprecated scroll option to displayMode', () => {
    const instance = createInstance({ scroll: 'table' })

    instance.start()

    expect(instance.config.displayMode).toBe('table')
  })

  it('clamps update intervals below 120 seconds', () => {
    const instance = createInstance({ updateIntervalInSeconds: 10 })

    instance.scheduleUpdate()

    expect(instance.config.updateIntervalInSeconds).toBe(120)
  })

  it('replaces a previous interval instead of stacking a second one', () => {
    const instance = createInstance()

    instance.scheduleUpdate()
    instance.scheduleUpdate()
    instance.sendSocketNotification.mockClear()

    vi.advanceTimersByTime(instance.config.updateIntervalInSeconds * 1000)

    expect(instance.sendSocketNotification).toHaveBeenCalledTimes(1)
  })

  it('stops polling once stopped', () => {
    const instance = createInstance()

    instance.scheduleUpdate()
    instance.stop()
    instance.sendSocketNotification.mockClear()

    vi.advanceTimersByTime(instance.config.updateIntervalInSeconds * 1000)

    expect(instance.sendSocketNotification).not.toHaveBeenCalled()
  })

  it('only updates state for its own socket notification', () => {
    const instance = createInstance()
    const payload = { stocks: [], lastUpdate: Date.now() }

    instance.socketNotificationReceived('JAST_STOCKS_RESPONSE-someone_else', payload)
    expect(instance.state).toBeUndefined()
    expect(instance.updateDom).not.toHaveBeenCalled()

    instance.socketNotificationReceived('JAST_STOCKS_RESPONSE-instance_1', payload)
    expect(instance.state).toBe(payload)
    expect(instance.updateDom).toHaveBeenCalled()
  })

  it('exposes an empty stock list to the template before the first response', () => {
    const instance = createInstance()

    const templateData = instance.getTemplateData()

    expect(templateData.stocks).toBeUndefined()
  })
})
