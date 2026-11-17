import { createVariableLookup } from './createVariableLookup'
import type { TVariableLookup } from './createVariableLookup'
import { isVariableAlias } from './isVariableAlias'

export type TResolveVariableValueOptions = {
  /* Where the chain's variables and collections are found. A fresh one, asking the API, by default */
  lookup?: TVariableLookup
  /* How many aliases are followed before giving up. 8 by default */
  maxHops?: number
}

/**
 * The maximum number of aliases that the helper follows.
 *
 * A design system with three levels is the usual case, and eight is far more than any.
 * A limit is simpler than a set of visited variables: a cycle ends at the limit, and no real chain is longer.
 */
const MAX_ALIAS_HOPS = 8

/**
 * The value of a variable in the default mode of its collection. The helper follows each alias, in the default mode of its collection.
 *
 * **Without a node.** `resolveForConsumer` answers the same question for a node, in the modes of that node.
 * A plugin that binds a variable to a node that it did not draw yet has no node. This helper is for that case.
 * Each consumer resolves to the default mode when nothing else is set. So it is the correct single answer for a variable with one value for each mode.
 *
 * The value at the end of the chain is as Figma keeps it: a number, a string, a boolean, a color or another stored shape.
 * One such shape is a color with a variable for its opacity (see `resolveColorValueAsync`).
 * The result is `null` when the chain does not end. Causes: a variable or a collection that does not resolve, a mode with no value, more than `maxHops` aliases.
 *
 * @example
 * const value = await resolveVariableValueAsync(variable)
 *
 * if (typeof value === 'number') field.value = value
 */
const resolveVariableValueAsync = async (
  variable: Variable,
  options: TResolveVariableValueOptions = {},
): Promise<VariableValue | null> => {
  const lookup = options.lookup ?? createVariableLookup()
  const maxHops = options.maxHops ?? MAX_ALIAS_HOPS

  let current: Variable | null = variable

  for (let hop = 0; current && hop < maxHops; hop += 1) {
    const collection = await lookup.collectionAsync(current.variableCollectionId)

    const value: VariableValue | undefined = collection ? current.valuesByMode[collection.defaultModeId] : undefined

    if (value === undefined) {
      return null
    }

    if (!isVariableAlias(value)) {
      return value
    }

    current = await lookup.variableAsync(value.id)
  }

  return null
}

export { resolveVariableValueAsync }
