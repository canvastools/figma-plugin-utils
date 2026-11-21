import { isSamePublished } from './isSamePublished'

/**
 * The stored reference to a variable or a style: the id in the file where the user picked it, and its publish key.
 * The key is `null` or empty for an item that is not published.
 */
export type TPublishedRef = { id: string; key: string | null }

/**
 * The variable that a stored reference names in this file, or `null`. The id comes first, the key second.
 *
 * The id takes a millisecond and works only when this file has the variable. A test showed that `getVariableByIdAsync` gives `null` otherwise.
 * The helper accepts the result only when it has the stored key.
 * The import takes up to a second. A test showed that it reaches each library of the **account**, also a library that is not enabled in this file.
 *
 * `null` covers each refusal, and the refusals look the same.
 * A key that fails with `could not find variable with key "…"` in one account resolves in another.
 * So a refusal means "not found" or "no access", and Figma does not say which.
 * Figma caches a refused variable (0–1 ms the second time), and a found variable only sometimes.
 *
 * - Keep a cache in front of this helper when you resolve the same references often.
 *
 * @example
 * const variable = await findVariableAsync({ id: binding.id, key: binding.key })
 */
const findVariableAsync = async (ref: TPublishedRef): Promise<Variable | null> => {
  const byId = await figma.variables.getVariableByIdAsync(ref.id).catch(() => null)

  if (byId && isSamePublished(ref, byId)) {
    return byId
  }

  if (!ref.key) {
    return null
  }

  return figma.variables.importVariableByKeyAsync(ref.key).catch(() => null)
}

export { findVariableAsync }
