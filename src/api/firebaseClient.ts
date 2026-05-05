// firebase axios 인스턴스
import axios from 'axios'

const FIREBASE_API_CONFIG = {
  FIREBASE_API_BASE_URL:
    'https://real-time-db--find-player-default-rtdb.firebaseio.com',
  FIREBASE_API_HEADERS: { 'Content-Type': 'application/json' },
} as const

export const firebaseApiInstance = axios.create({
  baseURL: FIREBASE_API_CONFIG.FIREBASE_API_BASE_URL,
  headers: FIREBASE_API_CONFIG.FIREBASE_API_HEADERS,
})
