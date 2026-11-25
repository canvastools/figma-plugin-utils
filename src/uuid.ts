/**
 * A random id of four hex groups, for an entry that the plugin stores: `'a3f1c-9b2e-4d77a-1c05f'`.
 *
 * A group has one to five hex digits. The id is not an RFC 4122 UUID and is not cryptographic.
 * `Math.random` is the only source that the plugin sandbox always has.
 * The id is enough to tell apart the entries of one document.
 *
 * @example
 * entries.set(uuid(), { value, createdAt: new Date().toISOString() })
 */
const uuid = (): string => {
  const group = (): string => Math.round(Math.random() * 1000000).toString(16)

  return `${group()}-${group()}-${group()}-${group()}`
}

export { uuid }
