import { isNodeAlive } from './isNodeAlive'

/**
 * Whether a node lives in a library rather than in this document.
 *
 * `remote` sits on components, component sets and styles, and is absent
 * everywhere else — so the bare property read is a type error on `SceneNode` and
 * a silent `undefined` on anything looser. This answers the question for any
 * node: something that cannot be remote is not remote.
 *
 * What it decides, in practice: a remote node belongs to no page of this
 * document, cannot be edited, and is usually where a walk should stop — a design
 * system component is a dependency to report, not a tree to take apart.
 *
 * False is also the answer for a node that could not be read, which is the safe
 * way round: treating an unreadable node as local means the caller looks at it
 * again rather than filing it under someone else's library.
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
