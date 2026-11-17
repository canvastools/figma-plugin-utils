/**
 * Whether a node already has a relaunch command.
 *
 * Relaunch data is stored data. So each write comes to a `documentchange` listener as a change of `pluginData`.
 * A plugin that marks forty nodes after a run gets forty events of its own edits.
 * `setRelaunchCommand` does this check too.
 *
 * - Call it before `setRelaunchCommand` when the plugin has work before the write. An example is a mark of ownership.
 *
 * It returns `false` for a node that it cannot read.
 *
 * @example
 * if (!hasRelaunchCommand(node, 'run')) setRelaunchCommand(node, 'run', 'Open the plugin')
 */
const hasRelaunchCommand = (node: BaseNode, command: string): boolean => {
  try {
    return command in node.getRelaunchData()
  } catch (error) {
    console.log('Error in hasRelaunchCommand() :', error)

    return false
  }
}

export { hasRelaunchCommand }
