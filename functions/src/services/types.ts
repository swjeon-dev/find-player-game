import { ServerValue } from 'firebase-admin/database'
import type { IFirebasePlayer } from '@common/model'
import type { ITeam } from '../types/api-external.types'

export type FirebaseTimestamp = typeof ServerValue.TIMESTAMP

export type FirebaseSyncUpdates = Record<
  string,
  ITeam | IFirebasePlayer | number[] | FirebaseTimestamp
>
