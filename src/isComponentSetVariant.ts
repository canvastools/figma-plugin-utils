/**
 * Whether a node is a component in a component set: one variant of a component, not a separate component.
 *
 * The difference is important when a plugin counts or names components.
 * Twelve variants are one component in a library and twelve entries in a node tree.
 * The name of a variant is its property string (`Size=M, Type=Primary`), not a name for a user.
 * The readable name is on the set.
 *
 * - Use `getComponentSetOfVariant` when you need the set. This helper returns a boolean and does not narrow the type.
 */
const isComponentSetVariant = (node: BaseNode): boolean => {
  try {
    if (node.type === 'COMPONENT' && node.parent && node.parent.type === 'COMPONENT_SET') {
      return true
    }

    return false
  } catch (error) {
    console.log('Error in isComponentSetVariant() :', error)
    return false
  }
}

export { isComponentSetVariant }
