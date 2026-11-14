import { readFileSync } from 'node:fs'
import { describe, it, expect, vi, afterEach } from 'vitest'

const template = readFileSync(new URL('../../templates/TableStockList.njk', import.meta.url), 'utf8')

/**
 * Extracts the inline onload handler of the table template and renders its nunjucks placeholders.
 * @returns The JavaScript source of the handler
 */
function getOnloadSource() {
  const match = /<style onload="([^"]*)"/.exec(template)
  if (!match) throw new Error('onload handler not found')
  return match[1].replace('{{ config.stocksPerPage }}', '2').replace('{{ config.fadeSpeedInSeconds }}', '1')
}

/**
 * Builds a minimal fake DOM matching what the onload handler touches.
 * @param rowCount - Number of table rows
 * @returns The style element (handler `this`) and its rows
 */
function createFakeDom(rowCount: number) {
  const rows = Array.from({ length: rowCount }, () => {
    const classes = new Set(['hide'])
    return {
      classes,
      classList: {
        replace: (from: string, to: string) => {
          if (!classes.delete(from)) return false
          classes.add(to)
          return true
        }
      }
    }
  })
  const wrapper = {
    isConnected: true,
    querySelector: (selector: string) => (selector === 'tbody' ? { getElementsByTagName: () => rows } : null)
  }
  const element = { closest: (selector: string) => (selector === '.jast-wrapper' ? wrapper : null) }
  return { element, rows }
}

describe('TableStockList onload handler', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows stocksPerPage rows when run with the style element as this', () => {
    vi.useFakeTimers()
    const { element, rows } = createFakeDom(4)

    new Function(getOnloadSource()).call(element)

    expect(rows.map((row) => row.classes.has('show'))).toEqual([true, true, false, false])

    vi.advanceTimersByTime(1000)

    expect(rows.map((row) => row.classes.has('show'))).toEqual([false, false, true, true])
  })
})
