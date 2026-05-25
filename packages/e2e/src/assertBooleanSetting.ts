import type { Test, TestApi } from '@lvce-editor/test-with-playwright'

interface BooleanSettingFixtures {
  readonly expect: TestApi['expect']
  readonly Locator: TestApi['Locator']
  readonly SettingsView: TestApi['SettingsView']
}

export const assertBooleanSetting = async (
  expect: BooleanSettingFixtures['expect'],
  Locator: BooleanSettingFixtures['Locator'],
  SettingsView: BooleanSettingFixtures['SettingsView'],
  name: string,
  headingText: string,
  expectedChecked: boolean,
): Promise<void> => {
  await SettingsView.show()
  await SettingsView.selectTab('applications')
  await SettingsView.handleInput(name)

  const settingsItems = Locator('.SettingsItem')
  await expect(settingsItems).toHaveCount(1)

  const heading = settingsItems.locator('h3')
  await expect(heading).toHaveText(headingText)

  const checkbox = settingsItems.locator('input[type="checkbox"]')
  await expect(checkbox).toBeVisible()
  await expect(checkbox).toHaveAttribute('type', 'checkbox')
  await expect(checkbox).toHaveJSProperty('checked', expectedChecked)
}
