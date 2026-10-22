/**
 * A colour with every channel in 0–1, the alpha included.
 *
 * Figma's own `RGBA` in shape, declared here rather than borrowed so that the
 * colour helpers can be read by a plugin's UI as well as by its sandbox — the
 * UI is not compiled against `@figma/plugin-typings`, and a colour picker's own
 * type is the same four numbers under another name.
 */
export type TColor = { r: number; g: number; b: number; a: number }
