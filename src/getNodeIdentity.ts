import { getNodeKey } from './getNodeKey'

/**
 * What to address a node by when something has to be remembered about it.
 *
 * The publishing key when there is one, the node id otherwise — and the two
 * halves are not interchangeable. A key survives the same component being met
 * in another file, which is the only identity a library component has: its id
 * is new in every document that uses it. An id is all an unpublished component
 * has, and it is enough, because such a component cannot be met anywhere else.
 *
 * Deliberately separate from `getNodeKey` rather than folded into it. That one
 * answers "is this published, and under what key", and its `null` is a real
 * answer callers branch on; a version of it that returned an id instead would
 * lie by its own name.
 *
 * A dead node has no identity to speak of — the id of a node that is gone
 * addresses nothing — so it comes back as `null` and the caller decides.
 *
 * @example
 * const identity = getNodeIdentity(component)   // 'a1b2…' | '12:34' | null
 */
const getNodeIdentity = (node: BaseNode): string | null => {
  const key = getNodeKey(node)

  if (key) {
    return key
  }

  try {
    return node.id
  } catch (error) {
    console.log('Error in getNodeIdentity() :', error)

    return null
  }
}

export { getNodeIdentity }
