import { parse, stringify } from 'json-bigint'
import { createError, eventHandler, readBody } from "h3"
import { getBalance } from "../shared/balance"
import { web3 } from "../utils/web3"
import { wallet } from "../utils/env"
import { Transaction, TransactionReceipt } from "web3"

interface RequestBody {
  from: string
  to: string
  amount: number
}
export const transferHandler = eventHandler(async (event) => {
  const body = await readBody<RequestBody>(event)
  const { from = null, to = null, amount = 0 } = body ?? {}

  if (!from) {
    return { error: createError({ message: '[from] You must specify your wallet address', statusCode: 400 }) }
  }

  const account = wallet.find((account) => account.address === from)

  if (!wallet.find((account) => account.address === from)) {
    return { error: createError({ message: '[from] Address not exist in your wallet', statusCode: 400 }) }
  }

  if (!to) {
    return { error: createError({ message: '[to] You must specify the receiver address', statusCode: 400 }) }
  }

  if (amount <= 0) {
    return { error: createError({ message: '[amount] Amount should greater than 0', statusCode: 400 }) }
  }

  const sender = web3.eth.accounts.privateKeyToAccount(account.privateKey)
  const { balance = 0 } = await getBalance(sender.address)

  if (amount > balance) {
    return { error: createError({ message: '[amount] Amount is out of your balance', statusCode: 400 }) }
  }

  const [chainId, gasPrice] = await Promise.all([web3.eth.net.getId(), web3.eth.getGasPrice()])

  // Contract address, hard-code, is it a secret?
  const contractAddress = '0xc06fdeba4f7fa673ace5e5440ab3d495133ece7a'
  const abi = [{ "inputs": [], "name": "get", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "data", "type": "string" }], "name": "set", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]
  const contractAbi = new web3.eth.Contract(abi, contractAddress)

  // @ts-ignore Skip type error from lib, no time for declare
  const constract = contractAbi.methods.set('Khuu Thanh Phong')

  // Estimate gas, skip type error from lib
  const gas = await constract.estimateGas({ gas: String(5000000) })

  // Transaction
  const rawTransaction: Transaction = {
    from: sender.address,
    to,
    chainId,
    gasPrice,
    value: amount,
    gas,
    data: constract.encodeABI()
  }

  try {
    const signed = await sender.signTransaction(rawTransaction)
    const data = await new Promise((resolve, reject) => web3.eth.sendSignedTransaction(signed.rawTransaction)
      .on('sending', () => console.log('Transaction is sending'))
      .on('sent', () => console.log('Transaction was sent'))
      .on('transactionHash', () => console.log('Transaction hash received'))
      .on('receipt', (receipt) => console.log('Receipt received'))
      .once('confirmation', ({ confirmations, receipt }) => {
        console.log('Transaction is confirmed')
        resolve({ confirmations, receipt })
      })
      .on('error', (error) => {
        console.log('Error received')
        reject(error)
      }))

    return {
      data: parse(stringify(data))
    }
  } catch (error) {
    console.error(error)
    return { error: createError({ message: 'Internal server error', statusCode: 500 }) }
  }
})
