import { getPageOfNode } from './getPageOfNode'

/**
 * Goes to nodes on the canvas: their page, the viewport around them, and — when
 * asked — the selection.
 *
 * **Whether it selects is an option, because "focus" means two opposite
 * things.** "Go and look" leaves the selection alone — selecting would answer
 * whatever the plugin hangs off the selection, and cost the user what they were
 * working on. "Here is what you are working on now" selects, and the selection
 * is then the whole point.
 *
 * One page for all of them, the first node's: a selection lives on one page,
 * and nodes found together are expected to stand together. Crossing to another
 * page disturbs the selection either way — a page carries its own, and Figma
 * reports the change.
 *
 * Answers whether it went anywhere: `false` for no nodes, for a node with no
 * page (a remote or detached one), and for anything Figma refused — never a
 * throw.
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
