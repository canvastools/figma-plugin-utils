/**
 * The key of the BOOLEAN property driving a layer's visibility, if any.
 *
 * A component property can be bound to three things, and Figma keeps them in
 * three separate references. Only `visible` can ever hold a BOOLEAN property —
 * the other two bind text and instance swaps — so reading that one key is both
 * the whole answer and cheaper than scanning every reference a layer has.
 *
 * This is the layer half of `hasBooleanProperties`: that one says whether the
 * component declares any booleans at all, this one says which of them, if any,
 * this particular layer belongs to. Together they are what a state enumerator
 * needs to tell an independent switch from one nested inside another.
 *
 * The key is returned as Figma stores it, suffix and all (`Show icon#12:3`),
 * because that is what the definitions are keyed by — pass it through
 * `getPropertyName` for anything a user reads.
 *
 * Null is the answer for a layer bound to nothing, for a node type that cannot
 * carry references at all, and for a node that could not be read — all three
 * mean the same thing to a caller: no boolean dimension here.
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
