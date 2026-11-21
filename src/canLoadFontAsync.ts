/**
 * Whether a font loads, and so whether a plugin can write text in it.
 *
 * A write to a text node needs its font loaded first. A font can be unavailable for reasons that a plugin does not see.
 * Examples: the font is not installed, the team does not share it, the family does not have the style.
 * A check before the choice of a text style costs less than a write that throws in the middle of a run.
 * A loaded font stays loaded, so the check costs nothing more than the write.
 *
 * @example
 * if (await canLoadFontAsync(style.fontName)) applyTextStyle(style)
 */
const canLoadFontAsync = async (fontName: FontName): Promise<boolean> => {
  try {
    await figma.loadFontAsync(fontName)

    return true
  } catch {
    return false
  }
}

export { canLoadFontAsync }
