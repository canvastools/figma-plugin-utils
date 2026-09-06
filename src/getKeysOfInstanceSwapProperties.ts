/**
 * The property keys of type INSTANCE_SWAP declared on a component.
 *
 * A key looks like `Icon#2:0` — the name plus the id Figma appends — and is what
 * a nested instance points at through `componentPropertyReferences`. Pair it
 * with `isInstanceSwapTarget` to tell a fixed layer from a swappable slot.
 *
 * Read it once per component being walked rather than once per layer: the
 * definitions live on the component, and building the list is the expensive half
 * of the check.
 *
 * An empty list is the answer both when the component declares no swap
 * properties and when the definitions could not be read at all — a dead node, a
 * library that is gone. Earlier versions returned `undefined` for the second
 * case, which every caller then flattened with `?? []` anyway: with no keys
 * nothing can be a swap target, so both situations mean the same thing to the
 * only thing this is used for.
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
