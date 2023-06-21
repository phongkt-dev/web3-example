import 'dotenv/config'

interface Wallet {
  address: string
  privateKey: string
}

const getMyWalletFromEnv = (): Wallet[] => {
  const env = process.env.MY_WALLET ?? null
  if (!env) {
    throw new Error(`Missing MY_WALLET environment variable`)
  }
  try {
    const wallet = Buffer.from(env, 'base64').toString()
    return JSON.parse(wallet)
  } catch (error) {
    throw new Error('Value of MY_WALLET should be a base64 of JSON object')
  }
}

const getNetworkEndpoint = () => {
  const endpoint = process.env.NETWORK_ENDPOINT ?? null
  if (!endpoint) {
    throw new Error('Missing NETWORK_ENDPOINT environment variable')
  }
}

const wallet = getMyWalletFromEnv()
const networkEndpoint = getNetworkEndpoint()

export { wallet, networkEndpoint }
