import { createVariableLookup } from './createVariableLookup'
import type { TVariableLookup } from './variableTypes'
import { isVariableAlias } from './isVariableAlias'

export type TResolveVariableValueOptions = {
  /**
   * Where the helper finds the variables and the collections of the chain.
   * Without it, the helper makes a new lookup that asks the API.
   */
  lookup?: TVariableLookup
  /** The maximum number of aliases that the helper follows. After that number, the result is `null`. */
  maxHops?: number
  /**
   * The mode of each collection, by the id of the collection: the shape of `node.resolvedVariableModes`.
   * A collection that is not in it, or a mode without a value, uses the default mode.
   */
  modes?: SceneNodeMixin['resolvedVariableModes']
}

/**
 * The maximum number of aliases that the helper follows.
 *
 * A design system with three levels is the usual case, and eight is far more than any.
 * A limit is simpler than a set of visited variables: a cycle ends at the limit, and no real chain is longer.
 */
const MAX_ALIAS_HOPS = 8

/**
 * The value of a variable in the default mode of its collection, or in the mode of `modes`.
 * The helper follows each alias in the same way.
 *
 * **Without a node.** `resolveForConsumer` answers the same question for a node, in the modes of that node.
 * A plugin that binds a variable to a node that it did not draw yet has no node. This helper is for that case.
 * Each consumer resolves to the default mode when nothing else is set.
 * So it is the correct single answer for a variable with one value for each mode.
 *
 * The value at the end of the chain is as Figma keeps it: a number, a string, a boolean, a color or another stored shape.
 * One such shape is a color with a variable for its opacity (see `resolveColorValueAsync`).
 * The result is `null` when the chain does not end. Causes: a variable or a collection that does not resolve, a mode with no
 * value, more than `maxHops` aliases.
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

    const modeId = collection ? (options.modes?.[collection.id] ?? collection.defaultModeId) : undefined
    const value: VariableValue | undefined = collection
      ? (current.valuesByMode[modeId!] ?? current.valuesByMode[collection.defaultModeId])
      : undefined

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
