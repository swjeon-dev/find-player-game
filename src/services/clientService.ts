// firebase -> client
import { firebaseApiInstance } from '../api/firebaseClient'
import { FIREBASE_API_ENDPOINT } from '../constant'
import { getFirebaseURLPath } from '../utils/path'
import type { IFirebaseTeamDetail } from '../types'
import type { FirebaseReturnPath } from '../utils/path'
import type { IFirebasePlayer } from '@/api/api.types'

// tanstack query와 함께 사용할 때, 데이터를 가져오는 fetch 함수에서 try-catch를 사용하면
// tanstack query의 error 상태가 동작하지 않을 수 있습니다

// 39: PL
const fetchFirebaseData = async <T>(path: FirebaseReturnPath): Promise<T> => {
  const response = await firebaseApiInstance.get<T>(path)

  return response.data
}

// 팀 조회

// 하나의 팀 조회
export const fetchTeam = async (
  teamId: number,
): Promise<IFirebaseTeamDetail> => {
  const url = FIREBASE_API_ENDPOINT.TEAM_DETAIL(teamId)

  return await fetchFirebaseData<IFirebaseTeamDetail>(getFirebaseURLPath(url))
}

// 리그 내 모든 팀 id 조회
export const fetchTeamIdsInLeague = async (
  leagueId: number,
): Promise<number[]> => {
  const url = FIREBASE_API_ENDPOINT.LEAGUE_TEAM_IDS(leagueId)

  return await fetchFirebaseData<number[]>(getFirebaseURLPath(url))
}

// 선수 조회

// 선수 정보 조회
export const fetchPlayer = async (
  playerId: number,
): Promise<IFirebasePlayer[]> => {
  const url = FIREBASE_API_ENDPOINT.PLAYERS(playerId)

  return await fetchFirebaseData<IFirebasePlayer[]>(getFirebaseURLPath(url))
}

// 팀의 모든 선수 id 조회
export const fetchTeamPlayerIds = async (teamId: number): Promise<number[]> => {
  const url = FIREBASE_API_ENDPOINT.TEAM_PLAYER_IDS(teamId)

  return await fetchFirebaseData<number[]>(getFirebaseURLPath(url))
}

// 리그 내 모든 선수 id 조회
export const fetchPlayerIdsInLeague = async (
  leagueId: number,
): Promise<number[]> => {
  const url = FIREBASE_API_ENDPOINT.LEAGUE_PLAYER_IDS(leagueId)

  return await fetchFirebaseData<number[]>(getFirebaseURLPath(url))
}

// 리그 내 선수 id 조회
export const fetchPlayersIdInLeague = async (
  leagueId: number,
): Promise<number[]> => {
  const playerIds = await fetchPlayerIdsInLeague(leagueId)

  return playerIds
}

// 리그 내 선수 id를 통해 선수 정보 조회
export const fetchPlayersDataInLeagueByIds = async (
  playerIds: number[],
): Promise<IFirebasePlayer[]> => {
  const requestPromise = playerIds.map(id => fetchPlayer(id))
  const players = await Promise.all(requestPromise).then(result =>
    result.flat(),
  )

  return players
}
