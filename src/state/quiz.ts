// import { queryClient } from '@/queryClient'
// import { generateQuiz } from '@/utils/generateQuiz'
import { atom } from 'recoil'

import type { IFirebasePlayer } from '@/api/api.types'

type Quiz = IFirebasePlayer

export const quizState = atom<Quiz | null>({
  key: 'quizPlayer',
  default: null,
  // effects_UNSTABLE: [persistAtom],
})

// @tanstack/react-query-persist-client
// 새로고침 시 데이터(localStorage) 유지 가능
// const { persistAtom } = recoilPersist({
//   key: 'quiz',
//   storage: sessionStorage,
// })
