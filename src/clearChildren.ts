const clearChildren = (node: SceneNode): void => {
  try {
    if ('children' in node) {
      for (const child of [...node.children]) {
        child.remove()
      }
    } else {
      console.log('clearChildren() : Children not found', node)
    }
  } catch (error) {
    console.log('Error in clearChildren() :', error)
  }
}

export { clearChildren }
