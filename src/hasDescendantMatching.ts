import { isNodeAlive } from './isNodeAlive'

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
 * Never throws. Deleted nodes are skipped, and a predicate that throws is not
 * caught here: it is the caller's rule, and swallowing its failure would turn a
 * broken check into a silent `false`.
 *
 * @example
 * hasDescendantMatching(frame, (node) => node.getPluginData('spec') !== '')
 */
const hasDescendantMatching = (node: BaseNode, predicate: (node: SceneNode) => boolean): boolean => {
  if (!isNodeAlive(node) || !('children' in node)) {
    return false
  }

  const stack: BaseNode[] = [node]

  while (stack.length) {
    const current = stack.pop() as BaseNode

    if (!isNodeAlive(current) || !('children' in current)) {
      continue
    }

    for (const child of current.children) {
      if (!isNodeAlive(child)) {
        continue
      }

      /* Only reachable when the walk starts at the document — a page is not a scene node */
      if (child.type === 'PAGE') {
        stack.push(child)

        continue
      }

      if (predicate(child)) {
        return true
      }

      stack.push(child)
    }
  }

  return false
}

export { hasDescendantMatching }
