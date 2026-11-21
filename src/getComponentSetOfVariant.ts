import { isNodeAlive } from './isNodeAlive'

/**
 * The set of a variant, or `null` for a separate component.
 *
 * This is the only step up that the component tree allows. A main component is not in another main component.
 * So a parent that is not a component set is the frame, section or page that holds the component.
 *
 * - Use it to choose the unit of an answer: the set for each component, the variant for each state.
 * - Keep both ids. With the set only, the caller loses the variant that an instance renders.
 *
 * @example
 * const componentSet = getComponentSetOfVariant(component)
 *
 * const id = componentSet ? componentSet.id : component.id
 */
const getComponentSetOfVariant = (component: ComponentNode): ComponentSetNode | null => {
  try {
    if (!isNodeAlive(component)) {
      return null
    }

    const parent = component.parent

    if (parent && parent.type === 'COMPONENT_SET') {
      return parent
    }

    return null
  } catch (error) {
    console.log('Error in getComponentSetOfVariant() :', error)

    return null
  }
}

export { getComponentSetOfVariant }
