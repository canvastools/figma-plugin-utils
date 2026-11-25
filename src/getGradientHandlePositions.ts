import type { GradientPaint, Vector } from '@figma/plugin-typings/plugin-api-standalone'

/**
 * The positions of the start, the end and the width of a gradient in gradient space, for each gradient type.
 *
 * The matrix of Figma maps onto a unit square. A linear gradient goes along the middle from left to right.
 * Each other type has its center in the middle and its edge at the right. The third point is the position of the width handle.
 */
const GRADIENT_POINTS: Record<'linear' | 'centered', [number, number][]> = {
  linear: [
    [0, 0.5],
    [1, 0.5],
    [0, 1],
  ],
  centered: [
    [0.5, 0.5],
    [1, 0.5],
    [0.5, 1],
  ],
}

/**
 * The three handles of a gradient (start, end, width) in the unit square of the painted area, from the matrix of the plugin
 * API.
 *
 * The REST API and the editor describe a gradient by these handles (`gradientHandlePositions`).
 * The plugin API gives `gradientTransform`. It maps the unit square of the painted layer onto gradient space.
 * Its inverse puts the points of the gradient back onto the layer.
 * These points are the handles, and a preview of the paint needs them.
 *
 * A matrix with no inverse makes the gradient a line. The helper then gives the points in gradient space:
 * a preview of the stops is better than none.
 *
 * @example
 * const [start, end, width] = getGradientHandlePositions(paint)
 */
const getGradientHandlePositions = (paint: GradientPaint): [Vector, Vector, Vector] => {
  const [[a, b, c], [d, e, f]] = paint.gradientTransform
  const det = a * e - b * d

  const points = GRADIENT_POINTS[paint.type === 'GRADIENT_LINEAR' ? 'linear' : 'centered']

  const [start, end, width] = points.map(([x, y]) =>
    det === 0 ? { x, y } : { x: (e * (x - c) - b * (y - f)) / det, y: (a * (y - f) - d * (x - c)) / det },
  )

  return [start, end, width]
}

export { getGradientHandlePositions }
