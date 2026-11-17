import { hasInstanceAncestor } from './hasInstanceAncestor'

/**
 * Removes each child of a node. The node itself stays.
 *
 * It returns `true` when it removed the children. So a caller tells "emptied" from "nothing to empty" without a second read.
 *
 * It loops over a copy of `children`. `remove()` changes the live array, and a loop over it skips each second child.
 *
 * It does not change the content of an instance. Figma does not let a plugin remove the children of an instance.
 * Each `remove()` throws, and the loop leaves the node half empty. The check also covers a frame in an instance.
 *
 * - Detach the instance first, or clear the main component.
 *
 * It reports a node that cannot have children and does not change it. Such a call is an error of the caller.
 *
 * @example
 * if (!clearChildren(frame)) {
 *   // locked, a leaf, or already gone — the node was not touched
 * }
 */
const clearChildren = (node: SceneNode): boolean => {
  try {
    if (!('children' in node)) {
      console.log('clearChildren() : Children not found', node)

      return false
    }

    if (node.type === 'INSTANCE' || hasInstanceAncestor(node)) {
      console.log('clearChildren() : Cannot remove the children of an instance', node)

      return false
    }

    for (const child of [...node.children]) {
      child.remove()
    }

    return true
  } catch (error) {
    console.log('Error in clearChildren() :', error)

    return false
  }
}

export { clearChildren }
