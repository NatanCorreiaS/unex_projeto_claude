import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { useScrolled } from './useScrolled'

function setScrollY(value: number) {
  Object.defineProperty(window, 'scrollY', { value, writable: true, configurable: true })
}

afterEach(() => {
  setScrollY(0)
})

describe('useScrolled', () => {
  it('começa falso quando a página está no topo', () => {
    setScrollY(0)
    const { result } = renderHook(() => useScrolled())
    expect(result.current).toBe(false)
  })

  it('fica verdadeiro após rolar além do limite', () => {
    setScrollY(0)
    const { result } = renderHook(() => useScrolled(24))

    act(() => {
      setScrollY(100)
      window.dispatchEvent(new Event('scroll'))
    })

    expect(result.current).toBe(true)
  })
})
