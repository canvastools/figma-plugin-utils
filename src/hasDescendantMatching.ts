import { walkNodeTree } from './walkNodeTree'

/**
 * Whether anything below a node satisfies the predicate.
 *
 * The node itself is never tested — the question is about its content, and a
 * caller that also wants the node judged says so with one `||` rather than
 * having every caller that does not undo it.
 *
 * It stops at the first hit, which is the whole reason to have it instead of
 * `findAll`: the usual question — "does this frame already contain one of my
 * plugin's nodes" — is answered by the first match, while `findAll` walks the
 * entire subtree and builds an array to then throw away.
 *
 * The walk is depth first and iterative, so a deep tree cannot blow the stack,
 * and it goes into instances: their content is part of what sits below the node,
 * whatever it mirrors. Use the predicate to stop at one — `collectInstances` is
 * the helper for walks that treat an instance as a boundary.
 *
 * Never throws, because `walkNodeTree` does not: deleted nodes are skipped, and
 * a predicate that throws ends the walk with whatever it had already found — so
 * a broken check answers `false` rather than taking a plugin down. Catch inside
 * the predicate when a failure has to be reported rather than logged.
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
