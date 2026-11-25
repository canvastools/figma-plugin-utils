/**
 * Whether a component declares one or more BOOLEAN properties.
 *
 * Boolean properties give a component more states than variants. Each combination multiplies the states of one variant.
 * Code that lists states (a specification, a preview grid, a coverage report) uses it to know if the variant list is complete.
 *
 * It also gives `false` when it cannot read the definitions. That is the safe side:
 * "nothing more to list" and not a crash in the middle of a build.
 *
 * - Pass the main component or the set, not an instance. The helper reads the definitions on the component.
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
