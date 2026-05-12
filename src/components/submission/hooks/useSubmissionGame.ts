import { useState } from 'react'
import { useSetRecoilState } from 'recoil'

import { inputState } from '@/state'
import type { IHint } from '@/types'

interface IUseSubmissionGameProps {
  generateQuiz: () => void
}

// 퀴즈 변경 및 리셋 시 UI 변경 책임 hook
const useSubmissionGame = ({ generateQuiz }: IUseSubmissionGameProps) => {
  const [hintArr, setHintArr] = useState<IHint[]>([])
  const [isCorrect, setIsCorrect] = useState(false)

  const setInputValue = useSetRecoilState(inputState)

  const resetQuiz = () => {
    setIsCorrect(false)
    setHintArr([])
    setInputValue('')
  }

  const changeQuiz = () => {
    generateQuiz()
    resetQuiz()
  }

  return {
    hintArr,
    isCorrect,
    setIsCorrect,
    setHintArr,
    changeQuiz,
  }
}

export default useSubmissionGame
