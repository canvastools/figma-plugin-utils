import { hasInstanceAncestor } from './hasInstanceAncestor'

/**
 * Removes every child of a node, leaving the node itself in place.
 *
 * Returns whether the node was actually cleared, so a caller can tell "emptied"
 * from "there was nothing to empty" without inspecting the node again.
 *
 * Iterates over a copy of `children`, because `remove()` mutates the array it is
 * being read from — walking the live one skips every second child.
 *
 * Refuses to touch the content of an instance. Figma forbids removing the
 * children of one, and every `remove()` would throw halfway through, leaving the
 * node in whatever state the loop got to. Detach it first, or clear the master.
 * The check covers nesting too: a frame inside an instance is just as locked as
 * the instance itself.
 *
 * A node that cannot hold children at all is reported and left alone, since
 * asking a rectangle to be emptied is a mistake in the caller rather than a
 * state to recover from.
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
