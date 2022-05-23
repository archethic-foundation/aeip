---
AEIP: 2
Title: Token standard
Author: Samuel Manzanera <samuel@uniris.io>
Type: Informational
Category: ARC
Status: Draft
Created: 2022-05-23
---

# Abstract

The following standard defines the specification for the non-native tokens on the Archethic network (also called "NFT" -> Non Financial Transaction)

This standard provides the reason and the need of those tokens and also the way to implement and interact with.

# Motivations

Non financial transactions are huge part of the transactions today and was the humanity’s oldest way to exchange good and services. NFTs are units of value whose value exists only between a sender and a receiver.

- a neighbor is lending his drill agains one hour of gardening
- a country that organizes elections want to offer discount on public services to voters
- a town want to provide local money to maintain center town life and shops profitability
- they can be assimilated to ERC20 Tokens on Ethereum Blockchain
- or in the case of blockchain such as Archethic, each user who make the ecosystem live will be able to obtain vouchers to pay for miners or as a bonus for email storage and thus increase the volicity of the system.

# Specification

Archethic relies on UTXO (Unspent Output Transaction) model where a balance is determined by the sum of the amount from the inputs.
Hence Archethic's tokens leverages the same idea to provide fast and cheap asset creation and transfer: a token is just an entry in the UTXO of a given transaction address.
Because we are not leveraging smart contract but pure P2P transfers, the cost of the transaction is really cheap as it's to send native tokens (UCO).

## Creation

Archethic's transaction model is built with the capability to handle several kind of use cases by its own nature with many components: ledger operations, content hosting, code execution, encryption and autorisations.

So in order to create a new token, we should:
- Set the type of the transaction to: "NFT"
- Insert the properties of the token in the transaction data content section (free zone) in a the following format:
```json
{
   supply: NB_OF_TOKEN_TO_CREATE,
   name: "NAME OF MY TOKEN",
   properties: {
    [
      {
         "name": "image",
         "value": "BASE64 OF THE IMAGE"
      },
      ...
    ]
  }
}
```

The `type` will say to the validation nodes to mint the number of tokens given in the `supply` attribute, by creating new UTXO for the next transaction of the chain. Because we can rely on specific functional type, nodes can apply custom behavior during the transaction validation.

The `supply` allows to mint one (Non Fungible Token use case)  or many tokens at once (ERC like use case)

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
   supply: 3,
   name: "My NFT",
   properties: {
     [
       { name: "image", value: "link of the 1st NFT image"},
       ...
     ],
     [
       { name: "image", value: "link of the 2nd NFT image"},
       ...
     ],
     [
       { name: "image", value: "link of the 3rd NFT image"},
       ...
     ]
   }
} 
```

During transaction validations, the miner will create the following UTXOs:
```json
[
   { type: "NFT", address: "address of the transaction", id: 0 }
   { type: "NFT", address: "address of the transaction", id: 1 }
   { type: "NFT", address: "address of the transaction", id: 2 }
]
```

So in order to transfer the 2nd, we could specify in the transaction ledger operations to spend the asset from the UTXO's id: 1


## Transfer

Because we are not leveraging smart contract for asset transfer, it becomes native to the protocol.
Hence a simple ledger operations as UCO transfer will allow to transfer non native tokens.

```json
{
   data: {
     ledger: {
       uco: {},
       nft: {
         transfers: [
           { to: "address of the recipient", from: "address of the nft", id: "utxo id", amount: 1 }
         ]
       }
     }
   }  
}
```
