import type { Test } from '@lvce-editor/test-with-playwright'
import { assertBooleanSetting } from './assertBooleanSetting.js'

export const name = 'settings.applications-auto-updates'

export const test: Test = async ({ expect, Locator, SettingsView }) => {
  await assertBooleanSetting(expect, Locator, SettingsView, 'auto updates', 'Auto Updates', true)
}
