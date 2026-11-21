/**
 * Removes each entry of the given plugin data keys from the document, from the root and from each node. It returns the count.
 *
 * It removes only the keys of this plugin. Plugin data is private to the plugin that wrote it, so the helper does not find the entries of another plugin.
 * It uses one indexed search for the whole document, not a walk. So it loads each page first: `findAllWithCriteria` answers only for the loaded pages.
 * On a large file the load is the slow part, and it happens once in a session.
 *
 * Plugin data has no delete: Figma removes an entry when a plugin writes an empty string. The count does not include an entry that is already empty.
 *
 * The helper does not change shared plugin data and relaunch data. They are other stores.
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
