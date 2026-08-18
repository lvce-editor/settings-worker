import type { SettingItem, SettingItemOption } from '../SettingItem/SettingItem.ts'
import type { SettingsContribution } from '../SettingsContribution/SettingsContribution.ts'

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const parseOptions = (value: unknown, id: string): readonly SettingItemOption[] | undefined => {
  if (value === undefined) {
    return undefined
  }
  if (!Array.isArray(value)) {
    throw new TypeError(`setting ${id} options must be an array`)
  }
  return value.map((option) => {
    if (!isRecord(option) || typeof option.id !== 'string' || typeof option.label !== 'string') {
      throw new TypeError(`setting ${id} has an invalid option`)
    }
    return {
      id: option.id,
      label: option.label,
    }
  })
}

const parseOptionalNumber = (value: unknown, property: string, id: string): number | undefined => {
  if (value === undefined) {
    return undefined
  }
  if (typeof value !== 'number') {
    throw new TypeError(`setting ${id} ${property} must be a number`)
  }
  return value
}

const validateRequiredProperties = (value: Record<string, unknown>): void => {
  const id = typeof value.id === 'string' ? value.id : '<unknown>'
  for (const property of ['category', 'description', 'heading', 'id']) {
    if (typeof value[property] !== 'string') {
      throw new TypeError(`setting ${id} ${property} must be a string`)
    }
  }
  if (typeof value.type !== 'number') {
    throw new TypeError(`setting ${id} type must be a number`)
  }
  if (!Object.hasOwn(value, 'value')) {
    throw new TypeError(`setting ${id} must have a value`)
  }
}

const parseItem = (value: unknown): SettingsContribution => {
  if (!isRecord(value)) {
    throw new TypeError('setting contribution entries must be objects')
  }
  validateRequiredProperties(value)
  const id = value.id as string
  const minimum = parseOptionalNumber(value.minimum, 'minimum', id)
  const maximum = parseOptionalNumber(value.maximum, 'maximum', id)
  if (minimum !== undefined && maximum !== undefined && minimum > maximum) {
    throw new TypeError(`setting ${id} minimum must not be greater than maximum`)
  }
  return {
    category: value.category as string,
    description: value.description as string,
    heading: value.heading as string,
    id,
    maximum,
    minimum,
    options: parseOptions(value.options, id),
    type: value.type as number,
    value: value.value,
  }
}

const createValidator = ({ id, maximum, minimum }: SettingsContribution): ((value: unknown) => string) | undefined => {
  if (minimum === undefined && maximum === undefined) {
    return undefined
  }
  return (value: unknown): string => {
    if (typeof value !== 'number') {
      return `${id} must be of type number`
    }
    if (minimum !== undefined && value < minimum) {
      return `${id} must be at least ${minimum}`
    }
    if (maximum !== undefined && value > maximum) {
      return `${id} must not be greater than ${maximum}`
    }
    return ''
  }
}

export const parseSettingsContribution = (value: unknown): readonly SettingItem[] => {
  if (!Array.isArray(value)) {
    throw new TypeError('settings contribution must be an array')
  }
  return value.map((entry) => {
    const item = parseItem(entry)
    return {
      ...item,
      validate: createValidator(item),
    }
  })
}
