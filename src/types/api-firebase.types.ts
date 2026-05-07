import type { IFirebasePlayer } from '@/api/api.types'

export interface IFirebaseTeamDetail {
  id: number
  name: string
  code: string
  country: string
  founded: number
  logo: string
  national: boolean
}
export interface IFirebaseTeamPlayerIds {
  playerIds: number[]
}

export interface IHint {
  q: IFirebasePlayer
  a: IFirebasePlayer
}
