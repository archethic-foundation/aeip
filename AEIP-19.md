---
AEIP: 19
Title: Token minting's recipients
Author: Samuel Manzanera <samuelmanzanera@protonmail.com>
Type: Standard Track
Category: AERC
Require: AEIP-02, AEIP-08
Status: Review
Created: 2023-07-03
---

# Abstract

Since the [AEIP-02](/AEIP-02.md), we have the capability to mint tokens.
During the transaction validation, the miners will create and assign new UTXOs to this transaction, to be consumed later.

This AEIP aims to extend the minting scope to be able to send in the same time not only the transaction's UTXO but to other recipients.

Indeed, often dApps or token creators want to be able to mint and send at the same.

Without this approach we need to make two transactions:
- one to mint and get the UTXOS
- one to send/spend the tokens created

So this AEIP proposes a way to mitigate this problem.

# Specification

To support this capability, we would have to extend the JSON used in the token minting definition  used in `token` transaction's type.

## Definition

I propose to add a new field named  `recipients`, being a list of addresses and amount where the tokens will be send and will be the first targets to receive the tokens in automated-way.


```json
{
  "aeip": [2, 8, 19],
  "supply": 300000000, // Representing 3 tokens in BigInt
  "type": "fungible",
  "name": "My token",
  "symbol": "MTK",
  "properties": {},
  "recipients": [
    {
       "to": "0f1fd....",
       "amount": 100000000 // Representing 1 token in BigInt
    }
  ]
}
```

> This is an optional field, and by default this field would be an empty list.

## Minting

During the transaction validation, the miners will mint the tokens and create the following UTXOs as described in the [AEIP-02](/AEIP-02.md)

If the `recipients` field is not empty, the validation nodes would also create transaction movements and therefore reducing the supply in the created UTXOs.

For example with the previous token definition above, the validation nodes would create the following validation's stamp:
```jsonc
{
  "unspent_outputs": [
    {
      "from": "txAddress", // Being the address in validation
      "amount": "200000000", // Representing 2 tokens as BigInt
      "type": "token",
      "token_address": "txAddress"
    },
    ...
  ],
  "transaction_movements": [
    {
      "to": "0f1fd....",
      "amount": 100000000, // Representing 1 token as BigInt
      "type": "token",
      "token_address": "txAddress"
    }
  ]
}
```

## Fees

Nowadays, to mint tokens, a fee is applied based on the type and number of tokens to create according to the number of UTXO created.

But with this proposal, an additional fee would have to be integrated to charge
the sending of minted tokens like if you send funds in the transaction movements.

Hence, the fee will be about the mint + sending.

This additional fee is then seen as any other transfers - more recipients == more fees, then the cost would be logarithmic or exponential. This will be described after [Review of the fee calculation rule for multi recipients](https://github.com/archethic-foundation/archethic-node/issues/1041) released on the Archethic nodes.

### Backward compatibility

This specification is backward-compatible as it does not affect the former token definitions.

In order to support mint recipients, developers or creators would have to create new tokens or increase the tokens supply to support this feature.

