import { isNodeAlive } from './isNodeAlive'

/**
 * Removes the nodes that have an ancestor in the same list.
 *
 * `figma.currentPage.selection` does not need it: Figma does not put a node and its ancestor in the selection.
 * It is for lists from a walk of subtrees, where a match can be in another match.
 * Examples: a component in a component set, a marked frame in a marked frame.
 *
 * - Use it when the next step covers the whole subtree: a delete, an export, a new build, a count. Otherwise the step does the inner node twice.
 * - Do not use it when the step works on each node separately, for example a write to each matched node. That step needs the inner node too.
 *
 * It also removes the deleted nodes, so the result is always safe.
 *
 * @example
 * // Frame1 > Frame2, both matched
 * getTopmostNodes([frame1, frame2])   // [frame1]
 */
const getTopmostNodes = (nodes: SceneNode[]): SceneNode[] => {
  const nodeIds = new Set(nodes.map((node) => node.id))

  return nodes.filter((node) => {
    let currentParent = node.parent

    /* Walk up to the page — if any ancestor is in the list, this node is not topmost */
    while (currentParent && currentParent.type !== 'PAGE' && currentParent.type !== 'DOCUMENT') {
      if (nodeIds.has(currentParent.id)) {
        return false
      }

      currentParent = currentParent.parent
    }

    return isNodeAlive(node)
  })
}

export { getTopmostNodes }
