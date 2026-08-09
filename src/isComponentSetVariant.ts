const isComponentSetVariant = (node: BaseNode): boolean => {
  try {
    if (node.type === 'COMPONENT' && node.parent && node.parent.type === 'COMPONENT_SET') {
      return true
    }

    return false
  } catch (error) {
    console.log('Error in isComponentSetVariant() :', error)
    return false
  }
}

export { isComponentSetVariant }
