import { getBuiltInSettingsIndexUrl } from '../GetBuiltInSettingsIndexUrl/GetBuiltInSettingsIndexUrl.ts'
import { loadSettingsContributions } from '../LoadSettingsContributions/LoadSettingsContributions.ts'
import * as SettingsContributions from '../SettingsContributions/SettingsContributions.ts'

export const initialize = async (indexUrl: string = getBuiltInSettingsIndexUrl()): Promise<void> => {
  const settingsContributions = await loadSettingsContributions(indexUrl)
  SettingsContributions.set(settingsContributions)
}
