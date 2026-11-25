/**
 * What a scope logs with. The payload is a function: see `createLogger`.
 */
export type TLogger = (build: () => unknown) => void

export type TCreateLoggerOptions = {
  /**
   * Whether the logger prints now. The logger reads it at each call, so a switch that changes at run time works.
   * Without it, the logger always prints.
   */
  isLogEnabled?: () => boolean
}

/**
 * A logger for one scope: `[scope] payload` in the console.
 *
 * A function builds the payload, and the caller does not pass a value.
 * A call site often maps each node of a run into readable data. A value costs that work also in a build where nobody reads the
 * log.
 * With a function, a logger that is off costs one check.
 *
 * The package knows nothing of the project, so the caller owns the switch: `isLogEnabled` reads the config of the project.
 * The logger logs a payload that throws as an error, and the code that logs continues. Nothing in this package throws.
 *
 * @example
 * const log = createLogger('selection', { isLogEnabled: () => config.debug })
 *
 * log(() => ({ nodes: selection.map((node) => node.name) }))
 */
const createLogger =
  (scope: string, options: TCreateLoggerOptions = {}): TLogger =>
  (build) => {
    if (options.isLogEnabled && !options.isLogEnabled()) return

    try {
      console.log(`[${scope}]`, build())
    } catch (error) {
      console.log(`[${scope}] could not build the log payload:`, error)
    }
  }

export { createLogger }
