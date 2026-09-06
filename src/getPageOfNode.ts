import { isNodeAlive } from './isNodeAlive'

/**
 * The page a node lives in, or null when it has none.
 *
 * Replaces the older `getPage`, which recursed on `parent` without ever
 * checking it: a remote component belongs to no page of this document and ends
 * its ancestor chain at `null`, and so does any node that was removed from the
 * tree — both took that helper down.
 *
 * Null is a normal answer, not a failure: a remote component genuinely has no
 * page here, and neither does a node that was just removed.
 *
 * The parent of a master is very often a frame or a section it is organised in
 * rather than the page itself, so this walks the whole chain instead of reading
 * `parent` once. The walk is depth limited as a last resort against a broken
 * chain.
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
