import { useSetRecoilState } from 'recoil'
import { quizState } from '@/state'

import type { IFirebasePlayer } from '@/api/api.types'

const useQuizGenerator = (
  players: IFirebasePlayer[],
): {
  generateQuiz: () => void
} => {
  const setQuiz = useSetRecoilState(quizState)
  let newQuiz

  const generateQuiz = () => {
    setQuiz(prevQuiz => {
      if (players?.length) {
        const length = players.length
        const randomIdx = Math.floor(Math.random() * length)
        newQuiz = players[randomIdx]

        while (prevQuiz?.id === newQuiz.id) {
          newQuiz = players[Math.floor(Math.random() * length)]
        }

        return newQuiz
      }
    })
  }
  return { generateQuiz }
}

export default useQuizGenerator
