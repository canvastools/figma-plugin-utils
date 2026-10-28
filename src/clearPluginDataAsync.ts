/**
 * Takes every entry under the given plugin data keys off the document — the
 * root and every node that carries one — and says how much it took.
 *
 * The plugin's own keys only: plugin data is private to the plugin that wrote
 * it, so another plugin's entries are neither found nor touched. One indexed
 * search for the whole document rather than a walk, which is why it loads every
 * page first — `findAllWithCriteria` answers only for the pages in memory. On a
 * large file that load is the slow part, and it is paid once per session.
 *
 * Plugin data has no delete: writing an empty string is how Figma removes an
 * entry, and an entry that is already empty is not counted.
 *
 * Shared plugin data and relaunch data are other stores and are left alone.
 *
 * @example
 * const { nodes, entries } = await clearPluginDataAsync(['table', 'layout'])
 */
const clearPluginDataAsync = async (keys: readonly string[]): Promise<{ nodes: number; entries: number }> => {
  let nodes = 0
  let entries = 0

  const clearNode = (node: BaseNode): void => {
    try {
      const cleared = keys.filter((key) => {
        if (!node.getPluginData(key)) {
          return false
        }

        node.setPluginData(key, '')

        return true
      }).length

      if (cleared) {
        nodes += 1
        entries += cleared
      }
    } catch (error) {
      console.log('Error in clearPluginDataAsync() :', error)
    }
  }

  if (!keys.length) {
    return { nodes, entries }
  }

  try {
    await figma.loadAllPagesAsync()

    clearNode(figma.root)

    // eslint-disable-next-line @figma/figma-plugins/dynamic-page-find-method-advice -- the pages are loaded two lines up
    figma.root.findAllWithCriteria({ pluginData: { keys: [...keys] } }).forEach(clearNode)
  } catch (error) {
    console.log('Error in clearPluginDataAsync() :', error)
  }

  return { nodes, entries }
}

export { clearPluginDataAsync }
