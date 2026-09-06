/**
 * True when the node still exists and can be read.
 *
 * Not an alias of `node.removed`: a node that is really gone answers any
 * property access — `removed` included — with a throw, which is why the check is
 * guarded. Anything holding a node across an `await` needs this, since the user
 * is free to delete or undo something while the call is in flight.
 *
 * The positive form is deliberate: nearly every use is a guard, and `!isNodeAlive`
 * reads better at the top of a function than a double negative would.
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
