/**
 * The key of the BOOLEAN property that controls the visibility of a layer, or `null`.
 *
 * A layer can bind a component property in three places, and Figma keeps three references.
 * Only `visible` can hold a BOOLEAN property: the other two bind text and instance swaps.
 * So one key read gives the full answer, and it is faster than a scan of each reference.
 *
 * This is the layer half of `hasBooleanProperties`. That helper says if the component declares booleans.
 * This helper says which boolean controls this layer.
 * A state enumerator needs both to tell an independent switch from a nested switch.
 *
 * The key is as Figma stores it, with its suffix (`Show icon#12:3`). The definitions use the same key.
 *
 * - Pass the key through `getPropertyName` before a user sees it.
 *
 * The helper gives `null` for a layer with no binding, for a node type with no references and for a node that it cannot read.
 * All three mean the same for a caller: this layer has no boolean.
 *
 * @example
 * const key = getBooleanPropertyKey(layer)
 *
 * // Only the booleans this component declares are of interest
 * if (key && booleanKeys.includes(key)) { ... }
 */
const getBooleanPropertyKey = (node: SceneNode): string | null => {
  try {
    if (!('componentPropertyReferences' in node)) {
      return null
    }

    const references = node.componentPropertyReferences

    return references?.visible ?? null
  } catch (error) {
    console.log('Error in getBooleanPropertyKey() :', error)

    return null
  }
}

export { getBooleanPropertyKey }
