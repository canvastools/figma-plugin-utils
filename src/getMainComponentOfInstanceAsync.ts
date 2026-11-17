/**
 * The main component of an instance, as Figma reports it.
 *
 * For an instance of a variant, this is the variant, not its set.
 * Old versions went up to the set. Then no caller got the variant or saw the difference between "one component" and "one of its variants".
 *
 * - Use `getComponentSetOfVariant` on the result when you need the set.
 *
 * `null` means that the main component is not available. There are two causes: it is deleted, or it is in a library that this document does not see now.
 * Figma gives `null` for the first cause and throws for the second. This helper gives up that difference and does not throw.
 *
 * - Call `instance.getMainComponentAsync()` directly when you must report the two causes separately.
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
