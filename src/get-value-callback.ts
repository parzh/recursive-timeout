export type Value = number

export function getValue(callback: (err: Error | null, result?: Value) => void) {
  callback(null, 42)
}
