import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'settings.search-clear'

export const test: Test = async ({ expect, Locator, SettingsView }) => {
  // arrange
  await SettingsView.show()
  await SettingsView.handleInput('font family')

  // act
  await SettingsView.clear('')

  // assert
  const input = Locator('.SettingsSearchInput')
  await expect(input).toHaveValue('')
  await expect(input).toBeFocused()
  const additionalSetting = Locator('.SettingsItem').nth(1)
  await expect(additionalSetting).toBeVisible()
}
