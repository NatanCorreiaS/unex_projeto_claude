import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useActiveSection } from './useActiveSection'

type ObserverCallback = (entries: Partial<IntersectionObserverEntry>[]) => void

let lastCallback: ObserverCallback | null = null
const observe = vi.fn()
const disconnect = vi.fn()

class MockIntersectionObserver {
  constructor(callback: ObserverCallback) {
    lastCallback = callback
  }
  observe = observe
  disconnect = disconnect
  unobserve = vi.fn()
}

beforeEach(() => {
  lastCallback = null
  observe.mockClear()
  disconnect.mockClear()
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)

  document.body.innerHTML = '<section id="sobre"></section><section id="cursos"></section>'
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('useActiveSection', () => {
  it('retorna a primeira seção como valor inicial', () => {
    const { result } = renderHook(() => useActiveSection(['sobre', 'cursos']))
    expect(result.current).toBe('sobre')
  })

  it('atualiza para a seção mais visível reportada pelo observer', () => {
    const { result } = renderHook(() => useActiveSection(['sobre', 'cursos']))

    act(() => {
      lastCallback?.([
        {
          isIntersecting: true,
          intersectionRatio: 0.8,
          target: document.getElementById('cursos') as Element,
        },
      ])
    })

    expect(result.current).toBe('cursos')
  })
})
