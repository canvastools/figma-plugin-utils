/**
 * Whether a layer is visible. As an option, it also counts the layers that a component property turns off.
 *
 * In a component, `visible: false` has two different meanings. A layer that a designer hid by hand is usually a leftover.
 * A layer whose visibility a boolean property controls is a full part of the component. It is only off in this state, and the next instance can turn it on.
 * Code that walks components almost always counts the second type. `countPropertyBound` turns that on.
 *
 * It asks about this layer only. A visible layer in a hidden frame gives `true`, because that is the question.
 *
 * - Walk the ancestors, or use the `descend` predicate of `collectInstances`, to check the whole subtree.
 *
 * @example
 * isLayerVisible(layer)                                // strictly what is on
 * isLayerVisible(layer, { countPropertyBound: true })  // plus what a property switches off
 */
const isLayerVisible = (node: SceneNode, options: { countPropertyBound?: boolean } = {}): boolean => {
  try {
    if (node.visible) {
      return true
    }

    if (!options.countPropertyBound) {
      return false
    }

    const propertyReferences = 'componentPropertyReferences' in node ? node.componentPropertyReferences : null

    return Boolean(propertyReferences && propertyReferences.visible)
  } catch (error) {
    console.log('Error in isLayerVisible() :', error)

    return false
  }
}

export { isLayerVisible }
