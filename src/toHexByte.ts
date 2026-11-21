/**
 * One 0–1 channel as two upper case hex digits.
 *
 * The helper clamps the channel before it scales it. Math on opacities can give a channel a little outside its range.
 * Such a channel becomes the nearest end, not three digits or a minus sign.
 *
 * The package does not export it: it is the shared half of the hex writers.
 */
const toHexByte = (channel: number): string =>
  Math.round(Math.min(Math.max(channel, 0), 1) * 255)
    .toString(16)
    .padStart(2, '0')
    .toUpperCase()

export { toHexByte }
