import { walkNodeTree } from './walkNodeTree'

/**
 * Whether a node below a node matches the predicate.
 *
 * The helper does not test the node itself: the question is about its content.
 * A caller that also needs the node tested adds one `||`. Other callers then do not remove a test of the node.
 *
 * It stops at the first match. That is its reason to exist next to `findAll`.
 * The usual question, "does this frame already contain a node of my plugin", needs only the first match.
 * `findAll` walks the whole subtree and builds an array for nothing.
 *
 * The walk is depth first and iterative, so a deep tree does not overflow the stack.
 * It goes into instances: their content is below the node too. Use the predicate to stop at an instance.
 * `collectInstances` is the helper for walks that stop at each instance.
 *
 * It does not throw, because `walkNodeTree` does not. It skips deleted nodes.
 * A predicate that throws ends the walk with the result so far. So a broken check gives `false` and does not stop the plugin.
 *
 * - Catch the error in the predicate when the caller must report the failure, not only log it.
 *
 * @example
 * hasDescendantMatching(frame, (node) => node.getPluginData('spec') !== '')
 */
const hasDescendantMatching = (node: BaseNode, predicate: (node: SceneNode) => boolean): boolean => {
  let isMatching = false

  walkNodeTree(node, (descendant) => {
    if (!predicate(descendant)) {
      return
    }

    isMatching = true

    /* The first hit is the answer — the rest of the subtree cannot change it */
    return 'stop'
  })

  return isMatching
}

export { hasDescendantMatching }
