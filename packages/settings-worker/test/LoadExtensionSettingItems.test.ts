import { expect, test } from '@jest/globals'
import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { loadExtensionSettingItems } from '../src/parts/LoadExtensionSettingItems/LoadExtensionSettingItems.ts'

test('loads extension manifests from the extension management worker', async () => {
  using mockRpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.getAllExtensions': (...args: readonly unknown[]) => {
      expect(args).toEqual(['', 0])
      return [
        {
          configuration: {
            'test.path': {
              default: '/test',
              description: 'Test path.',
              type: 'string',
            },
          },
          name: 'Test Extension',
        },
      ]
    },
  })

  await expect(loadExtensionSettingItems()).resolves.toEqual([
    {
      category: 'extensions',
      description: 'Test path.',
      heading: 'Test Extension: Path',
      id: 'test.path',
      maximum: undefined,
      minimum: undefined,
      options: undefined,
      type: 2,
      value: '/test',
    },
  ])
  expect(mockRpc.invocations).toEqual([['Extensions.getAllExtensions', '', 0]])
})
