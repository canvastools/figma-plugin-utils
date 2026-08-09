const getKeysOfInstanceSwapProperties = (node: ComponentNode | ComponentSetNode): string[] | undefined => {
  try {
    const ids: Set<string> = new Set<string>()

    for (const key in node.componentPropertyDefinitions) {
      if (node.componentPropertyDefinitions[key].type === 'INSTANCE_SWAP') {
        ids.add(key as string)
      }
    }

    return Array.from(ids)
  } catch (error) {
    console.log('Error in getKeysOfInstanceSwapProperties() :', error)
    return undefined
  }
}

export { getKeysOfInstanceSwapProperties }
