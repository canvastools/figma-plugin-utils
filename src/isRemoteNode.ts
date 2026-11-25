import { isNodeAlive } from './isNodeAlive'

/**
 * Whether a node is in a library and not in this document.
 *
 * Components, component sets and styles have `remote`, and other nodes do not.
 * So a direct read is a type error on `SceneNode` and an `undefined` with no error on a wider type.
 * This helper answers for each node: a node that cannot be remote is not remote.
 *
 * A remote node is on no page of this document, and a plugin cannot edit it. A walk usually stops at it.
 * A component of a design system is a dependency to report, not a tree to take apart.
 *
 * It returns `false` for a node that it cannot read. That is the safe side:
 * the caller reads the node again and does not put it in a library.
 *
 * @example
 * const page = isRemoteNode(master) ? null : getPageOfNode(master)
 */
const isRemoteNode = (node: BaseNode): boolean => {
  if (!isNodeAlive(node)) {
    return false
  }

  try {
    return 'remote' in node && node.remote === true
  } catch (error) {
    console.log('Error in isRemoteNode() :', error)

    return false
  }
}

export { isRemoteNode }
