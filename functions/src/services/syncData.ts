import { DEFAULT_API_PARAMS } from '@common/config'
import { ServerValue } from 'firebase-admin/database'
import { adminDb } from '../firebase/config'
import { logFetchError } from '../utils/logger'
import { sleep } from '../utils/timer'
import { fetchLeagueTeams } from './footballApi'
import { buildTeamSyncUpdates } from './syncTeam'
import type { FirebaseSyncUpdates } from './types'

const TEAM_SYNC_INTERVAL_MS = 10_000

export const syncData = async (): Promise<void> => {
  console.log('Firebase의 데이터 동기화 작업을 시작합니다')

  const leagueTeams = await fetchLeagueTeams(DEFAULT_API_PARAMS)
  if (leagueTeams.length === 0) {
    throw new Error('리그 팀 목록을 가져오지 못했습니다.')
  }

  const playerIdsInLeague: number[] = []
  const teamIds: number[] = []
  const failedTeams: string[] = []

  for (const { team } of leagueTeams) {
    try {
      const { updates, playerIds } = await buildTeamSyncUpdates(team)
      await adminDb.ref().update(updates)

      playerIdsInLeague.push(...playerIds)
      teamIds.push(team.id)
      console.log(`${team.name} 데이터 동기화 완료`)
    } catch (error) {
      logFetchError(error, `syncData - ${team.name}`)
      failedTeams.push(team.name)
    }

    await sleep(TEAM_SYNC_INTERVAL_MS)
  }

  const leagueUpdates: FirebaseSyncUpdates = {
    [`leagues/${DEFAULT_API_PARAMS.league}/updatedAt`]: ServerValue.TIMESTAMP,
    [`leagues/${DEFAULT_API_PARAMS.league}/playerIds`]: playerIdsInLeague,
    [`leagues/${DEFAULT_API_PARAMS.league}/teamIds`]: teamIds,
  }
  await adminDb.ref().update(leagueUpdates)

  console.log('Firebase의 데이터 동기화 작업을 종료합니다')

  if (failedTeams.length > 0) {
    throw new Error(`일부 팀 동기화 실패: ${failedTeams.join(', ')}`)
  }
}
