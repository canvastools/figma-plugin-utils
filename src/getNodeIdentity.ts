import { getNodeKey } from './getNodeKey'

/**
 * The identity of a node, for data that a plugin keeps about it.
 *
 * It is the publish key when the node has one, and the node id otherwise. The two are not the same.
 * A key stays the same for a component in another file. It is the only identity of a library component: its id is new in each document.
 * An unpublished component has only an id, and that is enough: the component exists only in one file.
 *
 * It is separate from `getNodeKey`. That helper answers "is this published, and with which key".
 * Its `null` is a real answer, and callers use it in conditions. A version that returned an id gives a wrong answer for its name.
 *
 * A dead node has no identity: the id of a removed node addresses nothing. So the result is `null`, and the caller decides.
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
