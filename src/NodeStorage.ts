import type { TNodeStoredData, TNodeStoreOptions, TStorageErrorHandler } from './storageTypes'

import { pluginDataAdapter } from './pluginDataAdapter'
import { reportStorageError } from './reportStorageError'

/**
 * A store in the plugin data of nodes: one key, any number of nodes.
 *
 * Unlike `ClientStorage` and `DocumentStorage` it holds no node and no data.
 * The node goes into each call, so one store serves every node with the key.
 *
 * Every write is stamped with `lastUsedVersion`, and `read` gives the stamp back.
 * So the project can tell a current node from one to migrate or to drop. The
 * store migrates nothing, and `read` never writes: to look at a node must not tag it.
 *
 * Nothing throws, and a node is never assumed to be alive: a node that is gone
 * reads as no data and refuses a write.
 *
 * @example
 * const specStorage = new NodeStorage<TSpecData>({ key: 'spec', version: config.version })
 *
 * specStorage.write(node, { targetNodeId: target.id })
 *
 * const data = specStorage.read(node)
 *
 * if (!data) return 'not a spec'
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
