import { getBuiltInSettingsIndexUrl } from '../GetBuiltInSettingsIndexUrl/GetBuiltInSettingsIndexUrl.ts'
import { loadSettingsContributionsWithErrors } from '../LoadSettingsContributions/LoadSettingsContributions.ts'
import * as SchemaErrors from '../SchemaErrors/SchemaErrors.ts'
import * as SettingsContributions from '../SettingsContributions/SettingsContributions.ts'

export const initialize = async (indexUrl: string = getBuiltInSettingsIndexUrl()): Promise<void> => {
  const { errors, items } = await loadSettingsContributionsWithErrors(indexUrl)
  SettingsContributions.set(items)
  SchemaErrors.set(errors)
}
