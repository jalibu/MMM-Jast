import { vi } from 'vitest'

export const info = vi.fn<(message: string, ...args: unknown[]) => void>()
export const warn = vi.fn<(message: string, ...args: unknown[]) => void>()
export const error = vi.fn<(message: string, ...args: unknown[]) => void>()
