import { isValidVariant } from './isValidVariant'

/**
 * The property values a variant name spells out.
 *
 * Figma stores the state of a variant nowhere but in its name —
 * `Size=M, Type=Primary` — and that name is editable text like any other layer
 * name. This is the reading half of `isValidVariant`: the check says the string
 * is well formed, this one turns it into pairs, and it validates first so a
 * malformed name can never come back as a half parsed object.
 *
 * Null means the name is not a property string at all. What it does *not* mean
 * is that the values are right: whether those properties exist on the component,
 * whether all of them are there, and whether another variant already claimed the
 * same values are questions about the component rather than about the string,
 * and the caller holding the component is the one that can answer them.
 *
 * A repeated key keeps its last value, which is what the object shape implies
 * anyway — a caller that cares can compare the pair count against the keys it
 * got back.
 *
 * @example
 * parseVariantName('Size=M, Type=Primary')   // { Size: 'M', Type: 'Primary' }
 * parseVariantName('Size = Extra Large')     // { Size: 'Extra Large' }
 * parseVariantName('Button/Primary')         // null
 */
const parseVariantName = (name: string): Record<string, string> | null => {
  if (!isValidVariant(name)) {
    return null
  }

  const values: Record<string, string> = {}

  for (const pair of name.split(',')) {
    const [key, value] = pair.split('=').map((part) => part.trim())

    values[key] = value
  }

  return values
}

export { parseVariantName }
