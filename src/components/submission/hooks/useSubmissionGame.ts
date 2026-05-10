import { useEffect, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import useQuizGenerator from '@/hooks/useQuizGenerator'
import { inputState, quizState } from '@/state'
import type { IFirebasePlayer } from '@/api/api.types'
import type { IHint } from '@/types'

const useSubmissionGame = (squad: IFirebasePlayer[]) => {
  const [hintArr, setHintArr] = useState<IHint[]>([])
  const [isCorrect, setIsCorrect] = useState(false)

  const setInputValue = useSetRecoilState(inputState)
  const quiz = useRecoilValue(quizState)
  const { generateQuiz } = useQuizGenerator(squad)

  const resetQuiz = () => {
    setIsCorrect(false)
    setHintArr([])
    setInputValue('')
  }

  const changeQuiz = () => {
    generateQuiz()
    resetQuiz()
  }

  useEffect(() => {
    if (!squad?.length) return
    generateQuiz()
  }, [squad, generateQuiz])

  return {
    quiz,
    hintArr,
    isCorrect,
    setIsCorrect,
    setHintArr,
    changeQuiz,
  }
}

export default useSubmissionGame
