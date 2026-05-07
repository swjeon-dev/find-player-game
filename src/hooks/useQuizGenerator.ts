import useFetchingPlayersDataInLeague from './useFetchingPlayersDataInLeague'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { leagueInfoState, quizState } from '@/state'
import { useCallback } from 'react'
import type { IFirebasePlayer } from 'shared/api.types'

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
// const useQuizGenerator = () => {
//   const leagueInfo = useRecoilValue(leagueInfoState)
//   const setQuiz = useSetRecoilState(quizState)
//   const { playersInLeague: squads } = useFetchingPlayersDataInLeague({
//     leagueId: leagueInfo.id,
//   })

//   // TODO: filter 구조 개선 (성능 확인)
//   const generateRandomPlayer = useCallback(() => {
//     setQuiz(prev => {
//       if (!squads || squads.length === 0) return prev

//       const availablePlayers = squads.filter(player => player.id !== prev?.id)
//       const players = availablePlayers.length > 0 ? availablePlayers : squads

//       const randomIdx = Math.floor(Math.random() * players.length)
//       console.log('players[randomIdx]', players[randomIdx])
//       return players[randomIdx]
//     })
//   }, [squads, setQuiz])

//   return { generateRandomPlayer }
// }

// export default useQuizGenerator
