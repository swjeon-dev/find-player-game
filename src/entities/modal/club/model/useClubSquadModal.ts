import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { useSetRecoilState } from 'recoil'

import { inputState } from '@/state'

export const useSelectPlayer = (cb: () => void) => {
  const setValue = useSetRecoilState(inputState)

  return useCallback(
    (name: string) => {
      setValue(name)
      cb()
    },
    [cb, setValue],
  )
}

// props 타입 정의
interface IUseModalPositionProps {
  listRef: React.RefObject<HTMLUListElement>
  parentRef: React.RefObject<HTMLElement>
  triggerKey: number
}

export const useModalPosition = ({
  listRef,
  parentRef,
  triggerKey,
}: IUseModalPositionProps): { x: boolean; y: boolean } => {
  const [isTransfer, setIsTransfer] = useState({ x: false, y: false })

  const recalcPosition = useCallback(() => {
    if (!listRef.current || !parentRef.current) return

    const { innerWidth, innerHeight } = window
    const rect = parentRef.current.getBoundingClientRect()
    const { clientHeight, clientWidth } = listRef.current

    const isTransferYPosition = innerHeight - rect.bottom < clientHeight
    const isTransferXPosition = innerWidth - rect.right + 50 < clientWidth

    setIsTransfer({ x: isTransferXPosition, y: isTransferYPosition })
  }, [listRef, parentRef])

  useLayoutEffect(() => {
    if (!listRef.current) return

    const observer = new ResizeObserver(recalcPosition)

    observer.observe(listRef.current as Element)

    return () => observer.disconnect()
  }, [recalcPosition, triggerKey])

  useEffect(() => {
    recalcPosition()
  }, [triggerKey, recalcPosition])

  return isTransfer
}
