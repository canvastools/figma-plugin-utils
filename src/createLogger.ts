/**
 * What a scope logs with. The payload is a function: see `createLogger`.
 */
type TLogger = (build: () => unknown) => void

type TLoggerOptions = {
  /**
   * Whether the logger prints now. Read on each call, so a switch that changes at run time works.
   * Without it the logger always prints.
   */
  isLogEnabled?: () => boolean
}

/**
 * A logger for one scope: `[scope] payload` in the console.
 *
 * The payload is built by a function, not passed as a value. A call site often maps
 * every node of a run into something readable, and a value would be built also in a
 * build where nobody reads the log. With a function, a disabled logger costs one check.
 *
 * The package knows nothing of the project, so the switch is the caller's: `isLogEnabled`
 * reads the config of the project. A payload that throws is logged as an error and
 * does not take down the code that logs: nothing in this package throws.
 *
 * @example
 * const log = createLogger('selection', { isLogEnabled: () => config.debug })
 *
 * log(() => ({ nodes: selection.map((node) => node.name) }))
 */
const createLogger =
  (scope: string, options: TLoggerOptions = {}): TLogger =>
  (build) => {
    if (options.isLogEnabled && !options.isLogEnabled()) return

    try {
      console.log(`[${scope}]`, build())
    } catch (error) {
      console.log(`[${scope}] could not build the log payload:`, error)
    }
  }

export { createLogger }
export type { TLogger, TLoggerOptions }
