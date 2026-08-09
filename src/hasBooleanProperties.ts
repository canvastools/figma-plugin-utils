/**
 * Whether a component declares at least one BOOLEAN property.
 *
 * Boolean properties are what make a component have more states than it has
 * variants: every combination of them multiplies the states a single variant can
 * render in. Code that enumerates states — building a specification, a preview
 * grid, a coverage report — uses this to decide whether the variant list alone
 * is the whole story.
 *
 * Reads the definitions off the component itself, so pass the master or the set,
 * never an instance.
 *
 * False is also the answer when the definitions cannot be read at all, which is
 * the safe way round: it means "nothing extra to enumerate" rather than a crash
 * halfway through a build.
 */
const hasBooleanProperties = (node: ComponentNode | ComponentSetNode): boolean => {
  try {
    return Object.values(node.componentPropertyDefinitions).some((property) => property.type === 'BOOLEAN')
  } catch (error) {
    console.log('Error in hasBooleanProperties() :', error)
    return false
  }
}

export { hasBooleanProperties }
