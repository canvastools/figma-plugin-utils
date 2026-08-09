import { isNodeAlive } from './isNodeAlive'

/**
 * Drops nodes that already have an ancestor in the same list.
 *
 * Useless on `figma.currentPage.selection` — Figma never puts a node and one of
 * its ancestors there. It is for lists gathered by walking subtrees, where a
 * match really can sit inside another match: a component inside a component set,
 * a marked frame inside a marked frame.
 *
 * Apply it when what follows covers the whole subtree — deleting, exporting,
 * re-generating, counting. Without it the inner node is processed twice, once on
 * its own and once as part of its ancestor, which at best duplicates work and at
 * worst leaves a deleted node in the list.
 *
 * Do NOT apply it when the operation is per node and independent, for example
 * writing a field into every matched node: there the inner one has to be visited
 * too.
 *
 * Deleted nodes are dropped along the way, so the result is always safe to act
 * on.
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
