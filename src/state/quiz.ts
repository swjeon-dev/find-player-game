// import { queryClient } from '@/queryClient'
// import { generateQuiz } from '@/utils/generateQuiz'
import { atom } from 'recoil'

import type { IFirebasePlayer } from 'shared/api.types'

type Quiz = IFirebasePlayer

export const quizState = atom<Quiz | null>({
  key: 'player',
  default: null,
  // effects_UNSTABLE: [persistAtom],
})

// @tanstack/react-query-persist-client
// 새로고침 시 데이터(localStorage) 유지 가능
// const { persistAtom } = recoilPersist({
//   key: 'quiz',
//   storage: sessionStorage,
// })

// queryKey: ['players', 'league', leagueInfo.id, leagueInfo.season]

// export const problem = selector({
//   key: 'quiz',
//   get: ({ get }) => {
//     const leagueInfo = get(leagueInfoState)
//     const players: any[] | null = queryClient.getQueryData([
//       'players',
//       'league',
//       leagueInfo.id,
//     ])
//     if (!players) return null
//     return generateQuiz(players)
//   },
// })
