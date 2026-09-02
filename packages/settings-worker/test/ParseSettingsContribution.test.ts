import { expect, test } from '@jest/globals'
import { parseSettingsContribution } from '../src/parts/ParseSettingsContribution/ParseSettingsContribution.ts'
import * as SettingItemType from '../src/parts/SettingItemType/SettingItemType.ts'

const createSetting = (type: unknown): Record<string, unknown> => ({
  category: 'test',
  description: 'Test setting',
  heading: 'Test',
  id: 'test.setting',
  type,
  value: 1,
})

test('parseSettingsContribution rejects invalid contributions', () => {
  expect(() => parseSettingsContribution({})).toThrow('settings contribution must be an array')
  expect(() => parseSettingsContribution([{}])).toThrow('category must be a string')
})

test.each([
  ['none', SettingItemType.None],
  ['enum', SettingItemType.Enum],
  ['string', SettingItemType.String],
  ['boolean', SettingItemType.Boolean],
  ['array', SettingItemType.Array],
  ['number', SettingItemType.Number],
  ['color', SettingItemType.Color],
  ['url', SettingItemType.Url],
])('parseSettingsContribution parses the %s type', (type, expected) => {
  const [setting] = parseSettingsContribution([createSetting(type)])
  expect(setting.type).toBe(expected)
})

test('parseSettingsContribution rejects numeric types', () => {
  expect(() => parseSettingsContribution([createSetting(5)])).toThrow('setting test.setting type must be a string')
})

test('parseSettingsContribution rejects unknown types', () => {
  expect(() => parseSettingsContribution([createSetting('unknown')])).toThrow('setting test.setting has unknown type unknown')
})

test('parseSettingsContribution rejects invalid ranges', () => {
  expect(() =>
    parseSettingsContribution([
      {
        category: 'test',
        description: 'Test setting',
        heading: 'Test',
        id: 'test.setting',
        maximum: 1,
        minimum: 2,
        type: 'number',
        value: 1,
      },
    ]),
  ).toThrow('minimum must not be greater than maximum')
})
