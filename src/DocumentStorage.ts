import type { TStorageAdapter, TStorageErrorHandler, TStoreOptions, TVersionedData } from './storageTypes'

import { initStorageAsync } from './initStorageAsync'
import { pluginDataAdapter } from './pluginDataAdapter'
import { reportStorageError } from './reportStorageError'

/**
 * A store in the plugin data of the document: per file, shared by everyone who edits it.
 *
 * The same surface as `ClientStorage`: `data`, `initAsync()`, `writeAsync()`.
 * The document node is found in `initAsync`, so a store can be made before Figma
 * has a current page.
 *
 * Nothing throws. Without a document node `initAsync` reports `unavailable` and
 * keeps the defaults in `data`; `writeAsync` before a successful `initAsync`
 * reports `unavailable` and gives `false`.
 *
 * @example
 * const documentStorage = await new DocumentStorage<TDocumentData>({
 *   key: config.storages.document.key,
 *   version: config.version,
 *   defaults: { lastUsedVersion: config.version, templates: [] },
 * }).initAsync()
 */
class DocumentStorage<T extends TVersionedData> {
  data: T

  /** Set in `initAsync`: the document node does not exist yet at construction */
  private adapter: TStorageAdapter<T> | null = null
  private key: string
  private version: number
  private defaults: T
  private onError: TStorageErrorHandler | undefined

  constructor({ key, version, defaults, onError }: TStoreOptions<T>) {
    this.key = key
    this.version = version
    this.defaults = defaults
    this.onError = onError
    this.data = { ...defaults, lastUsedVersion: version }
  }

  /** Loads the stored value into `data`, with the migration of `initStorageAsync`. */
  async initAsync(): Promise<DocumentStorage<T>> {
    const documentNode = figma.currentPage?.parent

    if (!documentNode) {
      reportStorageError('DocumentStorage.initAsync()', 'unavailable', new Error('No document node'), this.onError)

      return this
    }

    this.adapter = pluginDataAdapter<T>(documentNode, this.key, this.onError)

    this.data = await initStorageAsync<T>({
      version: this.version,
      defaults: this.defaults,
      onError: this.onError,
      ...this.adapter,
    })

    return this
  }

  /** Stores `data`. `false` when the store is not initialized or Figma refused the write. */
  async writeAsync(): Promise<boolean> {
    if (!this.adapter) {
      reportStorageError(
        'DocumentStorage.writeAsync()',
        'unavailable',
        new Error('Call initAsync() before writeAsync()'),
        this.onError,
      )

      return false
    }

    return this.adapter.write(this.data)
  }
}

export { DocumentStorage }
