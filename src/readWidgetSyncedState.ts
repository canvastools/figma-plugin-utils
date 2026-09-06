/**
 * One key of another widget node's synced state, typed by the caller.
 *
 * `widgetSyncedState` is the only way to read a widget node that is not the one
 * running: its own `useSyncedState` hooks describe this node alone, and after a
 * `cloneWidget` the values a closure captured are stale. It comes back as
 * `{ [key: string]: any }`, so every call site ends up writing the same cast.
 *
 * The type parameter is a claim, not a check — the state was written by a
 * version of the widget that may no longer match this one, which is what makes
 * `undefined` a normal answer worth handling. Reading it off a deleted node
 * throws, so the read is guarded and answers `undefined` there too.
 *
 * @example
 * const settings = readWidgetSyncedState<TSettings>(node, 'settingsState')
 *
 * if (!settings) return
 */
const readWidgetSyncedState = <T>(node: WidgetNode, key: string): T | undefined => {
  try {
    return node.widgetSyncedState?.[key] as T | undefined
  } catch (error) {
    console.log('Error in readWidgetSyncedState() :', error)

    return undefined
  }
}

export { readWidgetSyncedState }
