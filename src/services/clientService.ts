// firebase -> client
import { firebaseApiInstance } from '../api/firebaseClient'
import { FIREBASE_API_ENDPOINT } from '../constant'
import { getFirebaseURLPath } from '../utils/path'
import type { IFirebaseTeamDetail } from '../types'
import type { FirebaseReturnPath } from '../utils/path'
import type { IFirebasePlayer } from '@/api/api.types'

export type FilteringPlayerNode = {
  info: IFirebasePlayer
}

export type FilteringPlayersByNameRaw = Record<string, FilteringPlayerNode>

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
): Promise<IFirebasePlayer> => {
  const url = FIREBASE_API_ENDPOINT.PLAYERS(playerId)

  return await fetchFirebaseData<IFirebasePlayer>(getFirebaseURLPath(url))
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

// 이름 기준 필터링 (RTDB 객체 맵 응답)
export const fetchFilteringPlayersByName = async ({
  limit,
  capitalizedValue,
}: {
  limit: number
  capitalizedValue: string
}): Promise<FilteringPlayersByNameRaw> => {
  const url = FIREBASE_API_ENDPOINT.TOTAL_PLAYERS()

  const params = new URLSearchParams({
    orderBy: JSON.stringify('info/name'),
    limitToFirst: String(limit),
    startAt: JSON.stringify(capitalizedValue),
    endAt: JSON.stringify(`${capitalizedValue}\uf8ff`),
  })

  const pathWithQuery =
    `${getFirebaseURLPath(url)}?${params.toString()}` as FirebaseReturnPath
  return await fetchFirebaseData<FilteringPlayersByNameRaw>(pathWithQuery)
}

// TODO: 삭제 예정, 선수 데이터를 프리페칭하면 네트워크 요청 수가 많아져 성능 저하 (id만 프리페칭 하거나 조회하도록 변경)
// 선수 데이터 조회는 RTDB 쿼리 조회로 테스트 후 변경

// 리그 내 선수 id를 통해 선수 정보 조회
export const fetchPlayersDataInLeagueByIds = async (
  playerIds: number[],
): Promise<IFirebasePlayer[]> => {
  return Promise.all(playerIds.map(id => fetchPlayer(id)))
}

// TODO: 입력 값과 일치하는 선수 데이터 조회
// export const fetchPlayersDataByValue = async (
//   value: string,
// ): Promise<IFirebasePlayer[]> => {
//   const url = FIREBASE_API_ENDPOINT.TOTAL_PLAYERS()

//   return await fetchFirebaseData<IFirebasePlayer[]>(getFirebaseURLPath(url))

//   // return Promise.all(value.split(' ').map(id => fetchPlayer(id)))
// }

/** `/players/{id}` 노드 기준으로 정렬할 자식 경로 (Rules `.indexOn`과 일치해야 함) */
// export type PlayersOrderByChildPath = 'info/name' | 'name'

// export type FetchPlayersByNamePrefixOptions = {
//   limit?: number
//   orderByChildPath?: PlayersOrderByChildPath
//   /** RTDB는 복합 쿼리가 어려워 응답 후 클라이언트에서 필터 */
//   leagueId?: number
// }

/**
 * 이름 **prefix** 기준 RTDB 쿼리 (contains / 대소문자 무시 아님).
 * `players/{id}/info` 에 `name` 이 있으면 `orderByChildPath: 'info/name'`(기본).
 */
// export const fetchPlayersDataByValue = async (
//   value: string,
//   options?: FetchPlayersByNamePrefixOptions,
// ): Promise<IFirebasePlayer[]> => {
//   const trimmed = value.trim()
//   if (!trimmed) return []

//   const limit = options?.limit ?? 30
//   // const orderByChildPath = options?.orderByChildPath ?? '$id/info/name'
//   const path = getFirebaseURLPath(FIREBASE_API_ENDPOINT.TOTAL_PLAYERS())

//   const { data } = await firebaseApiInstance.get<Record<
//     string,
//     unknown
//   > | null>(path, {
//     params: {
//       // orderBy: JSON.stringify(orderByChildPath),
//       // startAt: JSON.stringify(trimmed),
//       // endAt: JSON.stringify(`${trimmed}\uf8ff`),
//       limitToFirst: limit,
//     },
//   })

//   if (data == null || typeof data !== 'object') return []

//   const rows = Object.entries(data).map(([playerIdKey, raw]) =>
//     normalizePlayerRow(raw, playerIdKey),
//   )

//   const filtered = options?.leagueId
//     ? rows.filter(p => p.leagueId === options.leagueId)
//     : rows

//   return filtered
// }

// function normalizePlayerRow(
//   raw: unknown,
//   fallbackIdKey: string,
// ): IFirebasePlayer {
//   if (raw != null && typeof raw === 'object' && 'info' in raw) {
//     const info = (raw as { info?: unknown }).info
//     if (info != null && typeof info === 'object' && 'name' in info) {
//       return coercePlayer(info as IFirebasePlayer, fallbackIdKey)
//     }
//   }
//   if (raw != null && typeof raw === 'object' && 'name' in raw) {
//     return coercePlayer(raw as IFirebasePlayer, fallbackIdKey)
//   }
//   throw new Error('Unexpected player snapshot shape from RTDB query')
// }

// function coercePlayer(
//   p: IFirebasePlayer,
//   fallbackIdKey: string,
// ): IFirebasePlayer {
//   const id =
//     typeof p.id === 'number' && !Number.isNaN(p.id)
//       ? p.id
//       : Number.parseInt(fallbackIdKey, 10)
//   return { ...p, id: Number.isFinite(id) ? id : p.id }
// }

// /** 기존 TODO 이름 유지 — 동작은 prefix 조회 */
// export const fetchPlayersDataByValue = fetchPlayersDataByNamePrefix
