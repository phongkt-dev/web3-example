# WEB3 example

## Setup
### Copy env file
```sh
cp .env_example .env

# Set your NETWORK_ENDPOINT if necessary
```

### Setting your wallet information
```sh
echo '[
  {
    "address": "0xYOUR ADDRESS",
    "privateKey": "YOUR PRIVATE KEY"
  },
  {
    "address": "0xYOUR ADDRESS",
    "privateKey": "YOUR PRIVATE KEY"
  }
]' | base64

# COPY above output to your .env file, at MY_WALLET=
```

### Install dependencies and run the wallet
```sh
yarn
yarn dev
```

### Actions
|Action|Description|
|-|-|
|`GET` `/balance`|Get wallet balance|
|`POST` `/transfer`|Transfer token from address in walet to another address|


### Example
#### Get balance
```sh
curl --location 'http://localhost:3000/balance'
```
Output:
```json
{
  "data": {
    "balances": [
      {
        "address": "0x778E72B05320A00cd014Cd7aB842BE866022634b",
        "balance": 17833599993013584
      },
      {
        "address": "0xC969D4d09D431CF43861701EB0C0BdD15C838ECB",
        "balance": 6986415
      }
    ],
    "totalBalance": 17833600000000000
  }
}
```

#### Transfer token
```sh
curl --location 'http://localhost:3000/transfer' \
--header 'Content-Type: application/json' \
--data '{
    "from": "0x778E72B05320A00cd014Cd7aB842BE866022634b",
    "to": "0xC969D4d09D431CF43861701EB0C0BdD15C838ECB",
    "amount": 912345
}'
```
Ouput:
```json
{
  "data": {
    "confirmations": 1,
    "receipt": {
      "blockHash": "0x9b47f6130ffcfbbc4fe5f6c57f5d98c524d1cb0371c9859dc47603f9a1a1e0ee",
      "blockNumber": 30896414,
      "cumulativeGasUsed": 902212,
      "effectiveGasPrice": 10000000000,
      "from": "0x778e72b05320a00cd014cd7ab842be866022634b",
      "gasUsed": 21664,
      "logs": [],
      "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      "status": 1,
      "to": "0xc969d4d09d431cf43861701eb0c0bdd15c838ecb",
      "transactionHash": "0x57e1c2838bc8b674590913058c092c56f82d2461ea7a2df187f70a6535d6ea4d",
      "transactionIndex": 7,
      "type": 0
    }
  }
}
```

Console log:
```
Transaction is sending
Transaction was sent
Transaction hash received
Receipt received
Transaction is confirmed
```


Thanks.