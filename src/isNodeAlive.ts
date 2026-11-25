/**
 * `true` when the node still exists and the plugin can read it.
 *
 * It is not the same as `node.removed`. A node that is really gone throws on each property read, also on `removed`.
 * So the check has a guard.
 * Code that holds a node across an `await` needs it: the user can delete or undo during the call.
 *
 * The name is positive because almost each use is a guard. `!isNodeAlive` at the top of a function reads better than a double
 * negative.
 *
 * @example
 * const mainComponent = await instance.getMainComponentAsync()
 *
 * // The await gave the user time to delete either end of this pair
 * if (!isNodeAlive(instance) || !isNodeAlive(mainComponent)) return
 */
const isNodeAlive = (node: BaseNode): boolean => {
  try {
    return !node.removed
  } catch {
    return false
  }
}

export { isNodeAlive }
