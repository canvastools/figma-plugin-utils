/**
 * The keys of the INSTANCE_SWAP properties that a component declares.
 *
 * A key looks like `Icon#2:0`: the name and the id that Figma adds. A nested instance points at it through `componentPropertyReferences`.
 *
 * The result is an empty list when the component declares no swap properties. It is also empty when the helper cannot read the definitions:
 * a dead node, a removed library.
 * With no keys, no instance is a swap target. So both cases mean the same for the only use of the list.
 *
 * - Use it with `isInstanceSwapTarget` to tell a fixed layer from a variable place.
 * - Read it once for each component of a walk, not for each layer. The list is the expensive half of the check.
 *
 * @example
 * const swapKeys = getKeysOfInstanceSwapProperties(component)
 *
 * instances.filter((instance) => !isInstanceSwapTarget(instance, swapKeys))
 */
const getKeysOfInstanceSwapProperties = (node: ComponentNode | ComponentSetNode): string[] => {
  try {
    const ids: Set<string> = new Set<string>()

    for (const key in node.componentPropertyDefinitions) {
      if (node.componentPropertyDefinitions[key].type === 'INSTANCE_SWAP') {
        ids.add(key as string)
      }
    }

    return Array.from(ids)
  } catch (error) {
    console.log('Error in getKeysOfInstanceSwapProperties() :', error)
    return []
  }
}

export { getKeysOfInstanceSwapProperties }
