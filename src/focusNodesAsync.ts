import { getPageOfNode } from './getPageOfNode'

/**
 * Goes to nodes on the canvas: their page, the viewport around them and, as an option, the selection.
 *
 * **The selection is an option, because "focus" has two opposite meanings.**
 * "Go and look" does not change the selection. A new selection starts the selection logic of the plugin, and the user loses the current work.
 * "This is your work now" selects the nodes. Then the selection is the purpose of the call.
 *
 * All the nodes go to one page, the page of the first node. A selection is on one page, and nodes that a caller finds together stay together.
 * A move to another page changes the selection in each case: each page has its own selection, and Figma reports the change.
 *
 * It returns `true` when it went to the nodes. It returns `false` for no nodes, for a node with no page (a remote or detached node) and for a refusal of Figma.
 * It does not throw.
 *
 * @example
 * await focusNodesAsync([frame])                    // look
 * await focusNodesAsync(drawn, { select: true })    // look, and work on it
 */
const focusNodesAsync = async (nodes: SceneNode[], options: { select?: boolean } = {}): Promise<boolean> => {
  const page = nodes.length ? getPageOfNode(nodes[0]) : null

  if (!page) {
    return false
  }

  try {
    if (figma.currentPage.id !== page.id) {
      await figma.setCurrentPageAsync(page)
    }

    if (options.select) {
      figma.currentPage.selection = nodes
    }

    figma.viewport.scrollAndZoomIntoView(nodes)

    return true
  } catch (error) {
    console.log('Error in focusNodesAsync() :', error)

    return false
  }
}

export { focusNodesAsync }
