import type { TStorageAdapter, TStorageErrorHandler, TStoreOptions, TVersionedData } from './storageTypes'

import { clientStorageAdapter } from './clientStorageAdapter'
import { initStorageAsync } from './initStorageAsync'
import { reportStorageError } from './reportStorageError'

/**
 * A `figma.clientStorage` store: for each user, the same in each file.
 *
 * The store owns the persistence and the versions. The project owns the shape of the data and its use.
 * The store keeps `data` while its caller keeps the store.
 *
 * `data` holds the defaults from the construction until `initAsync` replaces them with the stored data.
 * It is never `undefined`: the plugin answers its UI when the file runs, and the first `initAsync` takes two round trips to Figma.
 * `data` is a copy, so a change before the load does not change the defaults of the merge.
 *
 * Nothing throws. A failed write gives `false`, a log line and a call of `onError`.
 *
 * @example
 * const clientStorage = await new ClientStorage<TClientData>({
 *   key: 'my-plugin',
 *   version: config.version,
 *   defaults: { lastUsedVersion: config.version, templates: [] },
 *   onError: (kind) => figma.notify(kind === 'quota' ? 'The storage is full' : 'Changes were not saved', { error: true }),
 * }).initAsync()
 *
 * clientStorage.data.templates.push(template)
 * await clientStorage.writeAsync()
 */
class ClientStorage<T extends TVersionedData> {
  data: T

  private adapter: TStorageAdapter<T>
  private key: string
  private version: number
  private defaults: T
  private onError: TStorageErrorHandler | undefined

  constructor({ key, version, defaults, onError }: TStoreOptions<T>) {
    this.adapter = clientStorageAdapter<T>(key, onError)
    this.key = key
    this.version = version
    this.defaults = defaults
    this.onError = onError
    this.data = { ...defaults, lastUsedVersion: version }
  }

  /** Loads the stored value into `data`, with the migration of `initStorageAsync`. */
  async initAsync(): Promise<ClientStorage<T>> {
    this.data = await initStorageAsync<T>({
      version: this.version,
      defaults: this.defaults,
      onError: this.onError,
      ...this.adapter,
    })

    return this
  }

  /** Stores `data`. `false` when Figma refused the write. */
  async writeAsync(): Promise<boolean> {
    return this.adapter.write(this.data)
  }

  /**
   * Removes the key from `figma.clientStorage`, so the next `initAsync` is a first run.
   *
   * `data` also goes back to the defaults. The store stays alive after the call, and a later `writeAsync` otherwise puts the removed value back.
   */
  async deleteAsync(): Promise<boolean> {
    try {
      await figma.clientStorage.deleteAsync(this.key)
    } catch (error) {
      reportStorageError('ClientStorage.deleteAsync()', 'write', error, this.onError)

      return false
    }

    this.data = { ...this.defaults, lastUsedVersion: this.version }

    return true
  }
}

export { ClientStorage }
