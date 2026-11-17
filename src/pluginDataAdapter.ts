import type { TStorageErrorHandler, TSyncStorageAdapter } from './storageTypes'

import { isQuotaError, reportStorageError } from './reportStorageError'

/**
 * The plugin data of one node as a storage adapter: a JSON string under one key.
 *
 * Works for any node: the document root for data of the file, a scene node for
 * data of a layer.
 *
 * `read` gives `null` for no data, for text that is not JSON and for a node that
 * is gone. `write` gives `false` when the node is gone or Figma refused the value;
 * `onError` then gets `quota` or `write`.
 *
 * @example
 * const { read, write } = pluginDataAdapter<TSpecData>(node, 'spec')
 */
const pluginDataAdapter = <T>(node: BaseNode, key: string, onError?: TStorageErrorHandler): TSyncStorageAdapter<T> => ({
  read: () => {
    try {
      const raw = node.getPluginData(key)

      return raw ? (JSON.parse(raw) as T) : null
    } catch {
      /* A dead node or a string that is not JSON: both are "nothing to read" */
      return null
    }
  },
  write: (data) => {
    try {
      node.setPluginData(key, JSON.stringify(data))

      return true
    } catch (error) {
      reportStorageError('pluginDataAdapter().write', isQuotaError(error) ? 'quota' : 'write', error, onError)

      return false
    }
  },
})

export { pluginDataAdapter }
