import { isNodeAlive } from './isNodeAlive'

/**
 * The publishing key of a node, or null when it has none.
 *
 * Only components and component sets carry a key, so this is `'key' in node`
 * plus the two guards every caller ends up writing anyway: a node that is gone,
 * and an empty string.
 *
 * That empty string is the reason this exists rather than a plain property read.
 * An unpublished component answers `''` rather than `undefined`, which is
 * falsy but still a string — so a stored reference built without this check ends
 * up with a key field that looks present and matches nothing.
 *
 * A key is not proof of publication: local components have one too, and it only
 * starts resolving through `importComponentByKeyAsync` once the library is
 * published.
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
