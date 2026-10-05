import { expect, test } from '@jest/globals'
import { getSettingItemsFeatures } from '../src/parts/GetSettingItemsFeatures/GetSettingItemsFeatures.ts'

test('getSettingItemsFeatures exposes the selected text occurrence matching setting', () => {
  const setting = getSettingItemsFeatures().find((item) => item.id === 'editor.selectedTextOccurrenceMatching')

  expect(setting).toMatchObject({
    category: 'text-editor',
    description: 'Controls whether selecting the next occurrence of selected text matches case-sensitively or case-insensitively',
    heading: 'Selected Text Occurrence Matching',
    options: [
      { id: 'caseSensitive', label: 'caseSensitive' },
      { id: 'caseInsensitive', label: 'caseInsensitive' },
    ],
    type: 1,
    value: 'caseSensitive',
  })
})
