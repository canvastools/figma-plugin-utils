const isValidVariant = (input: string): boolean => {
  if (!input.trim()) return false

  const pairs = input.split(',')

  for (const pair of pairs) {
    const trimmed = pair.trim()

    const parts = trimmed.split('=')
    if (parts.length !== 2) return false

    const [key, value] = parts.map((s) => s.trim())

    if (!key || !value) return false
  }

  return true
}

export { isValidVariant }
