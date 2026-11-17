import { asSceneNode } from './asSceneNode'
import { isNodeAlive } from './isNodeAlive'

/**
 * What the walk does after a visit of a node.
 *
 * - No value (`undefined`): continue into this node, then to the next node.
 * - `'skip'`: do not go into this node. The visit of the node itself is done. The walk skips only the nodes below it.
 * - `'stop'`: end the whole walk now.
 *
 * The visit returns one decision, and there is no second `descend` predicate. The two decisions use the same reads.
 * A caller that skips hidden branches already read the visibility. A second question runs the code of the caller twice for each node.
 */
export type TWalkVerdict = void | 'skip' | 'stop'

export type TWalkNodeTreeOptions = {
  /* Whether `root` itself is visited. False by default — the usual question is about the content */
  includeRoot?: boolean
}

/**
 * Visits each node under a root, one call for each node.
 *
 * It is the walk that each module needs: an explicit stack and not recursion, dead handles skipped, nothing thrown.
 * It answers no question itself. `visit` holds all the policy, so one walk serves callers with different rules.
 *
 * Two callers have different rules for the same nodes. The boolean pass of a variant skips a layer that a designer hid by hand.
 * Such a layer is a leftover and not a state of the component.
 * A variable collector reads the hidden layer: a binding on a hidden layer is still a binding.
 * So the callers share the loop and not the rules.
 *
 * `depth` is the distance from the root, also when the walk does not visit the root. The root is 0, its children are 1.
 * `'stop'` serves the questions that the first match answers. Without it, "does a node below match" walks the whole subtree.
 *
 * The order is the order of the layers panel: a node, then all the nodes in it, then its next sibling.
 * The order is a promise: the result of a walk goes into lists that a user reads. So the stack gets the children in reverse.
 *
 * The walk goes through a `PAGE` and does not visit it.
 * So a walk from the document gets the content of each page. The caller has no special case for a node that is not a `SceneNode`.
 *
 * It does not throw. The visits before a bad subtree stay. A layer that a user deletes during a walk is normal, and a partial answer is better than none.
 *
 * @example
 * // Everything inside the component
 * walkNodeTree(component, (node) => collect(node))
 *
 * @example
 * // The component's own content: an instance is visited, what is inside it is not
 * walkNodeTree(component, (node) => {
 *   collect(node)
 *
 *   return node.type === 'INSTANCE' ? 'skip' : undefined
 * }, { includeRoot: true })
 *
 * @example
 * // The first hit is the answer
 * let found = false
 *
 * walkNodeTree(frame, (node) => {
 *   if (!predicate(node)) return
 *
 *   found = true
 *
 *   return 'stop'
 * })
 */
const walkNodeTree = (
  root: BaseNode,
  visit: (node: SceneNode, depth: number) => TWalkVerdict,
  options: TWalkNodeTreeOptions = {},
): void => {
  /* The root is only skipped as a visit — its content is what the walk is for */
  const stack: Array<{ node: BaseNode; depth: number; skipVisit: boolean }> = [
    { node: root, depth: 0, skipVisit: !options.includeRoot },
  ]

  try {
    while (stack.length) {
      const current = stack.pop() as { node: BaseNode; depth: number; skipVisit: boolean }

      if (!isNodeAlive(current.node)) {
        continue
      }

      /* A document and a page are walked through rather than visited — neither is a layer */
      const sceneNode = current.skipVisit ? null : asSceneNode(current.node)

      if (sceneNode) {
        const verdict = visit(sceneNode, current.depth)

        if (verdict === 'stop') {
          return
        }

        if (verdict === 'skip') {
          continue
        }
      }

      if (!('children' in current.node)) {
        continue
      }

      const { children } = current.node
      const depth = current.depth + 1

      /* Backwards, so the first child is the first one popped and the order is the panel's */
      for (let index = children.length - 1; index >= 0; index--) {
        stack.push({ node: children[index], depth, skipVisit: false })
      }
    }
  } catch (error) {
    console.log('Error in walkNodeTree() :', error)
  }
}

export { walkNodeTree }
