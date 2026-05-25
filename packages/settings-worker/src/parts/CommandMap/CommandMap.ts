import { getSettingItems2 } from '../GetSettingItems2/GetSettingItems2.ts'
import { getSettingItems } from '../GetSettingItems/GetSettingItems.ts'
import { getTabs } from '../GetTabs/GetTabs.ts'
import { handleMessagePort } from '../HandleMessagePort/HandleMessagePort.ts'
import * as Initialize from '../Initialize/Initialize.ts'
import { validateSetting } from '../ValidateSetting/ValidateSetting.ts'
import { validateSettings } from '../ValidateSettings/ValidateSettings.ts'

export const commandMap = {
  'Initialize.initialize': Initialize.initialize,
  'SettingsWorker.getSettingsItems': getSettingItems,
  'SettingsWorker.getSettingsItems2': getSettingItems2,
  'SettingsWorker.getTabs': getTabs,
  'SettingsWorker.handleMessagePort': handleMessagePort,
  'SettingsWorker.validateSetting': validateSetting,
  'SettingsWorker.validateSettings': validateSettings,
}
