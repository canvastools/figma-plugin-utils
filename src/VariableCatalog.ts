import type {
  TCatalogData,
  TCatalogItem,
  TCatalogLibrary,
  TCatalogStyle,
  TCatalogVariable,
  TCatalogVariableValue,
} from './catalogTypes'
import { createVariableLookup } from './createVariableLookup'
import { getLibraryVariableCollectionsAsync } from './getLibraryVariableCollectionsAsync'
import { resolveColorValueAsync } from './resolveColorValueAsync'
import type { TResolveVariableValueOptions } from './resolveVariableValueAsync'
import { resolveVariableValueAsync } from './resolveVariableValueAsync'
import type { TVariableLookup } from './variableTypes'

type TCatalogStyleType = TCatalogStyle['type']

/**
 * Each style type of Figma, and whether the catalog reads it.
 * A new style type of `@figma/plugin-typings` stops the build until it gets an entry here.
 */
const STYLE_TYPES_OF_CATALOG = {
  PAINT: true,
  TEXT: true,
  EFFECT: true,
  GRID: true,
  CUSTOM_ANIMATION: false,
} as const satisfies Record<StyleType, boolean>

const ALL_STYLE_TYPES = (Object.keys(STYLE_TYPES_OF_CATALOG) as StyleType[]).filter(
  (type): type is TCatalogStyleType => STYLE_TYPES_OF_CATALOG[type],
)

/** The catalog does not read `EASING` and `TIMING` variables. */
const ALL_VARIABLE_TYPES: VariableResolvedDataType[] = ['COLOR', 'FLOAT', 'STRING', 'BOOLEAN']

export type TVariableCatalogOptions = {
  /**
   * The types of the styles in the list. Without it, each type that `TCatalogStyle` has.
   * An empty array gives a list of variables only.
   */
  styles?: TCatalogStyleType[]
  /** Called with the new data after a change: a scan, each step of a read, the end of a read. */
  onChange?: (data: TCatalogData) => void
  /** The shortest time between two calls of `onChange` while a library is read, in milliseconds. Without it, 250. */
  publishEvery?: number
}

export type TScanCatalogOptions = {
  /**
   * The mode of each collection, by the id of the collection, for example `node.resolvedVariableModes`.
   * Without it, the default modes.
   */
  modes?: TResolveVariableValueOptions['modes']
}

// The sandbox has no `AbortController`. A read checks this flag between two calls of the API.
type TRun = { aborted: boolean }

/**
 * The variables and the styles that a list of the UI offers.
 * They are the variables of the file and of the enabled libraries, and the styles of the file.
 * The catalog keeps them for the session. The UI gets `TCatalogData` and shows it with no change.
 *
 * `scanAsync` reads the variables and the styles of the file and the list of the libraries.
 * The libraries need `"teamlibrary"` in the permissions of the manifest.
 * Without it, the list has no libraries, and the catalog works with the file only.
 *
 * `readLibrary` lists the variables of a library, then imports each variable of the given types for its value and its scopes.
 * An import is a call across the network, so the read sends the rows in steps and stops on `stopLibrary`.
 * A library is read once in a session. `refreshLibrary` reads it again from the start.
 *
 * - Make one catalog in the plugin code. Send the data of `onChange` to the UI.
 * - Call `scanAsync` when the UI shows the list. Figma tells nothing about a renamed variable, so a new scan finds the changes.
 * - Pass `node.resolvedVariableModes` to `scanAsync` to show the values in the modes of the selected node.
 * - Call `readLibrary` when the user opens the section of a library, with the types that the field accepts.
 * - Call `stopLibrary(null)` when the UI closes the list.
 * - Use `findVariableAsync` to get the `Variable` of a row that the user selected. A row is a `TPublishedRef`.
 *
 * @example
 * // The plugin code: the catalog sends its data to the UI
 * const catalog = new VariableCatalog({
 *   styles: ['PAINT'],
 *   onChange: (data) => figma.ui.postMessage({ type: 'catalog', data }),
 * })
 *
 * figma.ui.onmessage = async (message) => {
 *   if (message.type === 'scan') await catalog.scanAsync({ modes: figma.currentPage.selection[0]?.resolvedVariableModes })
 *   if (message.type === 'readLibrary') catalog.readLibrary(message.library, ['COLOR'])
 *   if (message.type === 'stopLibrary') catalog.stopLibrary(message.library)
 * }
 */
class VariableCatalog {
  private readonly styleTypes: TCatalogStyleType[]
  private readonly onChange?: (data: TCatalogData) => void
  private readonly publishEvery: number

  private modes: TResolveVariableValueOptions['modes']
  private localItems: TCatalogItem[] | null = null
  private libraryCollections: LibraryVariableCollection[] = []
  private readonly libraryRows = new Map<string, TCatalogVariable[]>()
  private readonly listedLibraries = new Set<string>()
  private readonly importedKeys = new Map<string, Set<string>>()
  private readonly runs = new Map<string, TRun>()
  private data: TCatalogData
  private publishedAt = 0

  constructor({ styles = ALL_STYLE_TYPES, onChange, publishEvery = 250 }: TVariableCatalogOptions = {}) {
    this.styleTypes = styles
    this.onChange = onChange
    this.publishEvery = publishEvery
    this.data = this.build()
  }

  /** The last data of the catalog. */
  getData(): TCatalogData {
    return this.data
  }

  /** Reads the variables and the styles of the file and the list of the libraries. */
  async scanAsync({ modes }: TScanCatalogOptions = {}): Promise<TCatalogData> {
    this.modes = modes

    try {
      const [variables, styles] = await Promise.all([this.readLocalVariablesAsync(), this.readLocalStylesAsync()])
      this.localItems = [...variables, ...styles]
    } catch (error) {
      console.log('Error in VariableCatalog.scanAsync() :', error)
      this.localItems = this.localItems ?? []
    }

    this.libraryCollections = await getLibraryVariableCollectionsAsync()
    this.forgetLibrariesBut(this.libraryNames())
    this.publish()

    return this.data
  }

  /**
   * Lists the variables of a library and imports each variable of the types for its value.
   * Without `types`, `COLOR`, `FLOAT`, `STRING` and `BOOLEAN`.
   */
  readLibrary(library: string, types: VariableResolvedDataType[] = ALL_VARIABLE_TYPES): TCatalogData {
    this.cancel(library)

    if (this.isLibraryRead(library, types)) {
      this.publish()
      return this.data
    }

    const run: TRun = { aborted: false }
    this.runs.set(library, run)
    this.publish()
    void this.readLibraryAsync(library, types, run)

    return this.data
  }

  /** Reads a library again from the start. */
  refreshLibrary(library: string, types: VariableResolvedDataType[] = ALL_VARIABLE_TYPES): TCatalogData {
    this.cancel(library)
    this.listedLibraries.delete(library)
    this.importedKeys.set(library, new Set())

    return this.readLibrary(library, types)
  }

  /** Stops the read of a library. With `null`, it stops each read. The rows that the read got stay. */
  stopLibrary(library: string | null): TCatalogData {
    const names = library === null ? [...this.runs.keys()] : [library]
    names.forEach((name) => this.cancel(name))
    this.publish()

    return this.data
  }

  private cancel(library: string) {
    const run = this.runs.get(library)
    if (run) run.aborted = true
    this.runs.delete(library)
  }

  private libraryNames(): string[] {
    return [...new Set(this.libraryCollections.map((collection) => collection.libraryName))].sort((left, right) =>
      left.localeCompare(right),
    )
  }

  private isLibraryRead(library: string, types: VariableResolvedDataType[]): boolean {
    if (!this.listedLibraries.has(library)) return false
    const imported = this.importedKeys.get(library)

    return (this.libraryRows.get(library) ?? []).every(
      (row) => !types.includes(row.resolvedType) || Boolean(imported?.has(row.key)),
    )
  }

  private build(): TCatalogData {
    const names = this.libraryNames()
    const libraries: TCatalogLibrary[] = names.map((name) => ({
      name,
      state: this.runs.has(name) ? 'loading' : 'idle',
      loadedTypes: ALL_VARIABLE_TYPES.filter((type) => this.isLibraryRead(name, [type])),
      collections: this.libraryCollections
        .filter((collection) => collection.libraryName === name)
        .map(({ key, name: collectionName }) => ({ key, name: collectionName })),
    }))

    return {
      isScanned: this.localItems !== null,
      items: [...(this.localItems ?? []), ...names.flatMap((name) => this.libraryRows.get(name) ?? [])],
      libraries,
    }
  }

  private publish() {
    this.data = this.build()
    this.publishedAt = Date.now()
    this.onChange?.(this.data)
  }

  // A step of a read sends the data at most one time in `publishEvery` milliseconds.
  private publishSoon() {
    if (Date.now() - this.publishedAt >= this.publishEvery) this.publish()
  }

  // A library that left the list of the file takes its rows and its read with it.
  private forgetLibrariesBut(names: string[]) {
    const kept = new Set(names)
    const known = new Set([...this.libraryRows.keys(), ...this.listedLibraries, ...this.runs.keys()])

    known.forEach((name) => {
      if (kept.has(name)) return
      this.cancel(name)
      this.libraryRows.delete(name)
      this.listedLibraries.delete(name)
      this.importedKeys.delete(name)
    })
  }

  // A value that the API does not give is a row without a value, not a failed list.
  private async readValueAsync(variable: Variable, lookup: TVariableLookup): Promise<TCatalogVariableValue | null> {
    try {
      const value = await resolveVariableValueAsync(variable, { lookup, modes: this.modes })
      if (variable.resolvedType === 'COLOR') return await resolveColorValueAsync(value, { lookup, modes: this.modes })
      return typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean' ? value : null
    } catch (error) {
      console.log('Error in VariableCatalog.readValueAsync() :', error)
      return null
    }
  }

  private async readLocalVariablesAsync(): Promise<TCatalogVariable[]> {
    const [variables, collections] = await Promise.all([
      figma.variables.getLocalVariablesAsync(),
      figma.variables.getLocalVariableCollectionsAsync(),
    ])
    const byId = new Map(collections.map((collection) => [collection.id, collection]))
    const lookup = createVariableLookup(variables, collections)

    return Promise.all(
      variables.map(async (variable) => {
        const collection = byId.get(variable.variableCollectionId)

        return {
          kind: 'VARIABLE' as const,
          id: variable.id,
          key: variable.key,
          name: variable.name,
          resolvedType: variable.resolvedType,
          scopes: [...variable.scopes],
          collection: { key: collection?.key ?? '', name: collection?.name ?? 'Variables' },
          library: null,
          value: await this.readValueAsync(variable, lookup),
        }
      }),
    )
  }

  private async readLocalStylesAsync(): Promise<TCatalogStyle[]> {
    const has = (type: TCatalogStyleType) => this.styleTypes.includes(type)
    const [paints, texts, effects, grids] = await Promise.all([
      has('PAINT') ? figma.getLocalPaintStylesAsync() : [],
      has('TEXT') ? figma.getLocalTextStylesAsync() : [],
      has('EFFECT') ? figma.getLocalEffectStylesAsync() : [],
      has('GRID') ? figma.getLocalGridStylesAsync() : [],
    ])
    const base = (style: BaseStyle) => ({
      kind: 'STYLE' as const,
      id: style.id,
      key: style.key,
      name: style.name,
      library: null,
    })

    return [
      ...paints.map((style) => ({ ...base(style), type: 'PAINT' as const, value: style.paints })),
      ...texts.map((style) => ({
        ...base(style),
        type: 'TEXT' as const,
        value: { fontSize: style.fontSize, lineHeight: style.lineHeight },
      })),
      ...effects.map((style) => ({ ...base(style), type: 'EFFECT' as const, value: style.effects })),
      ...grids.map((style) => ({ ...base(style), type: 'GRID' as const, value: style.layoutGrids })),
    ]
  }

  // The rows of a library from its descriptors: a key, a name and a type. A row keeps the value of an earlier read.
  private async listLibraryAsync(library: string, run: TRun): Promise<TCatalogVariable[] | null> {
    const previous = new Map((this.libraryRows.get(library) ?? []).map((row) => [row.key, row]))
    const rows: TCatalogVariable[] = []

    for (const collection of this.libraryCollections.filter((item) => item.libraryName === library)) {
      const variables = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(collection.key).catch(() => [])
      if (run.aborted) return null

      variables.forEach((variable) => {
        const known = previous.get(variable.key)
        rows.push({
          kind: 'VARIABLE',
          id: known?.id ?? null,
          key: variable.key,
          name: variable.name,
          resolvedType: variable.resolvedType,
          scopes: known?.scopes ?? null,
          collection: { key: collection.key, name: collection.name },
          library,
          value: known?.value ?? null,
        })
      })
    }

    return rows
  }

  private async readLibraryAsync(library: string, types: VariableResolvedDataType[], run: TRun) {
    try {
      if (!this.listedLibraries.has(library)) {
        const listed = await this.listLibraryAsync(library, run)
        if (!listed) return
        this.libraryRows.set(library, listed)
        this.listedLibraries.add(library)
        this.publish()
      }

      const tried = this.importedKeys.get(library) ?? new Set<string>()
      this.importedKeys.set(library, tried)
      const rows = [...(this.libraryRows.get(library) ?? [])]
      const lookup = createVariableLookup()

      for (const [index, row] of rows.entries()) {
        if (!types.includes(row.resolvedType) || tried.has(row.key)) continue

        const variable = await figma.variables.importVariableByKeyAsync(row.key).catch(() => null)
        const value = variable ? await this.readValueAsync(variable, lookup) : null
        if (run.aborted) return

        rows[index] = { ...row, id: variable?.id ?? null, scopes: variable ? [...variable.scopes] : null, value }
        tried.add(row.key)
        this.libraryRows.set(library, [...rows])
        this.publishSoon()
      }
    } finally {
      // Only the read that still owns the library tells how it ended.
      if (this.runs.get(library) === run) {
        this.runs.delete(library)
        this.publish()
      }
    }
  }
}

export { VariableCatalog }
