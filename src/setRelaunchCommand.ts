import { isRemoteNode } from './isRemoteNode'

/**
 * Puts one relaunch command on a node, beside the ones it already carries.
 *
 * `setRelaunchData` **replaces** the whole map, so a plugin with two commands
 * that writes them one after the other keeps only the second — this reads the
 * map, adds the command and writes it back. The command has to be declared in
 * `manifest.json` under `relaunchButtons`, or Figma silently shows nothing.
 *
 * Nothing is written when the node already carries the command with the same
 * description — a write is a `documentchange`, see `hasRelaunchCommand` — nor
 * to a node from a library, which Figma refuses.
 *
 * Answers whether it wrote. A node that cannot be written answers `false`: the
 * button is a convenience, and the plugin opens from the menu regardless.
 *
 * @example
 * setRelaunchCommand(figma.root, 'run', 'Generate or update variant grids')
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
