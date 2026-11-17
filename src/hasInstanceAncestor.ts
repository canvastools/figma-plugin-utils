/**
 * Whether a node is in an instance.
 *
 * The node itself does not count. An instance on the page gives `false`, because no ancestor is an instance.
 *
 * - Use `isInstanceNode(node) || hasInstanceAncestor(node)` when the type of the node counts too. That is the question "can the user edit this".
 *
 * An instance is as locked as its content. The old name `hasInstanceParent` counted the node itself, and the name said otherwise.
 *
 * The walk goes up to the top: a plain frame between the node and the instance changes nothing.
 *
 * @example
 * hasInstanceAncestor(node)                             // "is it nested in an instance"
 * isInstanceNode(node) || hasInstanceAncestor(node)     // "is it untouchable"
 */
const hasInstanceAncestor = (node: BaseNode): boolean => {
  try {
    if (!('parent' in node) || !node.parent) {
      return false
    }

    let currentNode: BaseNode | null = node.parent

    for (let step = 0; step < 1000 && currentNode; step++) {
      if (currentNode.type === 'INSTANCE') {
        return true
      }

      if (!('parent' in currentNode)) {
        return false
      }

      currentNode = currentNode.parent
    }

    return false
  } catch (error) {
    console.log('Error in hasInstanceAncestor() :', error)
    return false
  }
}

export { hasInstanceAncestor }
