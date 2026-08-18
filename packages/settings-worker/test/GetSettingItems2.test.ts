import { expect, test } from '@jest/globals'
import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { getSettingItems2 } from '../src/parts/GetSettingItems2/GetSettingItems2.ts'

test('returns serializable settings with stable validation ids', async () => {
  using mockRpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.getAllExtensions'() {
      return []
    },
  })
  const items = await getSettingItems2()

  expect(items.length).toBeGreaterThan(0)
  expect(items.map((item) => item.validationId)).toEqual(items.map((_, index) => index + 1))
  expect(items.every((item) => !('validate' in item))).toBe(true)
  expect(mockRpc.invocations).toEqual([['Extensions.getAllExtensions', '', 0]])
})
