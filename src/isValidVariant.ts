/**
 * Whether a string is a well formed variant name.
 *
 * Figma names a variant by its properties, `Size=M, Type=Primary`, and the name is editable text.
 * After a rename by hand, the component still renders, and each tool that reads variants by name gives wrong results.
 * A check before the parse turns that into a reported node, not a wrong result with no error.
 *
 * A valid name has one or more pairs. Each pair has one `=`, and neither side is empty after a trim.
 * Spaces around the separators are correct, and so are spaces in a value: `Size = Extra Large` passes.
 *
 * It does not check if the properties exist on the component or if a key repeats. That needs the component, not the string.
 *
 * @example
 * isValidVariant('Size=M, Type=Primary')   // true
 * isValidVariant('Property 1=Default')     // true
 * isValidVariant('Size')                   // false — no value
 * isValidVariant('Size=M, =Primary')       // false — no key
 */
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
