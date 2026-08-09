const getNestedInstances = (
  node: SceneNode | GroupNode | FrameNode | InstanceNode | ComponentNode | ComponentSetNode,
): InstanceNode[] => {
  try {
    const foundInstances: InstanceNode[] = []

    const traverse = (node: SceneNode) => {
      try {
        if ('children' in node) {
          for (const child of node.children) {
            if (child.type === 'INSTANCE') {
              foundInstances.push(child as InstanceNode)
            }

            if (child.type !== 'INSTANCE' && 'children' in child) {
              traverse(child)
            }
          }
        }
      } catch (error) {
        console.log('Error while traversing node in getNestedInstances() :', error)
      }
    }

    traverse(node)

    return foundInstances
  } catch (error) {
    console.log('Error in getNestedInstances() :', error)
    return []
  }
}

export { getNestedInstances }
