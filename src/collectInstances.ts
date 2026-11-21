import { walkNodeTree } from './walkNodeTree'

export type TCollectInstancesOptions = {
  /**
   * Whether the walk goes into the children of a found instance.
   *
   * The children of an instance repeat its main component.
   * The caller finds them again, one time, when it resolves the main component. A walk into each instance reads the same content many times.
   */
  descendIntoInstances?: boolean
  /** Whether the result keeps a found instance. Without it, the result keeps each instance. */
  include?: (instance: InstanceNode) => boolean
  /** Whether the walk goes into a container. Without it, the walk goes into each container. */
  descend?: (container: SceneNode) => boolean
}

/**
 * The instances in a node.
 *
 * A walk that goes into each node leaves the filter to each caller. Then each caller writes its own visibility and property rules.
 * Both predicates answer about one layer. So the caller keeps the policy (what is part of a component).
 * `walkNodeTree` keeps the walk, as for each other walk in this package.
 *
 * It does not throw. When a subtree fails, it returns the instances that it collected before.
 * A partial list is still useful, and a layer that a user deletes during a walk is normal.
 *
 * @example
 * // Everything, however deep
 * collectInstances(component)
 *
 * @example
 * // Only what is on screen. A swap target is not kept
 * collectInstances(component, {
 *   include: (instance) => isLayerVisible(instance) && !isInstanceSwapTarget(instance, swapKeys),
 *   descend: (container) => isLayerVisible(container),
 * })
 */
const collectInstances = (node: BaseNode, options: TCollectInstancesOptions = {}): InstanceNode[] => {
  const foundInstances: InstanceNode[] = []

  walkNodeTree(node, (child) => {
    if (child.type === 'INSTANCE') {
      if (!options.include || options.include(child)) {
        foundInstances.push(child)
      }

      if (!options.descendIntoInstances) {
        return 'skip'
      }
    }

    /* A container that is not walked into hides its whole subtree */
    if (options.descend && !options.descend(child)) {
      return 'skip'
    }
  })

  /* Whatever was collected before a tree went bad is still a valid answer */
  return foundInstances
}

export { collectInstances }
