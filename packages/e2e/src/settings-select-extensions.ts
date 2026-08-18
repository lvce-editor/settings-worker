import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'settings.select-extensions'

export const test: Test = async ({ expect, Locator, SettingsView }) => {
  // arrange
  await SettingsView.show()

  // act
  await SettingsView.selectExtensions()

  // assert
  const heading = Locator('.SettingsContentHeading')
  await expect(heading).toHaveText('Extensions')

  const extensionSetting = Locator('.SettingsItem', { hasText: 'Test Extension: Enabled' })
  await expect(extensionSetting).toHaveCount(1)
  await expect(extensionSetting.locator('.Label')).toHaveText('Enable the test extension.')
  await expect(extensionSetting.locator('input[type="checkbox"]')).toHaveJSProperty('checked', true)
}
