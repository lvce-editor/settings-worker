import type { SettingItem } from '../SettingItem/SettingItem.ts'
import type { SettingItemNoValidate } from '../SettingItemNoValidate/SettingItemNoValidate.ts'
import { getSettingItems } from '../GetSettingItems/GetSettingItems.ts'

const adjustValidation = (items: readonly SettingItem[]): readonly SettingItemNoValidate[] => {
  const result: SettingItemNoValidate[] = []
  let validationId = 0
  for (const item of items) {
    validationId++
    const { validate, ...rest } = item
    result.push({
      ...rest,
      validationId,
    })
  }
  return result
}

export const getSettingItems2 = async (): Promise<readonly SettingItem[]> => {
  const raw = await getSettingItems()
  const result = adjustValidation(raw)
  return result
}
