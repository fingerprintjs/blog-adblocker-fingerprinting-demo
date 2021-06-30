import { RefObject, useCallback, useEffect, useState } from 'react'

interface Size {
  width: number
  height: number
}

/**
 * Taken from https://usehooks-typescript.com/react-hook/use-element-size
 */
export function useElementSize<T extends HTMLElement>(elementRef: RefObject<T>): Size {
  const [size, setSize] = useState<Size>({
    width: 0,
    height: 0,
  })

  // Prevent too many rendering using useCallback
  const updateSize = useCallback(() => {
    const node = elementRef?.current
    if (node) {
      setSize({
        width: node.offsetWidth || 0,
        height: node.offsetHeight || 0,
      })
    }
  }, [elementRef])

  useEffect(() => {
    updateSize()
    addEventListener('resize', updateSize)
    return () => {
      removeEventListener('resize', updateSize)
    }
  }, [])

  return size
}
