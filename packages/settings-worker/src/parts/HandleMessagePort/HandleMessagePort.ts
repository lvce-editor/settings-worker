import { PlainMessagePortRpc } from '@lvce-editor/rpc'
import { commandMap } from '../CommandMap/CommandMap.ts'

export const handleMessagePort = async (port: MessagePort, rpcId?: number): Promise<void> => {
  await PlainMessagePortRpc.create({
    commandMap,
    isMessagePortOpen: true,
    messagePort: port,
  })
}
