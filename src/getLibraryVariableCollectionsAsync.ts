/**
 * The variable collections of the libraries that are enabled in this file, or an empty list.
 *
 * **The getter throws, not the call.** Without `"teamlibrary"` in the permissions of the manifest, a read of `figma.teamLibrary` throws
 * `in get_teamLibrary: "teamlibrary" permission not specified in manifest.json`. So a `.catch` on the promise does not see it.
 * The helper guards both. A plugin without the permission gives an empty list and does not fail.
 *
 * The list has only the enabled libraries, and the API cannot enable a library. The API has no list call for library **styles**.
 * A stored key resolves in many more libraries than this list: see `findVariableAsync`.
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
