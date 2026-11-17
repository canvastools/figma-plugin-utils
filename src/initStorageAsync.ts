import type { TInitStorageOptions, TVersionedData } from './storageTypes'

import { reportStorageError } from './reportStorageError'

/**
 * Reads a versioned value from a storage, and brings it to the current shape.
 *
 * Works with any backend: pass the `read` / `write` pair of `clientStorageAdapter`,
 * of `pluginDataAdapter`, or your own.
 *
 * - Nothing stored: writes the defaults and returns them.
 * - The same version: returns the value, with the keys that `defaults` gained since it was written.
 *   So a new key needs no version bump.
 * - Another version: adds the missing keys, keeps the stored values, stamps the current version.
 * - A value that is not an object with `lastUsedVersion`: reports `corrupt`, then starts
 *   again from the defaults. A store that refused such a value on every launch would
 *   leave its user with a plugin that never opens.
 *
 * A stored value always wins over a default. Nothing throws: a failed read is a first run.
 *
 * @example
 * const data = await initStorageAsync({
 *   version: config.version,
 *   defaults: { lastUsedVersion: config.version, theme: 'light' },
 *   ...clientStorageAdapter<TClientData>('my-plugin'),
 * })
 */
const initStorageAsync = async <T extends TVersionedData>(options: TInitStorageOptions<T>): Promise<T> => {
  const { version, defaults, read, write, onError } = options

  const fresh = (): T => ({ ...defaults, lastUsedVersion: version })

  let existing: T | null

  try {
    existing = await read()
  } catch (error) {
    reportStorageError('initStorageAsync()', 'unavailable', error, onError)

    return fresh()
  }

  if (existing == null) {
    const data = fresh()

    await write(data)

    return data
  }

  if (typeof existing !== 'object' || typeof (existing as Partial<TVersionedData>).lastUsedVersion !== 'number') {
    reportStorageError('initStorageAsync()', 'corrupt', existing, onError)

    const data = fresh()

    await write(data)

    return data
  }

  if (existing.lastUsedVersion === version) {
    const stored = existing
    const hasEveryKey = Object.keys(defaults).every((key) => key in stored)

    if (hasEveryKey) {
      return stored
    }

    const backfilled = { ...defaults, ...stored }

    await write(backfilled)

    return backfilled
  }

  const migrated = { ...defaults, ...existing, lastUsedVersion: version }

  await write(migrated)

  return migrated
}

export { initStorageAsync }
