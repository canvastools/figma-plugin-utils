/**
 * Whether a node already carries a relaunch command.
 *
 * Worth asking before every `setRelaunchCommand` when the plugin listens to
 * `documentchange`: relaunch data is stored data, so each write arrives there as
 * a change carrying `pluginData` — and a plugin marking forty nodes after a run
 * would otherwise hear forty edits it made itself. `setRelaunchCommand` asks it
 * too; asking first is for a caller that has something to do before a write,
 * such as claiming it as its own.
 *
 * `false` for a node that cannot be read.
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
