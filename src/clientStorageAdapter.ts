import type { TStorageAdapter, TStorageErrorHandler } from './storageTypes'

import { isQuotaError } from './isQuotaError'
import { reportStorageError } from './reportStorageError'

/**
 * `figma.clientStorage` as a storage adapter: for each user, the same in each file.
 *
 * `read` gives `null` for an absent key and for a failed read.
 * `write` gives `false` when Figma refuses the value, for example when the storage is full.
 * `onError` then gets `quota` or `write`.
 *
 * @example
 * const { read, write } = clientStorageAdapter<TClientData>('my-plugin')
 */
const clientStorageAdapter = <T>(key: string, onError?: TStorageErrorHandler): TStorageAdapter<T> => ({
  read: async () => {
    try {
      const data = await figma.clientStorage.getAsync(key)

      return (data as T) ?? null
    } catch (error) {
      reportStorageError('clientStorageAdapter().read', 'unavailable', error, onError)

      return null
    }
  },
  write: async (data) => {
    try {
      await figma.clientStorage.setAsync(key, data)

      return true
    } catch (error) {
      reportStorageError('clientStorageAdapter().write', isQuotaError(error) ? 'quota' : 'write', error, onError)

      return false
    }
  },
})

export { clientStorageAdapter }
