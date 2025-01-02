const isPageNode = (node: BaseNode): boolean => {
  return node.type === 'PAGE'
}

export { isPageNode }
