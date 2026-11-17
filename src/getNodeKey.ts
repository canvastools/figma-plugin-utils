import { isNodeAlive } from './isNodeAlive'

/**
 * The publish key of a node, or `null` when it has none.
 *
 * Only components and component sets have a key. So this is `'key' in node` and the two guards that each caller writes: a removed node and an empty string.
 *
 * The empty string is the reason for this helper. An unpublished component gives `''`, not `undefined`.
 * `''` is falsy but still a string. A stored reference without this check gets a key field that looks present and matches nothing.
 *
 * A key does not prove a publication: local components have one too.
 * `importComponentByKeyAsync` resolves the key only after the library is published.
 *
 * @example
 * const key = getNodeKey(component)   // 'a1b2…' | null
 */
const getNodeKey = (node: BaseNode): string | null => {
  if (!isNodeAlive(node)) {
    return null
  }

  try {
    if (!('key' in node) || typeof node.key !== 'string' || !node.key) {
      return null
    }

    return node.key
  } catch (error) {
    console.log('Error in getNodeKey() :', error)

    return null
  }
}

export { getNodeKey }
