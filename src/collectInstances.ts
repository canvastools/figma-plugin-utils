import { walkNodeTree } from './walkNodeTree'

export type TCollectInstancesOptions = {
  /**
   * Whether to walk the children of an instance that was found.
   *
   * False by default, and that default is the useful one: the children of an
   * instance mirror its own master, so anything below it is found again — once,
   * and for the master — as soon as that instance is resolved. Descending here
   * walks the same content once per instance instead.
   */
  descendIntoInstances?: boolean
  /* Whether a found instance is kept. Everything is kept by default */
  include?: (instance: InstanceNode) => boolean
  /* Whether the walk goes inside a container. Everything is walked by default */
  descend?: (container: SceneNode) => boolean
}

/**
 * The instances inside a node.
 *
 * Replaces the older `getNestedInstances`, which always descended everywhere and
 * left filtering to the caller — so every caller reimplemented visibility and
 * property rules, and did it against the type of the root rather than the layer
 * in hand.
 *
 * Both predicates are answers about one layer, which keeps the policy (what
 * counts as part of a component) with the caller and the traversal in
 * `walkNodeTree`, where every other walk in this package gets it too.
 *
 * Never throws: whatever was collected before a subtree went bad is returned as
 * the answer, since a partial list of instances is still useful and a deleted
 * layer mid walk is normal.
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
