import { getSettingItems } from '../GetSettingItems/GetSettingItems.ts'
import { getTabs } from '../GetTabs/GetTabs.ts'
import * as Initialize from '../Initialize/Initialize.ts'

export const commandMap = {
  'Initialize.initialize': Initialize.initialize,
  'SettingsWorker.getSettingsItems': getSettingItems,
  'SettingsWorker.getTabs': getTabs,
}
