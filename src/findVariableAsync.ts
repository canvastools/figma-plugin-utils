/**
 * How a variable or a style is named for keeping: the id it had where it was
 * picked, and its publishing key — `null`, or empty, for one never published.
 */
export type TPublishedRef = { id: string; key: string | null }

/**
 * Whether what an id found is the thing the reference meant.
 *
 * **An id names one thing in one file.** A local-form id like `VariableID:1:4`
 * is an ordinary id of a *different* variable in every other file, so an id
 * that resolves is no evidence on its own — only the key it carries is. A
 * reference with no key is taken on its id: an unpublished thing has no other
 * identity, which is safe in the file it was picked in and a gamble anywhere
 * else, and a public plugin has no way to tell the two apart — `figma.fileKey`
 * exists for private ones only.
 */
const isSamePublished = (ref: TPublishedRef, found: { key: string }): boolean => !ref.key || found.key === ref.key

/**
 * The variable a stored reference names here — by its id first, by its key
 * second — or `null`.
 *
 * The id costs a millisecond and answers only where this file already holds the
 * variable (`getVariableByIdAsync` answers `null` for anything else, measured);
 * it is believed only when what it found carries the stored key. The import
 * costs up to a second and reaches whatever the **account** can, whether or not
 * the library is enabled in this file — measured.
 *
 * `null` covers every refusal, and they cannot be told apart: the same key that
 * fails with `could not find variable with key "…"` in one account resolves in
 * another, so a refusal means "not found" or "no access", never which. Figma
 * caches a refused variable (0–1 ms the second time) and a found one only
 * sometimes, so a caller resolving the same references often keeps its own cache
 * in front of this.
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

export { findVariableAsync, isSamePublished }
