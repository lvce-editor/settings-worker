import type { SettingItem } from '../SettingItem/SettingItem.ts'

export type SettingItemNoValidate = Omit<SettingItem, 'validate'> & {
  readonly validationId: number
}
