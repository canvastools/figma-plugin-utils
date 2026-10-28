/**
 * Where a gradient's start, end and width are in gradient space, by its kind.
 *
 * The unit square Figma's matrix maps onto: a linear gradient runs along the
 * middle from left to right, every other kind sits on the middle with its edge
 * at the right. The third point is the one the width handle stands on.
 */
const GRADIENT_POINTS: Record<'linear' | 'centred', [number, number][]> = {
  linear: [
    [0, 0.5],
    [1, 0.5],
    [0, 1],
  ],
  centred: [
    [0.5, 0.5],
    [1, 0.5],
    [0.5, 1],
  ],
}

/**
 * A gradient's three handles — start, end and width — in the unit square of
 * whatever it paints, out of the matrix the plugin API keeps instead.
 *
 * The REST API and the editor both describe a gradient by these handles
 * (`gradientHandlePositions`); the plugin API answers with `gradientTransform`,
 * which maps the unit square of the painted layer onto gradient space. Its
 * inverse puts the gradient's own points back onto the layer, which is what a
 * handle is — and what anything drawing a preview of the paint has to know.
 *
 * A matrix that cannot be inverted squashes the gradient to a line, and is
 * answered with the points as they stand in gradient space: a preview of the
 * stops beats none.
 *
 * @example
 * const [start, end, width] = getGradientHandlePositions(paint)
 */
const getGradientHandlePositions = (paint: GradientPaint): [Vector, Vector, Vector] => {
  const [[a, b, c], [d, e, f]] = paint.gradientTransform
  const det = a * e - b * d

  const points = GRADIENT_POINTS[paint.type === 'GRADIENT_LINEAR' ? 'linear' : 'centred']

  const [start, end, width] = points.map(([x, y]) =>
    det === 0 ? { x, y } : { x: (e * (x - c) - b * (y - f)) / det, y: (a * (y - f) - d * (x - c)) / det },
  )

  return [start, end, width]
}

export { getGradientHandlePositions }
