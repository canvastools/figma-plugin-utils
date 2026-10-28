import { applyOpacity } from './applyOpacity'
import type { TColor } from './colorTypes'
import { getGradientHandlePositions } from './getGradientHandlePositions'

/**
 * A gradient as a preview draws it: the paint's matrix turned into the three
 * handles — start, end and width, in the unit square of whatever it paints —
 * and every stop's colour with the paint's opacity folded in.
 */
export type TGradientPreview = {
  type: 'gradient-linear' | 'gradient-radial' | 'gradient-angular'
  gradientHandlePositions: [Vector, Vector, Vector]
  gradientStops: { color: TColor; position: number }[]
}

/* One paint of a preview: a colour or a gradient */
export type TPaintPreviewLayer = TColor | TGradientPreview

/* One paint as itself, or several, bottom first */
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
 * A list of paints — a paint style's, a node's fills — as what a swatch of
 * them draws, bottom first as Figma keeps them.
 *
 * Plain data out of the paints: a solid as its colour, its opacity folded into
 * the alpha; a gradient by its kind, its handles worked back out of
 * `gradientTransform` and its stops' colours carrying the paint's opacity. A
 * diamond gradient is drawn as a radial one.
 *
 * A hidden paint draws nothing and is left out; an image, a video or a pattern
 * has nothing a swatch can draw and is left out too. One paint left is answered
 * as itself rather than as a list of one; `null` when nothing is left.
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
