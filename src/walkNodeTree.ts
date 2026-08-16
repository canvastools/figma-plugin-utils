import { isNodeAlive } from './isNodeAlive'

export type TWalkNodeTreeOptions = {
  /* Whether `root` itself is visited. False by default — the usual question is about the content */
  includeRoot?: boolean
  /* Whether the walk goes inside a node. Everything is walked by default */
  descend?: (node: SceneNode) => boolean
}

/**
 * Every node under a root, one call per node.
 *
 * The traversal every module ends up writing: an explicit stack rather than
 * recursion, dead handles skipped, and nothing thrown. It answers no question of
 * its own — `visit` and `descend` are where the policy goes, which is what makes
 * one walker serve callers that disagree about what counts as content.
 *
 * Two callers already disagree in exactly that way: the boolean dependency pass
 * skips a layer hidden by hand, because such a layer is a leftover rather than a
 * state of the component, while the variable collector must look at it anyway,
 * because a binding on a hidden layer is still a binding. Sharing the loop and
 * not the rules is the whole point.
 *
 * The order is depth first and unspecified beyond that. Nothing that uses it
 * cares, and pinning it down would tie the implementation to a stack.
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
 * walkNodeTree(component, collect, {
 *   includeRoot: true,
 *   descend: (node) => node.type !== 'INSTANCE',
 * })
 */
const walkNodeTree = (root: SceneNode, visit: (node: SceneNode) => void, options: TWalkNodeTreeOptions = {}): void => {
  try {
    if (!isNodeAlive(root)) {
      return
    }

    if (options.includeRoot) {
      visit(root)

      if (options.descend && !options.descend(root)) {
        return
      }
    }

    const stack: SceneNode[] = [root]

    while (stack.length) {
      const current = stack.pop()

      if (!current || !('children' in current)) {
        continue
      }

      for (const child of current.children) {
        if (!isNodeAlive(child)) {
          continue
        }

        visit(child)

        /* A node that is not descended into hides its whole subtree */
        if (options.descend && !options.descend(child)) {
          continue
        }

        stack.push(child)
      }
    }
  } catch (error) {
    console.log('Error in walkNodeTree() :', error)
  }
}

export { walkNodeTree }
