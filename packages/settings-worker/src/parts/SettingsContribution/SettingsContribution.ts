import type { SettingItemOption } from '../SettingItem/SettingItem.ts'

export interface SettingsContribution {
  readonly category: string
  readonly description: string
  readonly heading: string
  readonly id: string
  readonly maximum?: number
  readonly minimum?: number
  readonly options?: readonly SettingItemOption[]
  readonly type: number
  readonly value: unknown
}
