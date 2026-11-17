import { isNodeAlive } from './isNodeAlive'

/**
 * The page of a node, or `null` when the node has no page.
 *
 * It replaces the old `getPage`. That helper followed `parent` and did not check it.
 * A remote component is on no page of this document, and its chain of ancestors ends at `null`. A removed node is the same. Both stopped that helper.
 *
 * `null` is a normal answer, not a failure: a remote component and a removed node have no page here.
 *
 * The parent of a main component is often a frame or a section, not the page. So this helper walks the whole chain and does not read `parent` once.
 * The walk has a depth limit as a last guard against a broken chain.
 *
 * @example
 * const page = getPageOfNode(node)
 *
 * console.log(page ? page.name : 'not in this document')
 */
const getPageOfNode = (node: BaseNode): PageNode | null => {
  try {
    let currentNode: BaseNode | null = node

    for (let step = 0; step < 100 && currentNode; step++) {
      if (!isNodeAlive(currentNode)) {
        return null
      }

      if (currentNode.type === 'PAGE') {
        return currentNode
      }

      if (!('parent' in currentNode)) {
        return null
      }

      currentNode = currentNode.parent
    }

    return null
  } catch (error) {
    console.log('Error in getPageOfNode() :', error)

    return null
  }
}

export { getPageOfNode }
