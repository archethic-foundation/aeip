---
AEIP: 2
Title: Token standard
Author: Samuel Manzanera <samuel@uniris.io>
Type: Standard Track
Category: AERC
Status: Review
Created: 2022-05-23
---

# Abstract

The following standard defines the specification for tokens creation and usage in the Archethic network. 
This specification will define how non-fungible and fungible tokens can be standardized through a unified transaction encoding.

This standard provides the reason and the need of those tokens, and also the way to implement and interact with.

# Specification

Archethic relies on UTXO (Unspent Transaction Output) model where the sum of the amount from the inputs determines the balance.

Hence, Archethic's tokens leverages the same idea to provide fast and cheap asset creation and transfer: a token is just an entry in the UTXO of a given transaction address.

Because we are not leveraging smart contract but pure P2P transfers, the cost of the transaction is really low, like to send native tokens (UCO).

## Creation

Archethic's transaction model is able to handle several kinds of use cases by its own nature with many components: ledger operations, content hosting, code execution, encryption, and authorizations.

So in order to create a new token, we should:
- Set transaction's type to: "TOKEN"
- Insert the metadata of the token in the transaction data content section (free zone) in the following format:
```jsonc
{
   "supply": NB_OF_TOKEN_TO_CREATE,
   "name": "NAME OF MY TOKEN",
   "symbol": "MNFT",
   "type": "fungible",
   "properties": [
     // ...
   ]
}
```

Because we can rely on specific functional type, nodes can apply custom behavior during the transaction validation to mint the number of tokens given in the `supply` attribute, by creating new UTXO for the next transaction of the chain. 

### Token metadata

- `supply`: give information to nodes to mint one or multiple tokens at once

- `name`: help client application to display the token name to be more user-friendly.
This will not impact the behaviour of the validation nodes during the transaction validation.

- `symbol`: specify the token symbol. This will not impact the behaviour of the validation nodes during the transaction validation.

- `type`: helps application to distinguish fungible and non-fungible tokens, but also inform the nodes which validation or mining behavior need to applied. ([See collection use case](#collection))  

- `properties`: allows a token to define a set of arbitrary properties that an asset can have encoded in a list of objects.

### Properties metadata

Two attributes compose each property:
  - `name`: represents the property's name, which helps applications to find the right value they need
  - `value`: represents the property's value

Example of token with properties:
```json
{
   "supply": 2,
   "type": "non-fungible",
   "name": "My NFT",
   "symbol": "MNFT",
   "properties": [
     [
       {
         "name": "image",
         "value": "base64 of the image"
       }
     ]
   ]
}
```

For instance, a NFT could have a set of properties describing the image source (either base64 encoding or external link) as well as other properties to identify the asset.


Array of object define the properties, so we can extend it later with the addition of new attribute being backward compatible.

### Collection

There are some use cases with NFT when we want to create tokens with different properties, usually called "collection".
Using a specific token type, we can control how the token will be minted according to the given properties.

#### Creation

In that sense, the `properties` and `supply` can be checked to ensure the right number of distinct UTXO we want to create.

To achieve this, the `properties` attribute will be used, to determine the number of distinct UTXO we want to create.

Each property list, will produce several UTXO with their own ID, to give unique properties to a collection item.

For example, if we want to create a collection of 3 tokens, which should be unique and transferable separately, we can encode the transaction content in that way:
```json
{
   "supply": 3,
   "name": "My NFT",
   "type": "non-fungible",
   "symbol": "MNFT",
   "properties": [
     [
       { "name": "image", "value": "link of the 1st NFT image"},
     ],
     [
       { "name": "image", "value": "link of the 2nd NFT image"},
     ],
     [
       { "name": "image", "value": "link of the 3rd NFT image"},
     ]
   ]
} 
```

During transaction validation, the miner will create the following UTXOs:
```json
[
   { "type": "token", "address": "address of the transaction", "id": 0 }
   { "type": "token", "address": "address of the transaction", "id": 1 }
   { "type": "token", "address": "address of the transaction", "id": 2 }
]
```

The token ID for a collection will be determined by its position in the list starting from 0 to n, 0 being the first element in the collection of properties.

So in order to transfer the 2nd, we could specify in the transaction ledger operations to spend the asset from the UTXO's ID: 1

#### Token's ID association

But in some case, developers may want to specify a given ID to a token could do it by using a specific attribute `id`.

For example, a collection with 2 tokens which pre-determined ID encoded in that way:
```json
{
   "supply": 2,
   "name": "My NFT",
   "type": "non-fungible",
   "symbol": "MNFT",
   "properties": [
     [
        { "name": "id", "value": 42}
     ],
     [
        { "name": "id", "value": 2022}
     ]
   ]
}
```

will create two UTXO with a specific ID:
```json
[
   { "type": "token", "address": "address of the transaction", "id": 42 }
   { "type": "token", "address": "address of the transaction", "id": 2022 }
]
```

Note: **this ID specification makes only sense for NFT use cases, fungible tokens don't make distinct information regarding tokens. Hence, this behavior during the transaction validation can be matched regarding the type of token to create**. 


## Transfer

Because we are not leveraging smart contract for asset transfer, it becomes native to the protocol.
So, a simple ledger operation as UCO transfer allows transferring non-native tokens.

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
             "id": "UTXO's ID", 
             "amount": 1
           }
         ]
       }
     }
   }  
}
```
