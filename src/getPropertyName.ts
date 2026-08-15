/**
 * The readable name of a component property key.
 *
 * Figma keys a non variant property as `Show icon#12:3` — the name the designer
 * typed, plus an internal id that keeps two properties of the same name apart.
 * The suffix has to stay in the key, because that is what the API and
 * `componentPropertyReferences` speak, and it has to go from anything a user
 * reads.
 *
 * The suffix is only stripped when it really looks like one. A property named
 * `Tag #1` keeps its name, because `1` is not `id:index` — cutting at the first
 * `#` would quietly rename it.
 *
 * VARIANT keys carry no suffix at all, so they pass through untouched.
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
