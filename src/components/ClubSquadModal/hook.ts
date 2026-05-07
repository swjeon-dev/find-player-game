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

export const useModalPosition = (listRef, parentRef, deps): boolean => {
  const [isToMove, setIsToMove] = useState(false)

  useEffect(() => {
    if (!listRef.current || !parentRef.current) return

    const { bottom } = parentRef.current.getBoundingClientRect()
    const playListHeight = listRef.current.clientHeight
    const screenHeight = window.innerHeight

    const isListToTransfer = screenHeight - bottom < playListHeight

    setIsToMove(isListToTransfer)
  }, deps)

  return isToMove
}
