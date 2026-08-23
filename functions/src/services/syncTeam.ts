import { ServerValue } from 'firebase-admin/database'
import { DEFAULT_API_PARAMS } from '@common/config'
import type { IFirebasePlayer } from '@common/model'
import type { ITeam } from '../types/api-external.types'
import { fetchTeamSquadWithRetry } from './footballApi'
import { normalizePlayerName } from './normalizePlayerName'
import type { FirebaseSyncUpdates } from './types'

export const buildTeamSyncUpdates = async (
  team: ITeam,
): Promise<{ updates: FirebaseSyncUpdates; playerIds: number[] }> => {
  const updates: FirebaseSyncUpdates = {
    [`teams/${team.id}/info`]: { ...team },
    [`teams/${team.id}/updatedAt`]: ServerValue.TIMESTAMP,
  }

  const squadData = await fetchTeamSquadWithRetry(team.id)
  const players = squadData.players ?? []

  if (players.length === 0) {
    console.warn(`${team.name} 선수 데이터가 없습니다`)
    updates[`teams/${team.id}/playerIds`] = []
    return { updates, playerIds: [] }
  }

  const playerIds = players.map(player => {
    const info: IFirebasePlayer = {
      ...player,
      name: normalizePlayerName(player.name),
      teamId: team.id,
      teamLogo: team.logo,
      leagueId: DEFAULT_API_PARAMS.league,
    }

    updates[`players/${player.id}/info`] = info
    updates[`players/${player.id}/updatedAt`] = ServerValue.TIMESTAMP
    return player.id
  })

  updates[`teams/${team.id}/playerIds`] = playerIds
  return { updates, playerIds }
}
