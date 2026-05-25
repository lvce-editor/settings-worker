import type { Test } from '@lvce-editor/test-with-playwright'
import { assertBooleanSetting } from './assertBooleanSetting.js'

export const name = 'settings.applications-telemetry'

export const test: Test = async ({ expect, Locator, SettingsView }) => {
  await assertBooleanSetting(expect, Locator, SettingsView, 'telemetry', 'Telemetry', true)
}
