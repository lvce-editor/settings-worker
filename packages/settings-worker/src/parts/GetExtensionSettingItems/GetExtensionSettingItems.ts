import type { ExtensionConfigurationProperty, ExtensionManifest } from '../ExtensionConfiguration/ExtensionConfiguration.ts'
import type { SchemaError } from '../SchemaError/SchemaError.ts'
import type { SettingItem, SettingItemOption } from '../SettingItem/SettingItem.ts'
import * as InputName from '../InputName/InputName.ts'
import * as SettingItemType from '../SettingItemType/SettingItemType.ts'

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const getDefaultValue = (property: ExtensionConfigurationProperty): unknown => {
  if (Object.hasOwn(property, 'default')) {
    return property.default
  }
  if (property.type === 'boolean') {
    return false
  }
  if (property.type === 'number' || property.type === 'integer') {
    return 0
  }
  return ''
}

const getSettingType = (property: ExtensionConfigurationProperty): number => {
  switch (property.type) {
    case 'array':
      return SettingItemType.Array
    case 'boolean':
      return SettingItemType.Boolean
    case 'integer':
    case 'number':
      return SettingItemType.Number
    case 'object':
      return SettingItemType.Object
    case 'string':
      return Array.isArray(property.enum) ? SettingItemType.Enum : SettingItemType.String
    default:
      throw new TypeError(`setting type must be one of array, boolean, integer, number, object, or string`)
  }
}

const toTitleCase = (value: string): string => {
  const withSpaces = value.replaceAll('.', ' ').replaceAll(/([a-z\d])([A-Z])/g, '$1 $2')
  return withSpaces.replaceAll(/(^|\s)\S/g, (character) => character.toUpperCase())
}

const getHeading = (extension: ExtensionManifest, id: string, property: ExtensionConfigurationProperty): string => {
  if (typeof property.title === 'string') {
    return property.title
  }
  const settingName = id.includes('.') ? id.slice(id.indexOf('.') + 1) : id
  const heading = toTitleCase(settingName)
  return typeof extension.name === 'string' && extension.name.length > 0 ? `${extension.name}: ${heading}` : heading
}

const getOptions = (property: ExtensionConfigurationProperty): readonly SettingItemOption[] | undefined => {
  if (property.enum === undefined) {
    return undefined
  }
  if (!Array.isArray(property.enum) || property.enum.some((value) => typeof value !== 'string')) {
    throw new TypeError('setting enum must be an array of strings')
  }
  const descriptions = Array.isArray(property.enumDescriptions) ? property.enumDescriptions : []
  return property.enum.map((value, index) => ({
    id: value,
    label: typeof descriptions[index] === 'string' ? descriptions[index] : value,
  }))
}

const getOptionalNumber = (value: unknown): number | undefined => {
  if (value === undefined) {
    return undefined
  }
  if (typeof value !== 'number') {
    throw new TypeError('setting minimum and maximum must be numbers')
  }
  return value
}

const toSettingItem = (extension: ExtensionManifest, id: string, value: unknown): SettingItem | undefined => {
  if (!isRecord(value)) {
    throw new TypeError(`setting ${id} must be an object`)
  }
  const property: ExtensionConfigurationProperty = value
  const type = getSettingType(property)
  return {
    category: InputName.ExtensionsTab,
    description: typeof property.description === 'string' ? property.description : '',
    heading: getHeading(extension, id, property),
    id,
    maximum: getOptionalNumber(property.maximum),
    minimum: getOptionalNumber(property.minimum),
    options: getOptions(property),
    type,
    value: getDefaultValue(property),
  }
}

const getExtensionName = (extension: ExtensionManifest): string => {
  return typeof extension.name === 'string' && extension.name.length > 0 ? extension.name : '<unknown extension>'
}

export const getExtensionSettingItemsWithErrors = (
  extensions: readonly ExtensionManifest[],
): { readonly errors: readonly SchemaError[]; readonly items: readonly SettingItem[] } => {
  const results = extensions.map(getExtensionSettingItemsForExtension)
  return {
    errors: results.flatMap((result) => result.errors),
    items: results.flatMap((result) => result.items),
  }
}

const getExtensionSettingItemsForExtension = (
  extension: ExtensionManifest,
): { readonly errors: readonly SchemaError[]; readonly items: readonly SettingItem[] } => {
  if (extension.configuration === undefined) {
    return { errors: [], items: [] }
  }
  if (!isRecord(extension.configuration)) {
    return {
      errors: [{ id: '<unknown>', message: 'extension configuration must be an object', source: getExtensionName(extension) }],
      items: [],
    }
  }
  const entries = Object.entries(extension.configuration)
  const results = entries.map(([id, value]) => getExtensionSettingItem(extension, id, value))
  return {
    errors: results.flatMap((result) => (result.error ? [result.error] : [])),
    items: results.flatMap((result) => (result.item ? [result.item] : [])),
  }
}

const getExtensionSettingItem = (
  extension: ExtensionManifest,
  id: string,
  value: unknown,
): { readonly error?: SchemaError; readonly item?: SettingItem } => {
  try {
    const item = toSettingItem(extension, id, value)
    if (item) {
      return { item }
    }
    return {
      error: { id, message: `setting ${id} has an unsupported or invalid type`, source: getExtensionName(extension) },
    }
  } catch (error) {
    return {
      error: { id, message: error instanceof Error ? error.message : String(error), source: getExtensionName(extension) },
    }
  }
}

export const getExtensionSettingItems = (extensions: readonly ExtensionManifest[]): readonly SettingItem[] => {
  return getExtensionSettingItemsWithErrors(extensions).items
}
