import { isNodeAlive } from './isNodeAlive'

/**
 * Removes the nodes that have an ancestor in the same list.
 *
 * `figma.currentPage.selection` does not need it: Figma does not put a node and its ancestor in the selection.
 * It is for lists from a walk of subtrees, where a match can be in another match.
 * Examples: a component in a component set, a marked frame in a marked frame.
 *
 * It also removes the deleted nodes and each node that it cannot read. So the result is always safe.
 *
 * - Use it when the next step covers the whole subtree: a delete, an export, a new build, a count.
 *   Otherwise the step does the inner node twice.
 * - Do not use it when the step works on each node separately, for example a write to each matched node.
 *   That step needs the inner node too.
 *
 * @example
 * // Frame1 > Frame2, both matched
 * getTopmostNodes([frame1, frame2])   // [frame1]
 */
const getTopmostNodes = (nodes: SceneNode[]): SceneNode[] => {
  /* A deleted node throws on each read, so it must not reach the reads of `id` and `parent` */
  const aliveNodes = nodes.filter((node) => isNodeAlive(node))
  const nodeIds = new Set(aliveNodes.map((node) => node.id))

  return aliveNodes.filter((node) => {
    try {
      let currentParent = node.parent

      /* A list of scene nodes holds no page and no document, so the chain ends there */
      while (currentParent && currentParent.type !== 'PAGE' && currentParent.type !== 'DOCUMENT') {
        if (nodeIds.has(currentParent.id)) {
          return false
        }

        currentParent = currentParent.parent
      }

      return true
    } catch (error) {
      console.log('Error in getTopmostNodes() :', error)

      return false
    }
  })
}

export { getTopmostNodes }
