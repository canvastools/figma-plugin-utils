/**
 * Whether a node is a component that lives inside a component set — that is, one
 * variant of a component rather than a standalone one.
 *
 * The distinction matters wherever a component is counted or named. Twelve
 * variants are one component in a library and twelve entries in a node tree, and
 * a variant's own name is its property string (`Size=M, Type=Primary`), not
 * anything a user would recognise — the readable name is on the set.
 *
 * Returns a boolean rather than narrowing the node, so a caller that needs the
 * set itself should use `getComponentSetOfVariant`, which answers both questions
 * at once.
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
