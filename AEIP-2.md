---
AEIP: 2
Title: Token standard
Author: Samuel Manzanera <samuel@uniris.io>
Type: Standard Track
Category: AERC
Status: Draft
Created: 2022-05-23
---

# Abstract

The following standard defines the specification for tokens creation and usage in the Archethic network. 
This specification will define how non-fungible and fungible tokens can be standardized through a unified transaction encoding.

This standard provides the reason and the need of those tokens and also the way to implement and interact with.

# Specification

Archethic relies on UTXO (Unspent Transaction Output) model where a balance is determined by the sum of the amount from the inputs.

Hence Archethic's tokens leverages the same idea to provide fast and cheap asset creation and transfer: a token is just an entry in the UTXO of a given transaction address.

Because we are not leveraging smart contract but pure P2P transfers, the cost of the transaction is really cheap like to send native tokens (UCO).

## Creation

Archethic's transaction model is built with the capability to handle several kind of use cases by its own nature with many components: ledger operations, content hosting, code execution, encryption and autorisations.

So in order to create a new token, we should:
- Set the type of the transaction to: "TOKEN"
- Insert the properties of the token in the transaction data content section (free zone) in a the following format:
```jsonc
{
   "supply": NB_OF_TOKEN_TO_CREATE,
   "name": "NAME OF MY TOKEN",
   "properties": {
    [
      {
         "name": "image",
         "value": "BASE64 OF THE IMAGE"
      },
      // ...
    ]
  }
}
```

The `type` will say to the validation nodes to mint the number of tokens given in the `supply` attribute, by creating new UTXO for the next transaction of the chain. Because we can rely on specific functional type, nodes can apply custom behavior during the transaction validation.

The `supply` allows to mint one (Non Fungible use case)  or many tokens at once (Token use case)

The `name` helps client application to show the token name to be more user-friendly.
This will not impact the validation node behavior during the transaction validation.

We also add a set of abritrary properties than a asset can have encoded in a list of object.
For instance an Non Fungible Token could have set of properties describing the image source (either base64 encoding or external link) as well as other properties to identify the asset.

Once created, the transaction will have some UTXOs according to the `supply` attribute.

Also we are adding support collections for a single token with respect of the UTXO model.
To achieve this, the `properties` attribute will be used, to determine the number of distinct UTXO we want to create.

For example, if we want to create a collection of 3 tokens, which should be unique and transferable seperatly, we can encode the transaction content in that way:
```json
{
   "supply": 3,
   "name": "My NFT",
   "properties": {
     [
       { "name": "image", "value": "link of the 1st NFT image"},
     ],
     [
       { "name": "image", "value": "link of the 2nd NFT image"},
     ],
     [
       { "name": "image", "value": "link of the 3rd NFT image"},
     ]
   }
} 
```

During transaction validation, the miner will create the following UTXOs:
```json
[
   { "type": "NFT", "address": "address of the transaction", "id": 0 }
   { "type": "NFT", "address": "address of the transaction", "id": 1 }
   { "type": "NFT", "address": "address of the transaction", "id": 2 }
]
```

So in order to transfer the 2nd, we could specify in the transaction ledger operations to spend the asset from the UTXO's id: 1


## Transfer

Because we are not leveraging smart contract for asset transfer, it becomes native to the protocol.
Hence a simple ledger operations as UCO transfer will allow to transfer non native tokens.

```json
{
   "data": {
     "ledger": {
       "uco": {},
       "nft": {
         "transfers": [
           { 
             "to": "address of the recipient", 
             "from": "address of the nft", 
             "id": "utxo id", 
             "amount": 1
           }
         ]
       }
     }
   }  
}
```
