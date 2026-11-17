/**
 * A color with each channel in 0–1, the alpha too.
 *
 * It has the shape of the `RGBA` of Figma, but the package declares it. So the UI of a plugin can use the color helpers, as its sandbox does.
 * The UI does not compile with `@figma/plugin-typings`, and the type of a color picker is the same four numbers with another name.
 */
export type TColor = { r: number; g: number; b: number; a: number }
