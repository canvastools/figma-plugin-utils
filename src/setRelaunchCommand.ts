import { isRemoteNode } from './isRemoteNode'

/**
 * Puts one relaunch command on a node, next to its other commands.
 *
 * `setRelaunchData` **replaces** the whole map. A plugin that writes two commands one after the other keeps only the second.
 * This helper reads the map, adds the command and writes the map back.
 *
 * It writes nothing when the node already has the command with the same description. Each write is a `documentchange`: see `hasRelaunchCommand`.
 * It also writes nothing to a node from a library, because Figma refuses it.
 *
 * It returns `true` when it wrote. A node that it cannot write gives `false`. The button is a convenience, and the plugin opens from the menu.
 *
 * - Declare the command in `manifest.json` under `relaunchButtons`. Otherwise Figma shows nothing and gives no error.
 *
 * @example
 * setRelaunchCommand(figma.root, 'run', 'Open the plugin')
 */
const setRelaunchCommand = (node: BaseNode, command: string, description = ''): boolean => {
  if (isRemoteNode(node)) {
    return false
  }

  try {
    const data = node.getRelaunchData()

    if (data[command] === description) {
      return false
    }

    node.setRelaunchData({ ...data, [command]: description })

    return true
  } catch (error) {
    console.log('Error in setRelaunchCommand() :', error)

    return false
  }
}

export { setRelaunchCommand }
