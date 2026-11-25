/**
 * The stored reference to a variable or a style: its id in the file where the user picked it, and its publish key.
 *
 * - `id` is `null` for a variable of a library that is not imported yet. Then only the key names it.
 * - `key` is `null` or empty for an item that is not published.
 */
export type TPublishedRef = { id: string | null; key: string | null }

/**
 * Where a reader of variable values finds the variables and the collections of a chain.
 *
 * Both functions give `null` and do not throw: for an id that this file does not know, and for an id that the API refused.
 */
export type TVariableLookup = {
  collectionAsync: (id: string) => Promise<VariableCollection | null>
  variableAsync: (id: string) => Promise<Variable | null>
}
