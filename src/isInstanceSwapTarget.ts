/**
 * Whether an instance is the target of an INSTANCE_SWAP property.
 *
 * Such an instance is a slot rather than a fixed part of the component: what it
 * points at right now is whatever the property happens to be set to. The keys
 * come from `getKeysOfInstanceSwapProperties`, read once from the component
 * being walked rather than per layer.
 *
 * That is why it is usually worth excluding when a component's content is being
 * described: what a slot holds today is the default, not part of the component.
 * It is equally worth keeping when the question is "what is actually used in
 * this file" — hence a filter rather than a rule baked into the traversal.
 *
 * An empty key list means the component declares no swap properties, so nothing
 * can be a target and the answer is always false.
 *
 * @example
 * const swapKeys = getKeysOfInstanceSwapProperties(component) ?? []
 *
 * const fixedInstances = instances.filter((instance) => !isInstanceSwapTarget(instance, swapKeys))
 */
const isInstanceSwapTarget = (instance: InstanceNode, swapKeys: string[]): boolean => {
  try {
    if (!swapKeys.length) {
      return false
    }

    const propertyReferences = instance.componentPropertyReferences

    if (!propertyReferences) {
      return false
    }

    return Object.values(propertyReferences).some((reference) => typeof reference === 'string' && swapKeys.includes(reference))
  } catch (error) {
    console.log('Error in isInstanceSwapTarget() :', error)

    return false
  }
}

export { isInstanceSwapTarget }
