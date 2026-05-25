import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'settings.applications-telemetry'

export const test: Test = async ({ expect, Locator, SettingsView }) => {
  // arrange
  await SettingsView.show()

  // act
  await SettingsView.selectTab('applications')
  await SettingsView.handleInput('telemetry')

  // assert
  const settingsItems = Locator('.SettingsItem')
  await expect(settingsItems).toHaveCount(1)

  const heading = settingsItems.locator('h3')
  await expect(heading).toHaveText('Telemetry')

  const checkbox = settingsItems.locator('input[type="checkbox"]')
  await expect(checkbox).toBeVisible()
  await expect(checkbox).toHaveAttribute('type', 'checkbox')
  await expect(checkbox).toHaveJSProperty('checked', true)
}
