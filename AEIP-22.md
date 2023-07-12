---
AEIP: 22
Title: Smart Contract upgradability
Author: Samuel Manzanera <samuelmanzanera@protonmail.com>
Type: Standard Track
Category: AERC
Status: Review
Created: 2023-07-12
---

# Abstract

Since the inception of the Archethic's network, we plan & design smart contract to support native upgradability being modifiable.

Because Archethic relies on TransactionChains, upgrades are made easy without the need of data or fund migration.

This archethicture helps to reduce the complexity to manage modifiable contracts as there is on other protocols such as Ethereum

Considering native doesn't mean transparent, we wanted to make the upgradability or the non-upgradability explicit by the smart contract owner/deployer.

Therefore, Archethic's smart contract can be autonomous providing a set of features to self-triggers such as datetime/time interval/oracle events to produce new transactions.

Combining those features and the principle of transaction chains to evolve keys for each transactions with the UTXO model, Smart Contract have to delegate the chain's key 
to allows validators/miners to build transaction in your behalf.

While this feature is good to automation, we also wanted to restrict the capability of a node to anything with your chain's key.
Hence, we introduced the concept of inherit constraints. Those terms ensure your chain respect some rules according to the deployed smart contract code.

However, sometimes, as a smart contract owner, we want to bypass those rules of change limitation, to enhance the contract bringing new features or resolving problems or issues.

But we can't use the chain's key anymore, because the key is also shared among the nodes to support automation of transactions by self-triggers.
So we wanted to provide a way to be able to proove ownership but also extend it by explictness to support or not upgrades.

This AEIP aims propose a way to achieve it.

# Specification

## Smart Contract's language

To support inherit constraints exception, meaning bypass the rules to protect of chains from unexpeected changes, we should integrate a new concept in the interpreter's language.

The proposal is to include a set of fields in the `condition inherit` block to mention the exception the rules to bypass inherit contraints.
Two fields could be integrated:
- `exception`: any arbitrary code which can describe if we can upgrade or not the contract. This could should return true/false. For example, if could be a set of code to make
sure the current transaction on the chain respect to some cryptographic rules.
- `exception_key`: which is an abstraction of the previous fields or a shortened condition, to be more implicit but simple to write. The idea would be to check
if the transaction's content contains a signature with the new code validated by the mentioned public key

```elixir
condition inherit: [
   # An explicit code to allow bypass of the inherit conditions
   exception: Crypto.verify?(transaction.content, contract.code, 0x0e312ff....)

   # Or a shorter way where the verification will be implicit
   exception_key: 0x0e312ff....
]
```

Before we mentioned about explicitness, this means we could turn-off the inherit contraints condition exception to no support at all upgrades by the chain owner or use others means to do so.

For instance, we might decide to use an external transaction to support upgrade, like in a DAO system.

```elixir
condition inherit: [
    exception: false # We disabed the chain's owner to upgrade the smart contract
]

condition triggered_by: transaction, on: upgrade, as: [
   previous_public_key: Chain.get_genesis_public_key() == 0x12345 # DAO public key
]

actions triggered_by: transaction, on: upgrade do
    Contract.set_code(transation.content)
end
```

## Enforce explicitness through parsing

Because smart contract upgradability is native and should be explicit, we have to enforce this rule by default.

This means, we would have to adapt the transactions validation and particulary in the interpreter's parsing phase to ensure the exception condition is set.

This would always give the capability of chain owner to evolve SC but in the same time it gives explicitness about non upgradability by the chain owner.

The interpreter should also prevent the condition to be set as `true` creating some security issue, because anyone could upgrade any smart contract code.
```elixir
# DO NOT !
condition inherit: [
    exception: true
]
```

## Inherit condition exception validation

When the owner of the contract would like to bypass inherit constraints to update the code, the user would have to send the new smart contract code as a new transaction in the chain.

This transaction should include the signature of the contract using the ownership's key encoded in the content.

The nodes would have to check if the inherit's condition is defined and if the execution of the condition returns true.
This operation will check the `exception_key` or `exception` instruction.

If the `exception` is set to false, the validation nodes will fallback to the traditional inherit conditions expectation based on the previous smart contract code allowing or not upgrade.

## Key Authorization

For SDKs and Clients, we should propose a way to make this explicit declaration easier while being able to maintain a security of the keys.

So, once a new smart contract will be created - meaning a transaction with a code embedded - the SDK/Client should propose to add a new random secret with a list of authorized public keys.

This will add the inherit constraint with the proof of ownership verification defined as: `exception_key`.

By leveraging the ownerships and authorized keys, we can update the list of authorized keys able to handle the exception.

But this also means, for each upgrades a new random generated key will be used to prevent previous authorised users and now unauthorized users to leverage the upgradabiity of the contract.



