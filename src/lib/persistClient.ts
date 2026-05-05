import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { queryClient } from './queryClient'

const persister = createAsyncStoragePersister({
  storage: window.localStorage,
})

export const setupQueryPersist = () => {
  persistQueryClient({
    queryClient,
    persister,
    maxAge: 1000 * 60 * 5,

    buster: 'v1', // 구조 변경 시 초기화

    dehydrateOptions: {
      shouldDehydrateQuery: query => {
        const key = query.queryKey

        // 특정 query만 persist
        return Array.isArray(key) && key[0] === 'persist'
      },
    },
  })
}
