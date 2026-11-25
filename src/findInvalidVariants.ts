import type { TInvalidVariant } from './variantTypes'

import { isComponentNode } from './isComponentNode'
import { isComponentSetNode } from './isComponentSetNode'
import { isNodeAlive } from './isNodeAlive'
import { validateVariantNames } from './validateVariantNames'

/* The keys of a set's variant properties, or none when its definitions cannot be read */
const readVariantKeys = (set: ComponentSetNode): string[] => {
  try {
    const definitions = set.componentPropertyDefinitions

    return Object.keys(definitions).filter((key) => definitions[key].type === 'VARIANT')
  } catch (error) {
    console.log('Error in findInvalidVariants() :', error)

    return []
  }
}

/**
 * The errors in the names of the variants of a set: the rule of `validateVariantNames`, read from the set.
 *
 * It reads one getter and the names, and it does not walk content. So a list can call it for each component that it shows.
 * A node that is not a set has no variant names and gives an empty list. A set with no errors also gives an empty list.
 * A set whose definitions the helper cannot read is checked against its own names.
 *
 * @example
 * const broken = findInvalidVariants(set).length > 0
 */
const findInvalidVariants = (node: BaseNode): TInvalidVariant[] => {
  if (!isNodeAlive(node) || !isComponentSetNode(node)) {
    return []
  }

  try {
    const variants = node.children
      .filter((child): child is ComponentNode => isNodeAlive(child) && isComponentNode(child))
      .map((child) => ({ id: child.id, name: child.name }))

    return validateVariantNames(variants, readVariantKeys(node)).invalid
  } catch (error) {
    console.log('Error in findInvalidVariants() :', error)

    return []
  }
}

export { findInvalidVariants }
