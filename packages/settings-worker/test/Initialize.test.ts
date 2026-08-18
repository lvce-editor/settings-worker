import { afterEach, expect, jest, test } from '@jest/globals'
import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { getSettingItems } from '../src/parts/GetSettingItems/GetSettingItems.ts'
import { initialize } from '../src/parts/Initialize/Initialize.ts'

afterEach(() => {
  jest.restoreAllMocks()
})

test('initialize loads settings contributions', async () => {
  using extensionManagementMockRpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.getAllExtensions'() {
      return [
        {
          configuration: {
            'test.enabled': {
              default: true,
              description: 'Enable the test extension.',
              type: 'boolean',
            },
          },
          name: 'Test Extension',
        },
      ]
    },
  })
  const fetchSpy = jest.spyOn(globalThis, 'fetch')
  fetchSpy
    .mockResolvedValueOnce(Response.json(['editor-worker.json', 'explorer-view.json']))
    .mockResolvedValueOnce(
      Response.json([
        {
          category: 'text-editor',
          description: 'The font size',
          heading: 'Font Size',
          id: 'editor.fontSize',
          maximum: 100,
          minimum: 10,
          type: 5,
          value: 15,
        },
      ]),
    )
    .mockResolvedValueOnce(
      Response.json([
        {
          category: 'explorer',
          description: 'Use chevrons',
          heading: 'Use Chevrons',
          id: 'explorer.useChevrons',
          type: 3,
          value: 'true',
        },
      ]),
    )

  await initialize('https://example.com/builtin-settings/index.json')

  expect(fetchSpy).toHaveBeenNthCalledWith(1, 'https://example.com/builtin-settings/index.json')
  expect(fetchSpy).toHaveBeenNthCalledWith(2, 'https://example.com/builtin-settings/editor-worker.json')
  expect(fetchSpy).toHaveBeenNthCalledWith(3, 'https://example.com/builtin-settings/explorer-view.json')
  const items = await getSettingItems()
  expect(items.slice(0, 2).map((item) => item.id)).toEqual(['editor.fontSize', 'explorer.useChevrons'])
  expect(items.some((item) => item.id === 'test.enabled')).toBe(true)
  expect(extensionManagementMockRpc.invocations).toEqual([['Extensions.getAllExtensions', '', 0]])
  expect(items[0].validate?.(9)).toBe('editor.fontSize must be at least 10')
  expect(items[0].validate?.(101)).toBe('editor.fontSize must not be greater than 100')
})

test('initialize rejects duplicate setting ids', async () => {
  const contribution = [
    {
      category: 'test',
      description: 'Test setting',
      heading: 'Test',
      id: 'test.setting',
      type: 2,
      value: '',
    },
  ]
  jest
    .spyOn(globalThis, 'fetch')
    .mockResolvedValueOnce(Response.json(['one.json', 'two.json']))
    .mockImplementation(async () => Response.json(contribution))

  await expect(initialize('https://example.com/index.json')).rejects.toThrow('Duplicate setting contribution: test.setting')
})
