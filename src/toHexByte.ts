/**
 * One 0–1 channel as two upper case hex digits.
 *
 * Clamped before it is scaled, so a channel a little outside its range — which
 * arithmetic on opacities produces — is written as its nearest end rather than
 * as three digits or a minus sign.
 *
 * Not exported from the package: it is the shared half of the hex writers.
 */
const toHexByte = (channel: number): string =>
  Math.round(Math.min(Math.max(channel, 0), 1) * 255)
    .toString(16)
    .padStart(2, '0')
    .toUpperCase()

export { toHexByte }
