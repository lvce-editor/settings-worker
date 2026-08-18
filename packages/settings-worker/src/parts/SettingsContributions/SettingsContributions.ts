import type { SettingItem } from '../SettingItem/SettingItem.ts'

const settingsContributions: SettingItem[] = []

export const get = (): readonly SettingItem[] => {
  return settingsContributions
}

export const set = (value: readonly SettingItem[]): void => {
  settingsContributions.length = 0
  settingsContributions.push(...value)
}
