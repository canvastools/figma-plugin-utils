/**
 * Whether a font can be loaded — and so whether text can be written in it.
 *
 * Writing to a text node needs its font loaded first, and a font can be
 * unavailable for reasons a plugin cannot see: not installed, not shared with
 * this team, a style the family does not have. Asking before deciding to use a
 * text style is cheaper than a write that throws halfway through a run. A font
 * that loads stays loaded, so the answer costs nothing the write would not pay.
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
