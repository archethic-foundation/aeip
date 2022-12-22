---
AEIP: 2
Title: Token standard
Author: Samuel Manzanera <samuel@uniris.io>
Type: Standard Track
Category: AERC
Status: Final
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
   "supply": NB_OF_TOKEN_TO_CREATE, // Must be in 10e6 format (defined by decimals attribute)
   "type": "fungible",
   "decimals": 6,
   "name": "NAME OF MY TOKEN",
   "symbol": "MTK",
   "properties": {
     // ...
   }
}
```

Because we can rely on specific functional type, nodes can apply custom behavior during the transaction validation to mint the number of tokens given in the `supply` attribute, by creating new UTXO for the next transaction of the chain. 

### Token metadata

- `supply`: (mandatory) give information to nodes to mint one or multiple tokens at once (the amount should be represented in the smallest unit of the token which is defined by `decimals` attribute (10<sup>-8</sup> by default)). Maximum supply value is 2<sup>64</sup> - 1
   
- `type`: (mandatory) helps application to distinguish `fungible` and `non-fungible tokens, but also inform the nodes which validation or mining behavior need to applied. ([See collection use case](#collection))
   
- `decimals`: number of decimal used to display the token (default and maximum is 8). This attribute have to be the default value for non-fungible token.

- `name`: help client application to display the token name to be more user-friendly.
This will not impact the behaviour of the validation nodes during the transaction validation.

- `symbol`: specify the token symbol. This will not impact the behaviour of the validation nodes during the transaction validation.

- `properties`: allows a token to define a set of arbitrary properties that an asset can have encoded in a list of objects.

### Properties metadata

`properties` attribute is an object having one or multiple properties.
 Each property is represented by a key -> value pair:
  - key is the property's name, which helps applications to find the right value they need
  - value is the property's information

Example of token with properties:
```jsonc
{
   "supply": 100000000, // Represent 1 in 10e8 representation
   "type": "non-fungible",
   "name": "My NFT",
   "symbol": "MNFT",
   "properties": {
      "image": "base64 of the image",
      "description": "This is a NFT with an image"
   }
}
```

Properties defined there are global and applied to all tokens minted.

### Collection

There are some use cases with NFT when we want to create tokens with different properties, usually called "collection".
Using a specific token type, we can control how the token will be minted according to the given properties.

#### Creation

The attribute `collection` is used to distinguish different properties for each NFT.
   
This attribute is an array of object which each object represent the properties for a specific NFT. (object have the same format than `properties` attribute)

In that sense, the `collection` and `supply` can be checked to ensure the right number of distinct UTXO we want to create. `supply` has to be the same value than the length of `collection` array.

Each collection object will produce a UTXO with its own ID, to give unique properties to a collection item.

For example, if we want to create a collection of 3 tokens, which should be unique and transferable separately, we can encode the transaction content in that way:
```jsonc
{
   "supply": 300000000, // Represents 3 tokens in 10e8
   "name": "My NFT",
   "type": "non-fungible",
   "symbol": "MNFT",
   "properties": {
      "description": "this property is for all NFT"
   },
   "collection": [
      { "image": "link of the 1st NFT image" },
      { "image": "link of the 2nd NFT image" },
      {
         "image": "link of the 3rd NFT image",
         "other_property": "other value"
      }
   ]
} 
```

During transaction validation, the miner will create the following UTXOs:
```json
[
   { "type": "token", "address": "address of the transaction", "id": 1 }
   { "type": "token", "address": "address of the transaction", "id": 2 }
   { "type": "token", "address": "address of the transaction", "id": 3 }
]
```

The token ID for a collection will be determined by its position in the list starting from 1 to n, 1 being the first element in the collection of properties.
The token ID 0 is reserved for fungible tokens.

So in order to transfer the 2nd, we could specify in the transaction ledger operations to spend the asset from the UTXO's ID: 2

#### Token's ID association

But in some case, developers may want to specify a given ID to a token could do it by using a specific attribute `id`.

For example, a collection with 2 tokens which pre-determined ID encoded in that way:
```jsonc
{
   "supply": 200000000, // Represents 2 in 10e8 
   "name": "My NFT",
   "type": "non-fungible",
   "symbol": "MNFT",
   "collection": [
      { "id": 42 },
      { "id": 2022 }
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

## Transfer

Because we are not leveraging smart contract for asset transfer, it becomes native to the protocol.
So, a simple ledger operation as UCO transfer allows transferring non-native tokens.

For non-fungible token, transfer amount can only be an integer.

```json
{
   "data": {
     "ledger": {
       "uco": {},
       "token": {
         "transfers": [
           { 
             "to": "address of the recipient", 
             "from": "address of the token", 
             "id": "UTXO's ID", 
             "amount": 1
           }
         ]
       }
     }
   }
}
```
