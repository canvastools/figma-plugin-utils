/**
 * The variable collections of the libraries enabled in this file, or an empty
 * list.
 *
 * **The getter is what throws, not the call.** Without `"teamlibrary"` in the
 * manifest's permissions, reaching for `figma.teamLibrary` throws `in
 * get_teamLibrary: "teamlibrary" permission not specified in manifest.json` — so
 * a `.catch` on the promise never sees it. Guarded around both, so a plugin
 * without the permission, or a build where it was dropped, answers with no
 * libraries rather than with nothing at all.
 *
 * Only the *enabled* libraries are listed, and the API cannot enable one; there
 * is no listing call for library **styles** at all. A key stored elsewhere
 * resolves far more widely than this lists — see `findVariableAsync`.
 *
 * @example
 * const collections = await getLibraryVariableCollectionsAsync()
 * // → [{ key, name, libraryName }]
 */
const getLibraryVariableCollectionsAsync = async (): Promise<LibraryVariableCollection[]> => {
  try {
    return await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()
  } catch (error) {
    console.log('Error in getLibraryVariableCollectionsAsync() :', error)

    return []
  }
}

export { getLibraryVariableCollectionsAsync }
