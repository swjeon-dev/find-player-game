import type { IPlayer } from '@common/model'

interface IPaging {
  current: number
  total: number
}

export interface IGetLeagueTeams {
  get: string
  parameters: {
    league: string
    season: string
  }
  errors: unknown
  results: number
  paging: IPaging
  response: ILeagueTeamEntry[]
}

export interface ILeagueTeamEntry {
  team: ITeam
}

export interface ITeam {
  id: number
  name: string
  code: string
  country: string
  founded: number
  national: boolean
  logo: string
}

export interface IGetTeamSquads {
  get: string
  parameters: {
    team: string
  }
  errors: unknown
  results: number
  paging: IPaging
  response: ITeamSquad[]
}

export interface ITeamSquad {
  team: {
    id: number
    name: string
    logo: string
  }
  players: IPlayer[]
}
