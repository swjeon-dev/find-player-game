import { useEffect, useRef, useState } from 'react'

function useHeaderObserver(): {
  height: number
  headerRef: React.RefObject<HTMLElement>
} {
  const [headerHeight, setHeaderHeight] = useState(0)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!headerRef.current) return
    const observer = new ResizeObserver(entries => {
      setHeaderHeight(entries[0].borderBoxSize[0].blockSize)
    })

    observer.observe(headerRef.current)

    return () => observer.disconnect()
  }, [])

  return { height: headerHeight, headerRef }
}

export default useHeaderObserver
