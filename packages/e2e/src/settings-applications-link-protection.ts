import type { Test } from '@lvce-editor/test-with-playwright'
import { assertBooleanSetting } from './assertBooleanSetting.js'

export const name = 'settings.applications-link-protection'

export const test: Test = async ({ expect, Locator, SettingsView }) => {
  await assertBooleanSetting(expect, Locator, SettingsView, 'link protection', 'Link Protection', true)
}
