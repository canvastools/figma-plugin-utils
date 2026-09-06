/**
 * Every node of one widget across the given pages.
 *
 * The traversal half of any "act on my other instances" feature — syncing state
 * from one widget to the rest, counting them, listing them in a picker. What
 * counts as a usable target is policy and stays with the caller: this returns
 * the nodes, in page order, and answers nothing about them.
 *
 * Pages must already be loaded — `findWidgetNodesByWidgetId` throws on a page
 * that is not. A page that throws for any reason is skipped rather than taken
 * as an empty document, so one unreadable page cannot silently shrink the
 * result of the others.
 *
 * @example
 * const pages = await loadPagesAsync()
 *
 * const targets = collectWidgetNodes(pages, { excludeIds: [source.id] })
 */
const collectWidgetNodes = (
  pages: readonly PageNode[],
  options: {
    /** Defaults to `figma.widgetId` — the widget doing the asking */
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
