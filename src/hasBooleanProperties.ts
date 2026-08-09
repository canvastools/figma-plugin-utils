const hasBooleanProperties = (node: ComponentNode | ComponentSetNode): boolean => {
  try {
    return Object.values(node.componentPropertyDefinitions).some((property) => property.type === 'BOOLEAN')
  } catch (error) {
    console.log('Error in hasBooleanProperties() :', error)
    return false
  }
}

export { hasBooleanProperties }
