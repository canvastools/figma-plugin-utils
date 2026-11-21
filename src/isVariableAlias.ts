/**
 * Whether a value is a reference to a variable and not a value of its own.
 *
 * Figma keeps an alias in many places: in `boundVariables`, in `valuesByMode` of a variable, in a color with a variable opacity.
 * The typings declare it in each place separately. The guard reads the shape, so it answers for all of them and for a value of unknown shape.
 *
 * @example
 * const value = variable.valuesByMode[collection.defaultModeId]
 *
 * if (isVariableAlias(value)) next = await figma.variables.getVariableByIdAsync(value.id)
 */
const isVariableAlias = (value: unknown): value is VariableAlias => {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as VariableAlias).type === 'VARIABLE_ALIAS' &&
    typeof (value as VariableAlias).id === 'string'
  )
}

export { isVariableAlias }
