import type { TStorageErrorHandler, TStorageErrorKind } from './storageTypes'

/** Whether Figma refused a write because the storage is full. */
const isQuotaError = (error: unknown): boolean => error instanceof Error && /quota exceeded|exceeds.*limit/i.test(error.message)

/**
 * The one way a store reports a failure: a log line, then the caller's handler.
 *
 * A store never throws and never talks to the user. The handler is where a
 * project decides whether the failure deserves a toast.
 */
const reportStorageError = (
  source: string,
  kind: TStorageErrorKind,
  error: unknown,
  onError: TStorageErrorHandler | undefined,
): void => {
  console.log(`Error in ${source} (${kind}) :`, error)

  try {
    onError?.(kind, error)
  } catch (handlerError) {
    console.log(`Error in the onError handler of ${source} :`, handlerError)
  }
}

export { isQuotaError, reportStorageError }
