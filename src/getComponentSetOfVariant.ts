import { isNodeAlive } from './isNodeAlive'

/**
 * The set a variant belongs to, or null for a standalone component.
 *
 * This is the one climb the component tree allows: a master is never nested
 * inside another master, so a parent that is not a component set is just the
 * frame, section or page the component is organised in.
 *
 * Use it to choose the grain of an answer: the set is one entry per component,
 * the variant is one entry per state. Both ids are worth keeping — collapsing to
 * the set alone loses which variant an instance actually renders.
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
