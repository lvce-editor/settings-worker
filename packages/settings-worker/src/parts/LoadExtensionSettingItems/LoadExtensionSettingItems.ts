import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import type { ExtensionManifest } from '../ExtensionConfiguration/ExtensionConfiguration.ts'
import type { SettingItem } from '../SettingItem/SettingItem.ts'
import { getExtensionSettingItems } from '../GetExtensionSettingItems/GetExtensionSettingItems.ts'

export const loadExtensionSettingItems = async (): Promise<readonly SettingItem[]> => {
  const extensions = (await ExtensionManagementWorker.invoke('Extensions.getAllExtensions', '', 0)) as readonly ExtensionManifest[]
  return getExtensionSettingItems(extensions)
}
