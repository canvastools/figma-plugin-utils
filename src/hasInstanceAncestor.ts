/**
 * Whether a node sits inside an instance.
 *
 * The node itself does not count: an instance placed on the page answers
 * `false`, because nothing above it is an instance. Ask
 * `isInstanceNode(node) || hasInstanceAncestor(node)` when the node's own type
 * should count too — which is the question behind "can the user edit this",
 * since an instance is as locked as its content.
 *
 * That split is the whole point of the rename from `hasInstanceParent`, which
 * counted the node itself while its name said otherwise.
 *
 * The walk goes all the way up: one plain frame in between changes nothing.
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
