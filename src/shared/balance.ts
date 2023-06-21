import { wallet } from '../utils/env'
import { web3 } from '../utils/web3'

export const getBalance = async (address: string) => {
  const res = await web3.eth.getBalance(address)
  const balance = Number(res.toString())
  return { address, balance }
}

export const getTotalBalances = async () => {
  const requests = wallet.map((account) => getBalance(account.address))
  const balances = await Promise.all(requests)
  const totalBalance = balances.reduce((prev, current) => {
    return prev + current.balance
  }, 0)

  return { balances, totalBalance }
}
