import { expect, test } from '@jest/globals'
import { parseSettingsContribution } from '../src/parts/ParseSettingsContribution/ParseSettingsContribution.ts'

test('parseSettingsContribution rejects invalid contributions', () => {
  expect(() => parseSettingsContribution({})).toThrow('settings contribution must be an array')
  expect(() => parseSettingsContribution([{}])).toThrow('category must be a string')
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
        type: 5,
        value: 1,
      },
    ]),
  ).toThrow('minimum must not be greater than maximum')
})
