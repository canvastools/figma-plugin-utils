import type { TInvalidVariant } from './validateVariantNames'

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
 * What is wrong with the names of a set's variants — the same rule as
 * `validateVariantNames`, read off the set itself.
 *
 * One getter and the names: no walk into anybody's content, so it is cheap
 * enough to ask of every component a list shows. Anything that is not a set has
 * no variant names to be wrong and answers an empty list; so does a set where
 * nothing is wrong. A set whose definitions cannot be read is checked against
 * its own names.
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
