import type { ColorStop, GradientPaint, Paint, Vector } from '@figma/plugin-typings/plugin-api-standalone'

import { applyOpacity } from './applyOpacity'
import type { TColor } from './colorTypes'
import { getGradientHandlePositions } from './getGradientHandlePositions'

/**
 * A gradient as a preview draws it.
 * The matrix of the paint becomes three handles: start, end and width, in the unit square of the painted area.
 * The color of each stop includes the opacity of the paint.
 */
export type TGradientPreview = {
  type: 'gradient-linear' | 'gradient-radial' | 'gradient-angular'
  gradientHandlePositions: [Vector, Vector, Vector]
  gradientStops: (Pick<ColorStop, 'position'> & { color: TColor })[]
}

/** One paint of a preview: a color or a gradient. */
export type TPaintPreviewLayer = TColor | TGradientPreview

/** One paint, or a list of paints with the bottom paint first. */
export type TPaintPreview = TPaintPreviewLayer | TPaintPreviewLayer[]

const GRADIENT_TYPES: Record<GradientPaint['type'], TGradientPreview['type']> = {
  GRADIENT_LINEAR: 'gradient-linear',
  GRADIENT_RADIAL: 'gradient-radial',
  GRADIENT_ANGULAR: 'gradient-angular',
  /* No diamond in a preview: a radial gradient is the closest picture of one */
  GRADIENT_DIAMOND: 'gradient-radial',
}

const toGradientPreview = (paint: GradientPaint): TGradientPreview => ({
  type: GRADIENT_TYPES[paint.type],
  gradientHandlePositions: getGradientHandlePositions(paint),
  gradientStops: paint.gradientStops.map((stop) => ({
    color: applyOpacity(stop.color, paint.opacity ?? 1),
    position: stop.position,
  })),
})

/**
 * A list of paints (of a paint style, the fills of a node) as a swatch draws it, from the bottom up.
 *
 * The result is plain data from the paints. A solid gives its color, with its opacity in the alpha.
 * A gradient gives its type, its handles from `gradientTransform` and the colors of its stops with the opacity of the paint.
 * A diamond gradient becomes a radial gradient.
 *
 * The result omits a hidden paint. It also omits an image, a video and a pattern: a swatch cannot draw them.
 * When one paint is left, the result is that paint, not a list of one. When no paint is left, the result is `null`.
 *
 * @example
 * const preview = toPaintPreview(style.paints)
 * // → { r: 1, g: 0, b: 0, a: 0.5 }
 */
const toPaintPreview = (paints: readonly Paint[]): TPaintPreview | null => {
  const layers = paints
    /* Not every version of the typings declares `visible` on a `PatternPaint` */
    .filter((paint) => !('visible' in paint) || paint.visible !== false)
    .flatMap((paint): TPaintPreviewLayer[] => {
      if (paint.type === 'SOLID') {
        return [applyOpacity(paint.color, paint.opacity ?? 1)]
      }

      return paint.type.startsWith('GRADIENT_') ? [toGradientPreview(paint as GradientPaint)] : []
    })

  if (!layers.length) {
    return null
  }

  return layers.length === 1 ? layers[0] : layers
}

export { toPaintPreview }
