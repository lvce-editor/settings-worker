import { getSettingItems } from '../GetSettingItems/GetSettingItems.ts'
import * as Initialize from '../Initialize/Initialize.ts'

export const commandMap = {
  'Initialize.initialize': Initialize.initialize,
  'SettingsWorker.getSettingsItems': getSettingItems,
}
