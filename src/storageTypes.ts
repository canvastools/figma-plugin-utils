/** Each stored object holds the version of the plugin that wrote it last. */
export type TVersionedData = { lastUsedVersion: number }

/**
 * The type of a store failure, for the caller that tells the user.
 *
 * - `corrupt`: the stored value is not an object with `lastUsedVersion`.
 * - `quota`: Figma refused the write because the storage is full.
 * - `write`: the write failed for another reason.
 * - `unavailable`: the store cannot reach the storage, for example before the document node exists.
 */
export type TStorageErrorKind = 'corrupt' | 'quota' | 'write' | 'unavailable'

/**
 * The handler that a store calls when it cannot read or write.
 * The store logged the error and returned its safe answer before the call. The project shows its toast here.
 */
export type TStorageErrorHandler = (kind: TStorageErrorKind, error: unknown) => void

/** A place to read one value from and write it back to. `write` says if the storage kept the value. */
export type TStorageAdapter<T> = {
  read: () => T | null | Promise<T | null>
  write: (data: T) => boolean | Promise<boolean>
}

/** An adapter over a synchronous backend. A `TStorageAdapter<T>` accepts it. */
export type TSyncStorageAdapter<T> = {
  read: () => T | null
  write: (data: T) => boolean
}

export type TInitStorageOptions<T extends TVersionedData> = {
  /** The current version of the plugin. */
  version: number
  /** The shape that the store writes on a first run and merges in for an absent key. */
  defaults: T
  /** The store calls it for a failed read and for a corrupt value. The call still returns the defaults. */
  onError?: TStorageErrorHandler
} & TStorageAdapter<T>

export type TStoreOptions<T extends TVersionedData> = {
  /** The storage key. */
  key: string
  /** The current version of the plugin. A different stored version starts a merge. */
  version: number
  /** The shape that the store writes on a first run and merges in for an absent key. */
  defaults: T
  /** The store calls it for a failed read or write, after the log. */
  onError?: TStorageErrorHandler
}

export type TNodeStoreOptions = {
  /** The plugin data key. Keep it short: each node stores it. */
  key: string
  /** The store writes it into each entry as `lastUsedVersion`. */
  version: number
  /** The store calls it for a failed write, after the log. */
  onError?: TStorageErrorHandler
}

/** What `NodeStorage.read` returns: the data and the version that the store wrote with it. */
export type TNodeStoredData<T> = T & TVersionedData
