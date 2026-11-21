/**
 * A color with each channel in 0–1, the alpha too.
 *
 * It has the shape of the `RGBA` of Figma, but the package declares it. So the UI of a plugin can use the color helpers, as its sandbox does.
 * The UI does not compile with `@figma/plugin-typings`, and the type of a color picker is the same four numbers with another name.
 */
export type TColor = { r: number; g: number; b: number; a: number }

/**
 * A color in the HSB model: `h` is the hue in degrees, 0–360. `s`, `b` and `a` are in 0–1.
 *
 * The color picker of Figma uses this model. The hue, the saturation and the brightness change one at a time.
 */
export type THsb = { h: number; s: number; b: number; a: number }
