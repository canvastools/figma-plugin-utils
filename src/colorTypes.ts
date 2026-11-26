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

/**
 * A color in the HSL model: `h` is the hue in degrees, 0–360. `s`, `l` and `a` are in 0–1.
 *
 * CSS uses this model in `hsl()`. The lightness 0 is black and the lightness 1 is white, for each hue and saturation.
 */
export type THsl = { h: number; s: number; l: number; a: number }
