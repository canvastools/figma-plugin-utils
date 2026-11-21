import { isLayerVisible } from './isLayerVisible'

/**
 * Whether a node is really on the canvas: its own flag and each frame above it, up to the page.
 *
 * **A hidden node is hidden, for each cause.** `isLayerVisible` answers about one layer.
 * That is the correct question in a component, where a boolean property turns layers off.
 * This helper answers what a person sees, and a person does not see a visible instance in a hidden frame.
 *
 * A layer that a property turns off does not count as shown: this helper is about the canvas.
 * A page and the document have no `visible`, and the walk ends at them.
 * A dead handle gives `false`: the safe end of the type, and the correct answer for a deleted node.
 *
 * It walks the ancestors at each call. In a walk that already skips hidden branches, `isLayerVisible` on each node costs less.
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
