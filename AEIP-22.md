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

While this feature is good for automation, we also wanted to restrict the capability of a node to do anything with your chain's key.
Hence, we introduced the concept of inherit constraints. Those terms ensure your chain respect some rules according to the deployed smart contract code.

However, sometimes, as a smart contract owner, we want to bypass those rules of change limitation, to enhance the contract bringing new features or resolving problems or issues.

But we can't use the chain's key anymore, because the key is also shared among the nodes to support automation of transactions by self-triggers.
So we wanted to provide a way to be able to prove ownership but also extend it by explictness to support or not upgrades.

This AEIP aims propose a way to achieve it by creating a standard.

# Specification

To support code's update, we propose to create a well-defined named actions (specific function called by transaction): `code_update(new_code)` with a condition to accept the transaction to mutate to the smart contract code.

```elixir
condition triggered_by: transaction, on: code_update(new_code), as: [
   previous_public_key: (
       previous_address = Chain.get_previous_address(transaction.previous_public_key)
       # We check if the chain's origin of this code update transaction is the one authorized
       Chain.get_genesis_address(previous_address) == 0x.........
   )
]

actions triggered_by: transaction, on: code_update(new_code) do
   Contract.set_code(new_code)
end
```

We can notice than we use a single chain to condition to assert the origin of the transaction. 
This could be a master account like in a DAO system or any multisignature contract.

## Enforce explicitness through parsing

Because smart contract upgradability is native and should be explicit, we have to enforce this rule by default.

This means, we would have to adapt the transactions validation and particulary in the interpreter's parsing phase to ensure the action `code_update` is set.

The interpreter should also prevent to have an empty condition to avoid some security issue, because anyone could upgrade any smart contract code.
```elixir
# DO NOT !
condition triggered_by: transaction, on: code_update(), do: []
actions triggered_by: transaction, on: code_update(new_code) do
   Contract.set_code(new_code)
end
```

## Validation

When the owner of the contract would like to update the code, the user would have to send a transaction with the named action `code_update`.

The nodes will assert whether the new code is valid and check the smart contract `condition` based on the incoming transaction.

Hence the new code will be integrated and a new transaction on the chain will be submitted.
