/**
 * One key of the synced state of another widget node, with a type from the caller.
 *
 * `widgetSyncedState` is the only way to read a widget node that does not run now.
 * The `useSyncedState` hooks of a widget describe only its own node. After `cloneWidget`, the values in a closure are old.
 * `widgetSyncedState` gives `{ [key: string]: any }`, so each call site writes the same cast.
 *
 * The type parameter is a claim, not a check. An older version of the widget wrote the state, and the shape can differ.
 * So `undefined` is a normal answer, and the caller handles it.
 * A read from a deleted node throws. The helper guards the read and gives `undefined` there too.
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
