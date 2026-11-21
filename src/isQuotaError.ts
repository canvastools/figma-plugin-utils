/**
 * Whether Figma refused a write because the storage is full.
 *
 * The package does not export it: the storage adapters share it.
 */
const isQuotaError = (error: unknown): boolean => error instanceof Error && /quota exceeded|exceeds.*limit/i.test(error.message)

export { isQuotaError }
