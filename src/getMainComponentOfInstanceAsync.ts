const getMainComponentOfInstanceAsync = async (node: InstanceNode): Promise<ComponentNode | ComponentSetNode | null> => {
  try {
    const mainComponent = await node.getMainComponentAsync()

    if (mainComponent && mainComponent.parent && mainComponent.parent.type === 'COMPONENT_SET') {
      return mainComponent.parent
    }

    if (mainComponent) {
      return mainComponent
    }

    return null
  } catch (error) {
    console.log('Error in getMainComponentOfInstanceAsync() :', error)
    return null
  }
}

export { getMainComponentOfInstanceAsync }
