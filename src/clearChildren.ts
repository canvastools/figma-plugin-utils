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
 * It does not change a node that cannot have children, and returns `false`.
 *
 * - Detach the instance first, or clear the main component.
 *
 * @example
 * if (!clearChildren(frame)) {
 *   // A leaf, an instance or its content, or a node that is gone: the helper changed nothing
 * }
 */
const clearChildren = (node: SceneNode): boolean => {
  try {
    if (!('children' in node)) {
      return false
    }

    if (node.type === 'INSTANCE' || hasInstanceAncestor(node)) {
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
