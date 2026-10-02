import type { SettingItem } from '../SettingItem/SettingItem.ts'
import * as InputName from '../InputName/InputName.ts'
import * as SettingItemType from '../SettingItemType/SettingItemType.ts'
import * as SettingStrings from '../SettingStrings/SettingStrings.ts'

export const getSettingItemsApplications = (): readonly SettingItem[] => {
  return [
    {
      category: InputName.ApplicationsTab,
      description: SettingStrings.telemetryDescription(),
      heading: SettingStrings.telemetry(),
      id: 'telemetry',
      type: SettingItemType.Boolean,
      value: 'true',
    },
    {
      category: InputName.ApplicationsTab,
      description: SettingStrings.autoUpdatesDescription(),
      heading: SettingStrings.autoUpdates(),
      id: 'updates',
      type: SettingItemType.Boolean,
      value: 'true',
    },
    {
      category: InputName.ApplicationsTab,
      description: SettingStrings.linkProtectionEnabledDescription(),
      heading: SettingStrings.linkProtection(),
      id: 'application.linkProtectionEnabled',
      type: SettingItemType.Boolean,
      value: 'true',
    },
    {
      category: InputName.ApplicationsTab,
      description: 'Reduce memory usage by changing Chromium startup options. Restart the application for changes to take effect.',
      heading: 'Memory Usage',
      id: 'application.memoryUsage',
      options: [
        { id: 'default', label: 'default' },
        { id: 'reduce', label: 'reduce' },
      ],
      type: SettingItemType.Enum,
      value: 'default',
    },
  ]
}
