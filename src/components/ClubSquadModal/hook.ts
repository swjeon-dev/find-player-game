import { useCallback, useEffect, useState } from 'react'
import { useSetRecoilState } from 'recoil'

import { inputState } from '@/state'

export const useSelectPlayer = (cb: () => void) => {
  const setValue = useSetRecoilState(inputState)

  return useCallback((name: string) => {
    setValue(name)
    cb()
  }, [])
}

export const useModalPosition = (listRef, parentRef, triggerKey): boolean => {
  const [isToMove, setIsToMove] = useState(false)

  const recalcPosition = useCallback(() => {
    if (!listRef.current || !parentRef.current) return

    const { bottom } = parentRef.current.getBoundingClientRect()
    const playListHeight = listRef.current.clientHeight
    const screenHeight = window.innerHeight

    const isListToTransfer = screenHeight - bottom < playListHeight

    setIsToMove(isListToTransfer)
  }, [listRef, parentRef])

  useEffect(() => {
    recalcPosition()
  }, [triggerKey, recalcPosition])

  useEffect(() => {
    if (!listRef.current) return

    const observer = new ResizeObserver(() => recalcPosition())

    observer.observe(listRef.current)

    return () => observer.disconnect()
  }, [recalcPosition])

  useEffect(() => {
    window.addEventListener('resize', recalcPosition)
    return () => window.removeEventListener('resize', recalcPosition)
  }, [recalcPosition])

  return isToMove
}
