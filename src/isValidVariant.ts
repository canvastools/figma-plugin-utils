/**
 * Whether a string is a well formed variant name.
 *
 * Figma names a variant after its properties — `Size=M, Type=Primary` — and that
 * name is editable text like any other. Rename it by hand, and the component
 * still renders while every tool that reads variants by name starts lying.
 * Checking before parsing is what turns that into a reported node instead of a
 * silently wrong result.
 *
 * Valid means: at least one pair, every pair split by a single `=`, and neither
 * side empty once trimmed. Spaces around the separators are fine, and so are
 * spaces inside a value — `Size = Extra Large` passes.
 *
 * It says nothing about whether the properties exist on the component or whether
 * a key is repeated: that needs the component itself, not the string.
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
