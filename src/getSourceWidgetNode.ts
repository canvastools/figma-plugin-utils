/**
 * The widget node of the open app UI: a selected node of this widget on the current page.
 *
 * A node opens the iframe of a widget, but the sandbox does not get that node.
 * The widget id identifies the type of widget, and a document can have many nodes of it.
 * The selection gives the node. A widget opens its UI only from a node that the user just used, and the node stays selected while the UI is open.
 *
 * `null` is a normal answer, not a failure. A plugin project has no `figma.widgetId`.
 * A widget whose node the user deleted or deselected with the UI open also has no source. The caller handles both cases, usually with a close of the UI.
 *
 * @example
 * const node = getSourceWidgetNode()
 *
 * if (!node) return figma.closePlugin()
 */
const getSourceWidgetNode = (): WidgetNode | null => {
  try {
    /* A plugin has no widget id, and so no node of its own to find */
    if (!figma.widgetId) return null

    const selection = figma.currentPage.selection

    return figma.currentPage.findOne(
      (node) => node.type === 'WIDGET' && node.widgetId === figma.widgetId && selection.includes(node),
    ) as WidgetNode | null
  } catch (error) {
    console.log('Error in getSourceWidgetNode() :', error)

    return null
  }
}

export { getSourceWidgetNode }
