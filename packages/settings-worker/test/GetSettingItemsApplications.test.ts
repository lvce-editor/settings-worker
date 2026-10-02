import { expect, test } from '@jest/globals'
import * as GetSettingItemsApplications from '../src/parts/GetSettingItemsApplications/GetSettingItemsApplications.ts'

test('offers default and reduced application memory usage modes', () => {
  const setting = GetSettingItemsApplications.getSettingItemsApplications().find((item) => item.id === 'application.memoryUsage')

  expect(setting).toMatchObject({
    id: 'application.memoryUsage',
    type: 1,
    value: 'default',
    options: [
      { id: 'default', label: 'default' },
      { id: 'reduce', label: 'reduce' },
    ],
  })
})
