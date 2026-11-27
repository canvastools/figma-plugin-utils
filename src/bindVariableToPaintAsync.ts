import type { TPublishedRef } from './variableTypes'

import { findVariableAsync } from './findVariableAsync'

/**
 * A copy of a solid paint with its color bound to the variable of a reference, for example a row of `VariableCatalog`.
 * A variable of a library gets an import first.
 * The result is the same paint when the variable does not resolve or Figma refuses the binding.
 * Figma refuses it, for example, for a variable that is not `COLOR`.
 *
 * A paint is a value, not a node. Put the result into `fills` or `strokes` of the node.
 *
 * @example
 * // The first fill of a node
 * const fills = [...node.fills]
 * fills[0] = await bindVariableToPaintAsync(fills[0] as SolidPaint, message.item)
 * node.fills = fills
 */
const bindVariableToPaintAsync = async (paint: SolidPaint, ref: TPublishedRef): Promise<SolidPaint> => {
  try {
    const variable = await findVariableAsync(ref)
    return variable ? figma.variables.setBoundVariableForPaint(paint, 'color', variable) : paint
  } catch (error) {
    console.log('Error in bindVariableToPaintAsync() :', error)
    return paint
  }
}

export { bindVariableToPaintAsync }
