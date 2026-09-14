import type { SchemaError } from '../SchemaError/SchemaError.ts'

const schemaErrors: SchemaError[] = []

export const get = (): readonly SchemaError[] => {
  return schemaErrors
}

export const set = (value: readonly SchemaError[]): void => {
  schemaErrors.length = 0
  schemaErrors.push(...value)
}
