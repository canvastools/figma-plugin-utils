/**
 * Whether a value is a reference to a variable rather than a value of its own.
 *
 * Figma keeps an alias wherever a value could stand — in `boundVariables`, in
 * a variable's `valuesByMode`, inside a colour whose opacity is a variable — and
 * the typings declare it in each of those places separately. Read structurally,
 * so one guard answers for all of them, and for a value of unknown shape.
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
