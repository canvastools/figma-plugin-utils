import { asSceneNode } from './asSceneNode'
import { isNodeAlive } from './isNodeAlive'

/**
 * What the walk does after a node was visited.
 *
 * - nothing (`undefined`) — go on, into this node and then to the next
 * - `'skip'`             — do not go inside this one. The node was still visited;
 *                          what hangs below it is what is being refused
 * - `'stop'`             — end the whole walk, here and now
 *
 * One verdict rather than a second `descend` predicate, because the two
 * decisions are almost always made from the same reads: a caller that prunes
 * hidden branches has just looked at the visibility, and asking it again a
 * moment later runs consumer code twice per node for an answer it already had.
 */
export type TWalkVerdict = void | 'skip' | 'stop'

export type TWalkNodeTreeOptions = {
  /* Whether `root` itself is visited. False by default — the usual question is about the content */
  includeRoot?: boolean
}

/**
 * Every node under a root, one call per node.
 *
 * The traversal every module ends up writing: an explicit stack rather than
 * recursion, dead handles skipped, and nothing thrown. It answers no question of
 * its own — `visit` is where all of the policy goes, which is what makes one
 * walker serve callers that disagree about what counts as content.
 *
 * Two callers already disagree in exactly that way: the boolean dependency pass
 * of a variant skips a layer hidden by hand, because such a layer is a leftover
 * rather than a state of the component, while a variable collector must look at
 * it anyway, because a binding on a hidden layer is still a binding. Sharing the
 * loop and not the rules is the whole point.
 *
 * `depth` is the distance from the root, whether or not the root itself is
 * visited: the root is 0, its children are 1. `'stop'` is what makes this usable
 * for questions that are answered by the first hit — without it, "does anything
 * below here match" would have to walk the entire subtree to say yes.
 *
 * The order is the one a designer sees in the layers panel: a node, then
 * everything inside it, then its next sibling. That is a promise rather than an
 * implementation detail — what comes out of a walk ends up in lists a user
 * reads, and "the order they were met" only means something if it is the order
 * they are in. It is why the stack is fed in reverse.
 *
 * A `PAGE` is walked through rather than visited, so a walk that starts at the
 * document reaches the content of every page without the caller special casing
 * a node type that is not a `SceneNode` at all.
 *
 * Never throws: whatever was visited before a subtree went bad stands, since a
 * layer deleted mid walk is normal and a partial answer beats no answer.
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
