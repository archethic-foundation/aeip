---
AEIP: 18
Title: Increase AEIP-2 token supply
Author: Julien Leclerc <julien.leclerc05@protonmail.com>
Type: Standard Track
Category: Standard Track
Require: AEIP-2, AEIP-8
Status: Review
Created: 2023-06-29
---

## Abstract

Tokens on Archethic are identified by a `token_address` which is the transaction address that minted this token, and a `token_id` which permit to identify the token within a collection.  
These two informations are used in the type of an UTXO, this means that every UTXO with a different `token_address` or `token_id` cannot be consolided and are considered as differents tokens.

But there is some use cases where a token does not have a fixed supply and can be minted over time according to some criterias. Currently this is not possible to have this kind of token on Archethic since they will be minted in differents transactions, and so the UTXO will have a different `token_address`.

This AEIP introduce a new standard to mint a token by referencing an already existing `token_address`. The new minted tokens will then have the same properties as the referenced token, and the `token_address` used in UTXO will be the referenced one.

As it, the `token_address` of an token UTXO will remain the same even if it hasn't been minted in the same transaction.

## Specification

To allow users to increase the supply of an existing token, a new token transaction format allows to reference an existing token transaction address.  
The referenced token has to allow to be minted in future transaction.

### Conditions

The referenced token address must follow the specification of [AEIP-2](https://github.com/archethic-foundation/aeip/blob/main/AEIP-02.md), you cannot reference a transaction which is not a token transaction or which is a token transaction that also reference another token.

The referenced token must be a fungible token (`type: "fungible"`) since a non fungible token must be uniq.

The referenced address must be in the same chain than the transaction that references it. This protect a token to be minted by any other chain than the token chain itself.

The referenced token must have the new property `allow_mint` at true to be referenced. This allow the possibility for a token to have a fixed supply defined by its first mint.

### New token transaction format

#### Referencing another token

A new format in transaction content can be used:

```json
{
  "aeip": [8, 18],
  "supply": 1000,
  "token_reference": "0000C13373C96538B468CCDAB8F95FDC3744EBFA2CD36A81C3791B2A205705D9C3A2"
}
```

`aeip` is the list of supported AEIPs defined by [AEIP-8](https://github.com/archethic-foundation/aeip/blob/main/AEIP-08.md)  
`supply` is the number of token to mint, same as defined by [AEIP-2](https://github.com/archethic-foundation/aeip/blob/main/AEIP-02.md)  
`token_reference` is the address of a token transaction following [AEIP-2](https://github.com/archethic-foundation/aeip/blob/main/AEIP-02.md) specification

As for [AEIP-2](https://github.com/archethic-foundation/aeip/blob/main/AEIP-02.md) the transaction type has to be "TOKEN"

#### Allowing a token to be referenced

A new format in transaction content can be used. This format follows the same rules as [AEIP-2](https://github.com/archethic-foundation/aeip/blob/main/AEIP-02.md) and adds a new property `allow_mint`:

```json
{
  "aeip": [2, 8, 18],
  "supply": 100000000,
  "type": "fungible",
  "name": "My token",
  "symbol": "MTK",
  "allow_mint": true,
  "properties": {}
}
```

`allow_mint` is a boolean (true / false), this field is required.

This new property is allowed only for fungible token (`type: "fungible"`), since a non fungible token cannot be referenced

### Node Validation process

A new behavior for the nodes need to be implemented. Currently when a token transaction is validated, the `token_address` of the produced UTXO is the one of the validated transaction.  
With this AEIP, if the token specification is a reference, the `token_address` of the produced UTXO will be the referenced address on the specification.

Nodes will also implement the verification described in in **Conditions** part

### Backward compatibility

Since the default value of the new property `allow_mint` is false, existing token cannot have their supply increased as it wasn't possible before.

Definition of Mining UCO Reward (MUCO) will be updated to reference the first `mint_reward` transaction of the reward chain.  
Existing MUCO token with a different address than the first one will still be considered as real MUCO (based on their genesis_address being the same as the first `mint_reward` transaction).  
These MUCO tokens with a different address will disappear in time as they will be consumed by miners.
