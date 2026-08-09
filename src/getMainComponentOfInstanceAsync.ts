/**
 * The main component an instance points at, exactly as Figma reports it.
 *
 * For an instance of a variant this is the variant itself, not its set. Earlier
 * versions climbed to the set here, which made the variant impossible to get at
 * and hid the difference between "one component" and "one of its variants" from
 * every caller. Use `getComponentSetOfVariant` on the result when the set is
 * what is wanted.
 *
 * Null means the master is not reachable, and covers two different situations:
 * it was deleted, or it lives in a library this document cannot see right now.
 * Call `instance.getMainComponentAsync()` directly when those two have to be
 * reported apart — Figma answers `null` for the first and throws for the second,
 * and this wrapper trades that distinction for never throwing.
 *
 * @example
 * const variant = await getMainComponentOfInstanceAsync(instance)
 * const componentSet = variant ? getComponentSetOfVariant(variant) : null
 */
const getMainComponentOfInstanceAsync = async (instance: InstanceNode): Promise<ComponentNode | null> => {
  try {
    return await instance.getMainComponentAsync()
  } catch (error) {
    console.log('Error in getMainComponentOfInstanceAsync() :', error)

    return null
  }
}

export { getMainComponentOfInstanceAsync }
