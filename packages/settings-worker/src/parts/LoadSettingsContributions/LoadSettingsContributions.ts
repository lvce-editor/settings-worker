import type { SettingItem } from '../SettingItem/SettingItem.ts'
import { parseSettingsContribution } from '../ParseSettingsContribution/ParseSettingsContribution.ts'

const loadSettingsContribution = async (url: string): Promise<readonly SettingItem[]> => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to load settings contribution ${url}: ${response.status}`)
  }
  const value: unknown = await response.json()
  return parseSettingsContribution(value)
}

const loadSettingsIndex = async (url: string): Promise<readonly string[]> => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to load settings index ${url}: ${response.status}`)
  }
  const value: unknown = await response.json()
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== 'string')) {
    throw new TypeError('settings index must be an array of strings')
  }
  return value
}

const assertUniqueIds = (items: readonly SettingItem[]): void => {
  const ids = new Set<string>()
  for (const item of items) {
    if (ids.has(item.id)) {
      throw new Error(`Duplicate setting contribution: ${item.id}`)
    }
    ids.add(item.id)
  }
}

export const loadSettingsContributions = async (indexUrl: string): Promise<readonly SettingItem[]> => {
  const fileNames = await loadSettingsIndex(indexUrl)
  const urls = fileNames.map((fileName) => new URL(fileName, indexUrl).href)
  const contributions = await Promise.all(urls.map(loadSettingsContribution))
  const items = contributions.flat()
  assertUniqueIds(items)
  return items
}
