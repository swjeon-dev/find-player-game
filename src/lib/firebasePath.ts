import type { FIREBASE_API_ENDPOINT } from '@/shared'

export type FirebaseReturnPath = ReturnType<
  (typeof FIREBASE_API_ENDPOINT)[keyof typeof FIREBASE_API_ENDPOINT]
>

export const getFirebaseURLPath = (route: FirebaseReturnPath) => route + '.json'
