/** Every stored object carries the version of the plugin that wrote it last. */
export type TVersionedData = { lastUsedVersion: number }

/**
 * What went wrong in a store, for the caller that wants to tell the user.
 *
 * - `corrupt`: the stored value is not an object with `lastUsedVersion`
 * - `quota`: the write was refused because the storage is full
 * - `write`: the write failed for another reason
 * - `unavailable`: the storage cannot be reached, for example no document node yet
 */
export type TStorageErrorKind = 'corrupt' | 'quota' | 'write' | 'unavailable'

/**
 * Called when a store cannot read or write. The store has already logged the
 * error and returned its safe answer; this is where a project shows its toast.
 */
export type TStorageErrorHandler = (kind: TStorageErrorKind, error: unknown) => void

/** A place to read one value from and write it back to. `write` says whether the value was stored. */
export type TStorageAdapter<T> = {
  read: () => T | null | Promise<T | null>
  write: (data: T) => boolean | Promise<boolean>
}

/** An adapter over a synchronous backend. Assignable to `TStorageAdapter<T>`. */
export type TSyncStorageAdapter<T> = {
  read: () => T | null
  write: (data: T) => boolean
}

export type TInitStorageOptions<T extends TVersionedData> = {
  /** The current version of the plugin. */
  version: number
  /** The shape that the store writes on a first run and merges in for an absent key. */
  defaults: T
  /** Told about a corrupt value. The call still returns the defaults. */
  onError?: TStorageErrorHandler
} & TStorageAdapter<T>

export type TStoreOptions<T extends TVersionedData> = {
  /** The storage key. */
  key: string
  /** The current version of the plugin. A different stored version triggers a merge. */
  version: number
  /** The shape that the store writes on a first run and merges in for an absent key. */
  defaults: T
  /** Told about a failed read or write, after the store logged it. */
  onError?: TStorageErrorHandler
}

export type TNodeStoreOptions = {
  /** The plugin data key. Keep it short: it is stored on each node. */
  key: string
  /** Stamped onto every write as `lastUsedVersion`. */
  version: number
  /** Told about a failed write, after the store logged it. */
  onError?: TStorageErrorHandler
}

/** What `NodeStorage.read` returns: the payload and the version stamp written with it. */
export type TNodeStoredData<T> = T & TVersionedData
