import { atom } from 'recoil'
import { persistLeagueAtom } from './persist'

export const leagueInfoState = atom<{ id: number }>({
  key: 'leagueInfo',
  default: {
    id: null,
  },
  effects_UNSTABLE: [persistLeagueAtom],
})
