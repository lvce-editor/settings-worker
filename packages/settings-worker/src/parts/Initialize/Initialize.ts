import type { SettingItem } from '../SettingItem/SettingItem.ts'
import { getBuiltInSettingsIndexUrl } from '../GetBuiltInSettingsIndexUrl/GetBuiltInSettingsIndexUrl.ts'
import { loadExtensionSettingItems } from '../LoadExtensionSettingItems/LoadExtensionSettingItems.ts'
import { loadSettingsContributions } from '../LoadSettingsContributions/LoadSettingsContributions.ts'
import * as SettingsContributions from '../SettingsContributions/SettingsContributions.ts'

type LoadExtensionSettingItems = () => Promise<readonly SettingItem[]>

export const initialize = async (
  indexUrl: string = getBuiltInSettingsIndexUrl(),
  loadExtensions: LoadExtensionSettingItems = loadExtensionSettingItems,
): Promise<void> => {
  const [settingsContributions, extensionSettingItems] = await Promise.all([loadSettingsContributions(indexUrl), loadExtensions()])
  SettingsContributions.set([...settingsContributions, ...extensionSettingItems])
}
