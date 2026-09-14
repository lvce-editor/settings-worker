import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import type { ExtensionManifest } from '../ExtensionConfiguration/ExtensionConfiguration.ts'
import type { SchemaError } from '../SchemaError/SchemaError.ts'
import { getExtensionSettingItemsWithErrors } from '../GetExtensionSettingItems/GetExtensionSettingItems.ts'
import * as SchemaErrors from '../SchemaErrors/SchemaErrors.ts'

export const getSchemaErrors = async (): Promise<readonly SchemaError[]> => {
  try {
    const extensions = (await ExtensionManagementWorker.invoke('Extensions.getAllExtensions', '', 0)) as readonly ExtensionManifest[]
    const { errors } = getExtensionSettingItemsWithErrors(extensions)
    return [...SchemaErrors.get(), ...errors]
  } catch {
    return SchemaErrors.get()
  }
}
