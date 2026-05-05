import { recoilPersist } from 'recoil-persist'

export const { persistAtom: persistLeagueAtom } = recoilPersist({
  key: 'leagueInfo',
  storage: sessionStorage,
})
