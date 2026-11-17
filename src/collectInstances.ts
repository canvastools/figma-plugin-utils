import { walkNodeTree } from './walkNodeTree'

export type TCollectInstancesOptions = {
  /**
   * Whether the walk goes into the children of a found instance.
   *
   * It is `false` by default, and that is the useful default. The children of an instance repeat its main component.
   * The caller finds them again, one time, when it resolves the main component. A walk into each instance reads the same content many times.
   */
  descendIntoInstances?: boolean
  /* Whether a found instance is kept. Everything is kept by default */
  include?: (instance: InstanceNode) => boolean
  /* Whether the walk goes inside a container. Everything is walked by default */
  descend?: (container: SceneNode) => boolean
}

/**
 * The instances in a node.
 *
 * It replaces the old `getNestedInstances`. That helper always went into each node and left the filter to the caller.
 * So each caller wrote its own visibility and property rules, and checked the type of the root and not of the current layer.
 *
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
 * // Only what is on screen, skipping swappable slots
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
