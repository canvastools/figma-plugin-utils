/**
 * Each node of one widget on the given pages.
 *
 * It is the walk half of a feature that works on the other instances of a widget.
 * Examples: a copy of the state from one widget to the others, a count, a list in a picker.
 * The caller decides which nodes are valid targets. This helper returns the nodes in page order and says nothing about them.
 *
 * - Load the pages first. `findWidgetNodesByWidgetId` throws on a page that is not loaded.
 *
 * The helper skips a page that throws and does not read it as an empty document.
 * So one bad page does not make the result of the other pages smaller with no error.
 *
 * @example
 * const pages = await loadPagesAsync()
 *
 * const targets = collectWidgetNodes(pages, { excludeIds: [source.id] })
 */
const collectWidgetNodes = (
  pages: readonly PageNode[],
  options: {
    /** The default is `figma.widgetId`: the widget that asks */
    widgetId?: string
    /** Nodes to leave out, typically the source widget itself */
    excludeIds?: readonly string[]
  } = {},
): WidgetNode[] => {
  const { widgetId = figma.widgetId, excludeIds } = options

  /* A plugin has no widget id, and no widget nodes of its own to collect */
  if (!widgetId) return []
  if (!pages.length) return []

  const excluded = excludeIds?.length ? new Set(excludeIds) : null

  return pages.flatMap((page): WidgetNode[] => {
    try {
      const nodes = page.findWidgetNodesByWidgetId(widgetId)

      return excluded ? nodes.filter((node) => !excluded.has(node.id)) : nodes
    } catch (error) {
      console.log('Error in collectWidgetNodes() :', error)

      return []
    }
  })
}

export { collectWidgetNodes }
