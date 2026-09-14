import type { SchemaError } from '../SchemaError/SchemaError.ts'
import type { SettingItem } from '../SettingItem/SettingItem.ts'
import { parseSettingsContributionWithErrors } from '../ParseSettingsContribution/ParseSettingsContribution.ts'

const loadSettingsContribution = async (
  url: string,
): Promise<{ readonly errors: readonly SchemaError[]; readonly items: readonly SettingItem[] }> => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to load settings contribution ${url}: ${response.status}`)
  }
  const value: unknown = await response.json()
  return parseSettingsContributionWithErrors(value, url)
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

const removeDuplicateItems = (items: readonly SettingItem[]): { readonly errors: readonly SchemaError[]; readonly items: readonly SettingItem[] } => {
  const ids = new Set<string>()
  const errors: SchemaError[] = []
  const uniqueItems: SettingItem[] = []
  for (const item of items) {
    if (ids.has(item.id)) {
      errors.push({
        id: item.id,
        message: `Duplicate setting contribution: ${item.id}`,
        source: 'builtin settings',
      })
      continue
    }
    ids.add(item.id)
    uniqueItems.push(item)
  }
  return { errors, items: uniqueItems }
}

export const loadSettingsContributionsWithErrors = async (
  indexUrl: string,
): Promise<{ readonly errors: readonly SchemaError[]; readonly items: readonly SettingItem[] }> => {
  const fileNames = await loadSettingsIndex(indexUrl)
  const urls = fileNames.map((fileName) => new URL(fileName, indexUrl).href)
  const contributions = await Promise.all(urls.map(loadSettingsContribution))
  const parsed = removeDuplicateItems(contributions.flatMap((contribution) => contribution.items))
  return {
    errors: [...contributions.flatMap((contribution) => contribution.errors), ...parsed.errors],
    items: parsed.items,
  }
}

export const loadSettingsContributions = async (indexUrl: string): Promise<readonly SettingItem[]> => {
  const { items } = await loadSettingsContributionsWithErrors(indexUrl)
  return items
}
