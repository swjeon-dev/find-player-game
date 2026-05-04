import useFetchingPlayersDataInLeague from './useFetchingPlayersDataInLeague'
import { useRecoilState, useRecoilValue } from 'recoil'
import { leagueInfoState, quizState } from '@/atoms/quizState'
import { useCallback } from 'react'
// import { DEFAULT_API_PARAMS } from 'shared/params'

const useQuizGenerator = () => {
  const leagueInfo = useRecoilValue(leagueInfoState)
  const [prevQuiz, setQuiz] = useRecoilState(quizState)
  const { playersInLeague: squads } = useFetchingPlayersDataInLeague(
    leagueInfo.id,
  )

  const generateRandomPlayer = useCallback(() => {
    if (!squads || squads.length === 0) return

    const availablePlayers = squads.filter(player => player.id !== prevQuiz?.id)
    const players = availablePlayers.length > 0 ? availablePlayers : squads

    const randomIdx = Math.floor(Math.random() * players.length)
    const nextPlayer = players[randomIdx]

    setQuiz(nextPlayer)
  }, [squads])

  return { generateRandomPlayer }
}

export default useQuizGenerator
