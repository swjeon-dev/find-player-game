import { footballApiInstance } from '../api/externalClient'
import { FOOTBALL_API_ENDPOINT } from '../constant/footballRoutes'
import { logFetchError } from '../utils/logger'
import { retryOnRateLimit } from '../utils/retryOnRateLimit'
import type {
  IGetLeagueTeams,
  IGetTeamSquads,
  ILeagueTeamEntry,
  ITeamSquad,
} from '../types/api-external.types'

interface IFetchLeagueParams {
  league: number
  season: number
}

export const fetchLeagueTeams = async ({
  league,
  season,
}: IFetchLeagueParams): Promise<ILeagueTeamEntry[]> => {
  try {
    const response = await footballApiInstance.get<IGetLeagueTeams>(
      FOOTBALL_API_ENDPOINT.LEAGUE_TEAMS,
      { params: { league, season } },
    )

    if (!response.data?.response?.length) {
      throw new Error('리그 팀 목록을 가져오지 못했습니다.')
    }

    return response.data.response
  } catch (error) {
    logFetchError(error, 'footballApi - fetchLeagueTeams')
    throw error
  }
}

export const fetchTeamSquad = async (teamId: number): Promise<ITeamSquad> => {
  try {
    const response = await footballApiInstance.get<IGetTeamSquads>(
      FOOTBALL_API_ENDPOINT.TEAM_SQUADS,
      { params: { team: teamId } },
    )

    if (!response.data?.response?.length) {
      throw new Error('팀의 선수 정보를 가져오지 못했습니다.')
    }

    return response.data.response[0]
  } catch (error) {
    logFetchError(error, 'footballApi - fetchTeamSquad')
    throw error
  }
}

export const fetchTeamSquadWithRetry = (teamId: number): Promise<ITeamSquad> =>
  retryOnRateLimit(() => fetchTeamSquad(teamId))
