/**
 * Whether an instance is the target of an INSTANCE_SWAP property.
 *
 * Such an instance is a variable place, not a fixed part of the component. Its content is the current value of the property.
 * The keys come from `getKeysOfInstanceSwapProperties`. The caller reads them once from the component, not for each layer.
 *
 * - Exclude these instances when you describe the content of a component. The current value is only the default.
 * - Keep them when the question is "what does this file use". So this is a filter and not a rule of the walk.
 *
 * An empty key list means that the component declares no swap properties.
 * Then no instance is a target, and the answer is `false`.
 *
 * @example
 * const swapKeys = getKeysOfInstanceSwapProperties(component)
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
