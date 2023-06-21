import { createServer } from "http";
import { createApp, eventHandler, toNodeListener } from "h3";
import { balanceHandler } from "./actions/balance";
import { transferHandler } from "./actions/transfer";

const app = createApp();

// Checking balance
app.use('/balance', balanceHandler)

// Transfer token
app.use('/transfer', transferHandler)

app.use('/', eventHandler(() => ({
  message: 'Available actions',
  actions: [
    "GET /balance",
    "POST /transfer"
  ]
})))

const port = process.env.PORT || 3000

createServer(toNodeListener(app))
  .listen(port)
  .on('listening', () => console.log(`Server is running on port ${port}`))
