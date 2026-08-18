import { expect, test } from '@jest/globals'
import { getExtensionSettingItems } from '../src/parts/GetExtensionSettingItems/GetExtensionSettingItems.ts'
import * as SettingItemType from '../src/parts/SettingItemType/SettingItemType.ts'

test('converts supported extension configuration entries to settings items', () => {
  const result = getExtensionSettingItems([
    {
      configuration: {
        'test.enabled': {
          default: true,
          description: 'Enable the extension.',
          type: 'boolean',
        },
        'test.mode': {
          default: 'auto',
          enum: ['auto', 'manual'],
          enumDescriptions: ['Automatic', 'Manual'],
          type: 'string',
        },
        'test.refreshInterval': {
          default: 1000,
          maximum: 5000,
          minimum: 100,
          type: 'number',
        },
      },
      name: 'Test Extension',
    },
  ])

  expect(result).toEqual([
    {
      category: 'extensions',
      description: 'Enable the extension.',
      heading: 'Test Extension: Enabled',
      id: 'test.enabled',
      maximum: undefined,
      minimum: undefined,
      options: undefined,
      type: SettingItemType.Boolean,
      value: true,
    },
    {
      category: 'extensions',
      description: '',
      heading: 'Test Extension: Mode',
      id: 'test.mode',
      maximum: undefined,
      minimum: undefined,
      options: [
        { id: 'auto', label: 'Automatic' },
        { id: 'manual', label: 'Manual' },
      ],
      type: SettingItemType.Enum,
      value: 'auto',
    },
    {
      category: 'extensions',
      description: '',
      heading: 'Test Extension: Refresh Interval',
      id: 'test.refreshInterval',
      maximum: 5000,
      minimum: 100,
      options: undefined,
      type: SettingItemType.Number,
      value: 1000,
    },
  ])
})

test('uses safe defaults and ignores malformed or unsupported entries', () => {
  const result = getExtensionSettingItems([
    {
      configuration: {
        'test.boolean': { type: 'boolean' },
        'test.invalid': false,
        'test.number': { type: 'integer' },
        'test.object': { type: 'object' },
        'test.string': { title: 'Custom Title', type: 'string' },
      },
    },
    { configuration: [] },
  ])

  expect(result.map(({ heading, id, value }) => ({ heading, id, value }))).toEqual([
    { heading: 'Boolean', id: 'test.boolean', value: false },
    { heading: 'Number', id: 'test.number', value: 0 },
    { heading: 'Custom Title', id: 'test.string', value: '' },
  ])
})
