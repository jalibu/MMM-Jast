import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const css = readFileSync(new URL('../../MMM-Jast.css', import.meta.url), 'utf8')

describe('MMM-Jast.css', () => {
  it('scopes table cell padding to the module, including default-table mode', () => {
    expect(css).toMatch(/\.MMM-Jast \.jast-wrapper\.table th,\s*\.MMM-Jast td\s*\{\s*padding-right:\s*0\.5em;\s*\}/)
  })

  it('scopes both change value separators to the ticker wrapper', () => {
    expect(css).toMatch(
      /\.jast-wrapper span\.jast-change-value:nth-child\(2\)::before,\s*\.jast-wrapper span\.jast-change-value:nth-child\(3\)::before\s*\{\s*content:\s*' \| ';\s*\}/
    )
  })
})
