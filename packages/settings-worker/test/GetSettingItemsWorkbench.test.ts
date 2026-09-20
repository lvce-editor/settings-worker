import { expect, test } from '@jest/globals'
import { getSettingItemsWorkbench } from '../src/parts/GetSettingItemsWorkbench/GetSettingItemsWorkbench.ts'

test('getSettingItemsWorkbench includes toggles as the default boolean presentation', () => {
  const result = getSettingItemsWorkbench()
  const setting = result.find((item) => item.id === 'settings.useToggles')

  expect(setting).toMatchObject({
    category: 'workbench',
    description: 'Render boolean settings as toggles instead of checkboxes',
    heading: 'Use Toggles',
    type: 3,
    value: true,
  })
})

test('getSettingItemsWorkbench includes modern ui disabled by default', () => {
  const result = getSettingItemsWorkbench()
  const setting = result.find((item) => item.id === 'workbench.experimental.modernUI')

  expect(setting).toMatchObject({
    category: 'workbench',
    description: 'Use the modern workbench appearance',
    heading: 'Modern UI',
    type: 3,
    value: false,
  })
})
