import type { TPublishedRef } from './variableTypes'

import { findVariableAsync } from './findVariableAsync'

/**
 * Binds a property of a node to the variable of a reference, for example a row of `VariableCatalog`.
 * A variable of a library gets an import first.
 * The result is the bound `Variable`, or `null` when the variable does not resolve or Figma refuses the binding.
 * Then the node does not change.
 *
 * Figma refuses a binding when the type of the variable does not fit the field, when the node does not have the field, or when
 * the node is removed.
 *
 * - Use `bindVariableToPaintAsync` for a fill or a stroke. A paint has its own binding.
 * - Pass `null` as the reference to remove the binding of the property.
 *
 * @example
 * // The gap of an auto layout frame
 * await bindVariableAsync(frame, 'itemSpacing', message.item)
 */
const bindVariableAsync = async (
  node: SceneNode,
  field: VariableBindableNodeField,
  ref: TPublishedRef | null,
): Promise<Variable | null> => {
  try {
    if (ref === null) {
      node.setBoundVariable(field, null)
      return null
    }

    const variable = await findVariableAsync(ref)
    if (variable) node.setBoundVariable(field, variable)
    return variable
  } catch (error) {
    console.log('Error in bindVariableAsync() :', error)
    return null
  }
}

export { bindVariableAsync }
