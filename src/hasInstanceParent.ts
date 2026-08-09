const hasInstanceParent = (node: BaseNode): boolean => {
  try {
    if (node.type === 'INSTANCE') {
      return true
    }

    if ('parent' in node) {
      if (node.parent && hasInstanceParent(node.parent)) {
        return true
      }
    }

    return false
  } catch (error) {
    console.log('Error in hasInstanceParent() :', error)
    return false
  }
}

export { hasInstanceParent }
