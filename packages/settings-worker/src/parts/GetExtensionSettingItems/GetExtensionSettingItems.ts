import type { ExtensionConfigurationProperty, ExtensionManifest } from '../ExtensionConfiguration/ExtensionConfiguration.ts'
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
  if (property.type === 'boolean') {
    return SettingItemType.Boolean
  }
  if (property.type === 'number' || property.type === 'integer') {
    return SettingItemType.Number
  }
  if (property.type === 'string' && Array.isArray(property.enum)) {
    return SettingItemType.Enum
  }
  if (property.type === 'string') {
    return SettingItemType.String
  }
  return SettingItemType.None
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
  if (!Array.isArray(property.enum) || property.enum.some((value) => typeof value !== 'string')) {
    return undefined
  }
  const descriptions = Array.isArray(property.enumDescriptions) ? property.enumDescriptions : []
  return property.enum.map((value, index) => ({
    id: value,
    label: typeof descriptions[index] === 'string' ? descriptions[index] : value,
  }))
}

const getOptionalNumber = (value: unknown): number | undefined => {
  return typeof value === 'number' ? value : undefined
}

const toSettingItem = (extension: ExtensionManifest, id: string, value: unknown): SettingItem | undefined => {
  if (!isRecord(value)) {
    return undefined
  }
  const property: ExtensionConfigurationProperty = value
  const type = getSettingType(property)
  if (type === SettingItemType.None) {
    return undefined
  }
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

const getSettingItemsForExtension = (extension: ExtensionManifest): readonly SettingItem[] => {
  if (!isRecord(extension.configuration)) {
    return []
  }
  const items: SettingItem[] = []
  for (const [id, value] of Object.entries(extension.configuration)) {
    const item = toSettingItem(extension, id, value)
    if (item) {
      items.push(item)
    }
  }
  return items
}

export const getExtensionSettingItems = (extensions: readonly ExtensionManifest[]): readonly SettingItem[] => {
  return extensions.flatMap(getSettingItemsForExtension)
}
