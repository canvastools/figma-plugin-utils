import { isValidVariant } from './isValidVariant'

/**
 * The property values in the name of a variant.
 *
 * Figma stores the state of a variant only in its name, `Size=M, Type=Primary`. The name is editable text like each layer name.
 * This is the read half of `isValidVariant`. That check says that the string is well formed, and this helper turns it into
 * pairs.
 * It validates first, so a bad name does not give a half parsed object.
 *
 * `null` means that the name is not a property string. A result does not mean that the values are correct.
 * The caller that has the component answers the questions about the component.
 * Do the properties exist? Are all of them present? Does another variant have the same values?
 *
 * A repeated key keeps its last value, as an object does. A caller can compare the count of pairs with the count of keys.
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
