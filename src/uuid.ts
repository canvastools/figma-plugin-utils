/**
 * A random id of four hex groups, for an entry the plugin stores: `'a3f1c-9b2e0-4d77a-1c05f'`.
 *
 * Not an RFC 4122 UUID and not cryptographic: `Math.random` is the only source the
 * plugin sandbox is sure to have. Enough to tell apart the entries of one document.
 *
 * @example
 * entries.set(uuid(), { value, createdAt: new Date().toISOString() })
 */
const uuid = (): string => {
  const group = (): string => Math.round(Math.random() * 1000000).toString(16)

  return `${group()}-${group()}-${group()}-${group()}`
}

export { uuid }
