import type { TNodeStoredData, TNodeStoreOptions, TStorageErrorHandler } from './storageTypes'

import { pluginDataAdapter } from './pluginDataAdapter'
import { reportStorageError } from './reportStorageError'

/**
 * A store in the plugin data of nodes: one key, any number of nodes.
 *
 * `ClientStorage` and `DocumentStorage` hold their data. This store holds no node and no data.
 * Each call gets the node, so one store serves each node with the key.
 *
 * The store writes `lastUsedVersion` into each entry, and `read` gives that version back.
 * So the project tells a current node from a node to migrate or to remove.
 * The store migrates nothing, and `read` does not write: a read must not mark a node.
 *
 * Nothing throws. The store does not assume that a node is alive: a node that is gone reads as no data and refuses a write.
 *
 * @example
 * const nodeStorage = new NodeStorage<TNodeData>({ key: 'my-plugin', version: config.version })
 *
 * nodeStorage.write(node, { sourceId: source.id })
 *
 * const data = nodeStorage.read(node)
 *
 * if (!data) return 'no data'
 * if (data.lastUsedVersion < config.version) return 'migrate'
 */
class NodeStorage<T> {
  private key: string
  private version: number
  private onError: TStorageErrorHandler | undefined

  constructor({ key, version, onError }: TNodeStoreOptions) {
    this.key = key
    this.version = version
    this.onError = onError
  }

  /** `null` when the node has no data under the key, the data is not readable, or the node is gone. */
  read(node: BaseNode): TNodeStoredData<T> | null {
    return pluginDataAdapter<TNodeStoredData<T>>(node, this.key).read()
  }

  /** Writes `data` with the version stamp. Gives the stored value, or `null` when the write failed. */
  write(node: BaseNode, data: T): TNodeStoredData<T> | null {
    const stamped = { ...data, lastUsedVersion: this.version }
    const isWritten = pluginDataAdapter<TNodeStoredData<T>>(node, this.key, this.onError).write(stamped)

    return isWritten ? stamped : null
  }

  /** `true` when the node has readable data under the key. */
  has(node: BaseNode): boolean {
    return this.read(node) !== null
  }

  /** The version the node was last written with, or `null` when it has no data. */
  getVersion(node: BaseNode): number | null {
    return this.read(node)?.lastUsedVersion ?? null
  }

  /** `true` when the node was written by this exact version. */
  isCurrent(node: BaseNode): boolean {
    return this.getVersion(node) === this.version
  }

  /** Removes the entry: Figma reads an empty string as no data. `false` when the node is gone. */
  clear(node: BaseNode): boolean {
    try {
      node.setPluginData(this.key, '')

      return true
    } catch (error) {
      reportStorageError('NodeStorage.clear()', 'write', error, this.onError)

      return false
    }
  }
}

export { NodeStorage }
