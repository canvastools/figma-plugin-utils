/**
 * The widget node the currently open app UI belongs to: a selected node of this
 * widget on the current page.
 *
 * A widget's iframe is opened from one node, but the sandbox is never told
 * which — the widget id it gets back identifies the *kind* of widget, and a
 * document may hold many nodes of it. Selection is what narrows that down: a
 * widget can only open its UI from a node the user just acted on, and that node
 * is selected for as long as the UI is up.
 *
 * Null is a normal answer, not a failure. A plugin project has no
 * `figma.widgetId` at all, and a widget whose node was deleted or deselected
 * while its UI stayed open has no source either — both cases are for the caller
 * to handle, usually by closing the UI.
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
