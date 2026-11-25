import type { RGBA } from '@figma/plugin-typings/plugin-api-standalone'

/**
 * A color with each channel in 0–1, the alpha too. It is the `RGBA` of Figma.
 *
 * The type comes from `@figma/plugin-typings/plugin-api-standalone`, a module without global declarations.
 * So the UI of a plugin, which compiles with the DOM, uses the color helpers as its sandbox does.
 */
export type TColor = RGBA

/**
 * A color in the HSB model: `h` is the hue in degrees, 0–360. `s`, `b` and `a` are in 0–1.
 *
 * The color picker of Figma uses this model. The hue, the saturation and the brightness change one at a time.
 */
export type THsb = { h: number; s: number; b: number; a: number }
