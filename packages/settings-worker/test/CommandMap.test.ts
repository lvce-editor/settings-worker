import { expect, test } from '@jest/globals'
import { commandMap } from '../src/parts/CommandMap/CommandMap.ts'
import { handleMessagePort } from '../src/parts/HandleMessagePort/HandleMessagePort.ts'

test('exposes the standard message port command', () => {
  expect(commandMap['HandleMessagePort.handleMessagePort']).toBe(handleMessagePort)
})
