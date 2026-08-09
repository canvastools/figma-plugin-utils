/**
 * Whether a layer is visible, optionally counting the ones a component property
 * switches off.
 *
 * Inside a component, `visible: false` means two very different things. A layer
 * hidden by hand is usually a leftover. A layer whose visibility is bound to a
 * boolean property is a full part of the component that simply happens to be off
 * in this state — the next instance may well turn it on. Code that walks
 * components almost always wants the second kind counted, and `countPropertyBound`
 * is how it says so.
 *
 * It asks about this layer only. A visible layer inside a hidden frame answers
 * `true`, because that is the question — walk the ancestors, or use the `descend`
 * predicate of `collectInstances`, when the whole subtree has to be judged.
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
