import { afterEach, expect, jest, test } from '@jest/globals'
import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { getSchemaErrors } from '../src/parts/GetSchemaErrors/GetSchemaErrors.ts'
import { initialize } from '../src/parts/Initialize/Initialize.ts'

afterEach(() => {
  jest.restoreAllMocks()
})

test('reports malformed built-in entries while preserving valid siblings', async () => {
  using extensionManagementMockRpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.getAllExtensions'() {
      return []
    },
  })
  jest
    .spyOn(globalThis, 'fetch')
    .mockResolvedValueOnce(Response.json(['settings.json']))
    .mockResolvedValueOnce(
      Response.json([
        {
          category: 'text-editor',
          description: 'Valid',
          heading: 'Valid',
          id: 'valid.setting',
          type: 'string',
          value: '',
        },
        {
          category: 'text-editor',
          description: 'Invalid',
          heading: 'Invalid',
          id: 'invalid.setting',
          type: 'not-a-setting-type',
          value: '',
        },
      ]),
    )

  await initialize('https://example.com/index.json')

  const { getSettingItems } = await import('../src/parts/GetSettingItems/GetSettingItems.ts')
  await expect(getSettingItems()).resolves.toEqual(expect.arrayContaining([expect.objectContaining({ id: 'valid.setting' })]))
  expect(await getSchemaErrors()).toEqual([
    {
      id: 'invalid.setting',
      message: 'setting invalid.setting has unknown type not-a-setting-type',
      source: 'https://example.com/settings.json',
    },
  ])
  expect(extensionManagementMockRpc.invocations).toEqual([
    ['Extensions.getAllExtensions', '', 0],
    ['Extensions.getAllExtensions', '', 0],
  ])
})

test('reports malformed extension settings', async () => {
  using extensionManagementMockRpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.getAllExtensions'() {
      return [
        {
          configuration: {
            'broken.setting': { type: 'not-a-setting-type' },
          },
          name: 'Broken Extension',
        },
      ]
    },
  })
  jest.spyOn(globalThis, 'fetch').mockResolvedValue(Response.json([]))

  await initialize('https://example.com/index.json')

  expect(await getSchemaErrors()).toEqual([
    {
      id: 'broken.setting',
      message: 'setting type must be one of array, boolean, integer, number, object, or string',
      source: 'Broken Extension',
    },
  ])
  expect(extensionManagementMockRpc.invocations).toEqual([['Extensions.getAllExtensions', '', 0]])
})
