const isFrameNode = (node: BaseNode): boolean => {
  return node.type === 'FRAME'
}

export { isFrameNode }
