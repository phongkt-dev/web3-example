import { eventHandler } from "h3"
import { getTotalBalances } from "../shared/balance"

export const balanceHandler = eventHandler(async () => {
  const data = await getTotalBalances()

  return { data }
})
