import type {
  BaseStyleMixin,
  EffectStyle,
  GridStyle,
  PaintStyle,
  RGBA,
  TextStyle,
  Variable,
  VariableCollection,
  VariableResolvedDataType,
} from '@figma/plugin-typings/plugin-api-standalone'

/**
 * The value of a variable in one mode, after each alias: a color with its alpha, a number, a string or a boolean.
 * A color has its alpha, so a swatch draws it with no change.
 */
export type TCatalogVariableValue = RGBA | number | string | boolean

/**
 * A variable of the file or of a library, as a list of the UI shows it.
 *
 * The fields have the names and the types of `Variable`. The sandbox cannot send a `Variable` to the UI, so the catalog copies
 * them.
 * `id` is `null` for a variable of a library that is not imported yet: the API gives such a variable a key and no id.
 * `scopes` and `value` are `null` for the same variable until the catalog reads its library.
 */
export type TCatalogVariable = Pick<Variable, 'key' | 'name' | 'resolvedType'> & {
  kind: 'VARIABLE'
  id: string | null
  scopes: Variable['scopes'] | null
  /** The collection of the variable. A list shows its name as a heading. */
  collection: TCatalogCollection
  /** The name of the library, or `null` for a variable of this file. */
  library: string | null
  value: TCatalogVariableValue | null
}

/** A collection of variables: its key, the same in the file and in a library, and its name. */
export type TCatalogCollection = Pick<VariableCollection, 'key' | 'name'>

type TCatalogStyleBase = Pick<BaseStyleMixin, 'id' | 'key' | 'name'> & {
  kind: 'STYLE'
  /** Always `null`: the API cannot list the styles of a library. */
  library: null
}

/** A style of this file, with the value of its type. The fields have the names and the types of the styles of Figma. */
export type TCatalogStyle =
  | (TCatalogStyleBase & { type: 'PAINT'; value: PaintStyle['paints'] })
  | (TCatalogStyleBase & { type: 'TEXT'; value: Pick<TextStyle, 'fontSize' | 'lineHeight'> })
  | (TCatalogStyleBase & { type: 'EFFECT'; value: EffectStyle['effects'] })
  | (TCatalogStyleBase & { type: 'GRID'; value: GridStyle['layoutGrids'] })

/** One row of a list of variables and styles. */
export type TCatalogItem = TCatalogVariable | TCatalogStyle

/** A library that is enabled in the file. */
export type TCatalogLibrary = {
  name: string
  /** `loading` while the catalog reads the variables of the library. */
  state: 'idle' | 'loading'
  /** The types that the catalog read to the end. A read for these types has nothing to do. */
  loadedTypes: VariableResolvedDataType[]
  /** The collections of the library. */
  collections: TCatalogCollection[]
}

/**
 * The data of a list of variables and styles. The sandbox sends it to the UI with no change.
 *
 * `isScanned` is `false` until the first scan ends. An empty `items` after the scan means that the file has no rows.
 * `items` holds the rows of the file, and the rows of a library after its first read.
 */
export type TCatalogData = {
  isScanned: boolean
  items: TCatalogItem[]
  libraries: TCatalogLibrary[]
}
