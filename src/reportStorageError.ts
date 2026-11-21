import type { TStorageErrorHandler, TStorageErrorKind } from './storageTypes'

/**
 * The one way that a store reports a failure: a log line, then the handler of the caller.
 *
 * A store does not throw and does not show messages to the user. The project decides in the handler if the failure needs a toast.
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

export { reportStorageError }
