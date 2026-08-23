import axios from 'axios'
import { sleep } from './timer'

const RATE_LIMIT_WAIT_MS = 65_000

const isRateLimitError = (error: unknown): boolean => {
  if (!axios.isAxiosError(error)) return false
  if (error.response?.status === 429) return true

  const data = error.response?.data as { errors?: { rateLimit?: unknown } } | undefined
  return data?.errors?.rateLimit != null
}

export const retryOnRateLimit = async <T>(
  fn: () => Promise<T>,
  retries = 1,
): Promise<T> => {
  try {
    return await fn()
  } catch (error) {
    if (retries > 0 && isRateLimitError(error)) {
      console.log(
        `⚠️ Rate Limit 감지됨. 65초 대기 후 재시도합니다... (남은 횟수: ${retries})`,
      )
      await sleep(RATE_LIMIT_WAIT_MS)
      return retryOnRateLimit(fn, retries - 1)
    }
    throw error
  }
}
