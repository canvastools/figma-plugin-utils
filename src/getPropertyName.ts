/**
 * The readable name of a component property key.
 *
 * Figma keys a property that is not a variant as `Show icon#12:3`: the name of the designer and an internal id.
 * The id keeps two properties with the same name apart. The key keeps the suffix, because the API and `componentPropertyReferences` use it.
 * A text for a user does not show it.
 *
 * The helper removes the suffix only when it has the form of a suffix. A property `Tag #1` keeps its name: `1` is not `id:index`.
 * A cut at the first `#` changes the name with no error.
 *
 * VARIANT keys have no suffix, so they stay the same.
 *
 * @example
 * getPropertyName('Show icon#12:3')   // 'Show icon'
 * getPropertyName('Size')             // 'Size'
 * getPropertyName('Tag #1')           // 'Tag #1'
 */
const getPropertyName = (key: string): string => {
  const separatorIndex = key.lastIndexOf('#')

  if (separatorIndex <= 0) {
    return key
  }

  const suffix = key.slice(separatorIndex + 1)

  /* The shape Figma appends: two numbers separated by a colon */
  if (!/^\d+:\d+$/.test(suffix)) {
    return key
  }

  return key.slice(0, separatorIndex)
}

export { getPropertyName }
