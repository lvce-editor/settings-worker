import type { SettingItem } from '../SettingItem/SettingItem.ts'
import { getSettingItemsApplications } from '../GetSettingItemsApplications/GetSettingItemsApplications.ts'
import { getSettingItemsExtensions } from '../GetSettingItemsExtensions/GetSettingItemsExtensions.ts'
import { getSettingItemsFeatures } from '../GetSettingItemsFeatures/GetSettingItemsFeatures.ts'
import { getSettingItemsSecurity } from '../GetSettingItemsSecurity/GetSettingItemsSecurity.ts'
import { getSettingItemsWindow } from '../GetSettingItemsWindow/GetSettingItemsWindow.ts'
import { getSettingItemsWorkbench } from '../GetSettingItemsWorkbench/GetSettingItemsWorkbench.ts'
import * as SettingsContributions from '../SettingsContributions/SettingsContributions.ts'

export const getSettingItems = async (): Promise<readonly SettingItem[]> => {
  return [
    ...SettingsContributions.get(),
    ...getSettingItemsWorkbench(),
    ...getSettingItemsWindow(),
    ...getSettingItemsFeatures(),
    ...getSettingItemsApplications(),
    ...getSettingItemsSecurity(),
    ...getSettingItemsExtensions(),
  ]
}
