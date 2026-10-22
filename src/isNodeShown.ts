import { isLayerVisible } from './isLayerVisible'

/**
 * Whether a node is actually on the canvas — its own flag, and every frame it
 * sits in, up to the page.
 *
 * **Hidden is hidden, whatever hid it.** `isLayerVisible` answers about one
 * layer, which is the right question inside a component, where a boolean
 * property switches layers off; this answers what a person can see, and a
 * visible instance inside a hidden frame is not something they can see.
 *
 * Layers a property switches off are not counted as shown: this is about the
 * canvas, and a layer that is off is off. A page and the document have no
 * `visible` and end the walk. A dead handle answers `false` — the safe end of
 * the type, and the answer a deleted node deserves.
 *
 * Walks the ancestors on every call. Inside a walk of a tree that already
 * prunes hidden branches, `isLayerVisible` on each node is the cheaper question.
 *
 * @example
 * const pointedAt = figma.currentPage.selection.filter(isNodeShown)
 */
const isNodeShown = (node: BaseNode): boolean => {
  try {
    let current: BaseNode | null = node

    while (current && current.type !== 'PAGE' && current.type !== 'DOCUMENT') {
      if ('visible' in current && !isLayerVisible(current as SceneNode)) {
        return false
      }

      current = current.parent
    }

    return true
  } catch (error) {
    console.log('Error in isNodeShown() :', error)

    return false
  }
}

export { isNodeShown }
