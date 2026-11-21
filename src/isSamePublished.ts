import type { TPublishedRef } from './findVariableAsync'

/**
 * Whether the item that an id found is the item of the reference.
 *
 * The package does not export it: `findVariableAsync` and `findStyleAsync` share it.
 *
 * **An id names one item in one file.** A local id like `VariableID:1:4` is a usual id of a different variable in each other file.
 * So an id that resolves proves nothing. Only its key proves the match.
 * A reference with no key matches by its id: an unpublished item has no other identity.
 * That is safe in the file where the user picked it, and a risk in other files.
 * A public plugin cannot tell the files apart: `figma.fileKey` exists only for private plugins.
 */
const isSamePublished = (ref: TPublishedRef, found: { key: string }): boolean => !ref.key || found.key === ref.key

export { isSamePublished }
