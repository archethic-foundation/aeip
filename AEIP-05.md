---
AEIP: 5
Title: Programmable / Smart UTXOs (Hooks)
Author: Samuel Manzanera <samuel@uniris.io>
Type: Standard Track
Category: AERC
Status: Stagnant
Created: 2022-12-15
---

# Abstract

UTXO (Unspent Transaction Output) is defined as input from other transaction, which is spendable when a new transaction is submitted.

In some protocol like Bitcoin, Cardano, they are giving the capability to define spendable condition. So when someone wants to spend its UTXO, the network will assert the condition is respected.

The initial design of Archethic was to allow the use of some kind of condition when a UCO is transferred.
We also thought to extend it to any assets like tokens.

While this approach is still relevant and useful in terms of P2P transfers, it does not make it really smart.

Current solution in the Blockchain ecosystem achieves a more programmatic input usage with smart contract.
This approach is working, but has some major flaws.
For instance, smart contract usually does not involve UTXO model. So there is not such thing as transfer of programmed assets. A smart contract is often seen as a source of truth and some kind of data storage to hold and process state.
The lack of using UTXO make less transparent, less decentralized, less scalable and less stateless.
Moreover, even if each transaction can contain code (like in Ethereum) to create post actions to a transaction or multi actions for a transaction starts to be complex, as it will require smart contract for a given task or complex transaction low-level encoding.

To tackle this, Archethic can provide smart UTXO which can benefit in many aspects.
Being able to create a programmable money or asset is a key feature for network scalability, extensibility and decentralization.

# Specification

The concept is the following one:

- Archethic leverages UTXO to transfer assets (no need to execute code to transfer, less fees, better scalability)
- Each recipient remains the real owner of the transferred asset (no central smart contract defining the allocations)
- Each UTXO can contain some code to execute

  - To define spendable condition (like in Bitcoin) - for UCOs & Tokens
  - To define actions to perform once this UTXO is consumed. We can see it as post UTXO condition (aka hooks). Here it is the innovation - only for tokens

## Example

We can take the example of Cashback mechanism. Imagine a custom token (like NFT) and the creator decides each time the token is transferred, (can be seen as a sell) a flat fee will be sent to the creator as royalty, Cashback, …
So, when the creator will transfer the token, it will include some condition.

```jsonc
{
  //transaction
  "data": {
    "token": {
      "transfers": [
        {
          "to": "0x......",
          "amount": 1,
          "token": "0x123456",
          "hook": "add_uco_transfer(to: 075849....., amount: 0.05)"
        }
      ]
    }
  }
}
```

The recipient will receive the UTXO with its condition:

```jsonc
//UTXO of the recipient
[
  // UTXO received from the NFT creator
  {
    "from": "....",
    "amount": 1,
    "type": "token",
    "token": "0021ffe03fab2910ce3910",
    "hook": "add_uco_transfer(to: 0x75849, amount: 0.05)"
  },
  // Previous UTXO for its UCO balance
  { "from": "...", "amount": "XXX", "type": "UCO" }
]
```

Once a recipient will transfer this asset, the network will execute some actions during the transaction validation, and send the royalties to the creator, while consuming this UTXO. The validation nodes will make the necessary by checking the code in each UTXO to update the validation stamp and the movements to resolve.

```jsonc
{
  //validationStamp
  "ledger_operations": {
    "transaction_movements": [
      { "to": "...", "amount": 1, "type": "NFT", "nft_address": "0x123456" },
      { "to": "075849", "amount": 0.05, "type": "UCO" }
    ],
    "unspent_outputs": []
  }
}
```

By this way, everything stay simple of usage, less expensive, scalable and really programmable and smart, without including too much centralization, performance and scalability overhead.

## Language support

We cannot use directly the smart contract interpreter as it is because we will not handle conditions and triggers in the hook. (the UTXO being already the trigger)
Nevertheless, we may use functions available in the interpreter, such as :

- transaction statements helping to mutate the transaction movements of the transaction
- Utilities for general purpose computation (crypto, JSON, lists, ...etc..)
