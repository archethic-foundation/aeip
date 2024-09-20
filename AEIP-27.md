---
AEIP: 27
Title: WebAssembly support for smart contracts
Author: Samuel Manzanera <samuelmanzanera@protonmail.com>
Type: Standard Track
Category: Core
Status: Draft
Created: 2024-09-20
---

# Abstract

One of the Archethic’s promise was to rethink and change the way blockchains are using smart contracts by preventing blind execution of code to avoid some known flaws in the blockchain ecosystem.

In that sense, interpreter based smart contract was developed through a custom language (domain specific language) tailored for the purpose of Archethic transactions.
Through that, the miners were able to interpreter step by step execution to avoid blind execution, while making it easy for auditors to check the smart contract’s code.

While the philosophy was great, after few times and feedbacks this approach struggles particularly for the developer’s adoption, performances, and we sometimes reach some limitations due to the early stage of this custom language.
Indeed, by bringing new language, the developers would have to learn new ways of coding, a learning curve is required and as the language is new there are some things not present and the habits of developers might be touched and create frustrations and limitations.

To tackle this problem, we sought a new approach to embrace better developer adoption, better performances, and reduce limitations of a brand-new language.
Here came the idea of WebAssembly.

WebAssembly is a stack based virtual machine designed to be 
- portable: many languages can compile into it. No need to reinvent the wheel in terms of language and developer tooling
- safe: execution is memory-safe and sandboxed environment. 
- fast: near of the native speed of execution and efficient in terms of size and loading time
- standardized: part of the W3C Community Group

Archethic coupled to WebAssembly should thrive developer adoption, better and efficient smart contracts while ensure good safety, possibility of interpretation due to the stack based virtual machine capability and be compatible with many stacks.

So in this document, you will see the different aspect of how WebAssembly should be integrated into Archethic’s network and which conventions should be defined to be adapted.

# Specification

## Manifest

One major difference with WebAssembly based smart contract is the code is not publically and automatically discoverable due to the compilation phase of languages.

The blockchain is not able to discover easily the function used for transaction and their dedicated trigger type or read only functions.

So we need to provide a specification of the contract.

The manifest is described as a JSON document listing the triggers, the public functions, the input and output types, the type of the state and optional upgrade options.

```jsonc
{
  "abi": {
    "state": {
      "counter": "i32"
    },
    "functions": {
      "increment": {
        "type": "action",
        "triggerType": "transaction",
        "input": {
          "value": "u32"
        }
      },
      "getFactorial": {
        "type": "publicFunction",
        "input": {
          "from": "u64"
        },
        "output": "u64"
      }
    }
  },
  "upgradeOpts": {
     "from": "000………." // Address allowed to upgrade the contract
  } 
}
```

With this manifest, blockchain would be able to type check the input, inform the user and dApps about output and state types, but also enable the upgrability of contract without having to execute code.

## Hook functions

WebAssembly smart contract can define any kind of custom functions for transaction and public calls.
But we want to extend it to custom hooks to simplify the developer experience to automate some actions in specific period.

Previously, the initialization phase of a contract or migration phase for a new contract was a bit complicated. With a system of hooks, this is made easier. Several kind of functions are then reserved for this purpose: `onInit`, `onUpgrade`, `onInherit`

- `onInit`: 

    This function must be called during the transaction’s validation and for the first contract of the chain.
    This behaves as a constructor or initializer of the contract’s state, which will be injected into the transaction’s validation as unspent output.
    

- `onUpgrade`: 

    As Archethic’s upgrade must be native, a specific and native trigger is supported as `code_upgrade` to correspond to the [AEIP-22 - Smart Contract upgradability spec](./AEIP-22.md) and will replace the new code of the code.
  
    This hook function must then be called during the execution of this `code_upgrade` function to generate the new state to be injected into the transaction’s validation as new unspent output.
  
    The previous state is injected into the function but using the new code to act as migration code for the contract’s state.

- `onInherit`:  

    This function mimics the former behavior of inherit constraints as a way to assert some conditions along the chain’s inheritance (i.e. origin family devices, hard-coded rules, etc.).

    It must be called during transaction’s validation to ensure inherit conditions.
  
    No return is expected, it should assert or throw on user’s defined conditions.


## Types

Because of the nature of WebAssembly being sandboxed and agnostic, we should leverage a standardized way to communicate between the blockchain (host) and the web assembly module (guest) for example JSON.
Hence, all the input or output must then be JSON compatible.
- Transaction’s triggers (actions) must return a JSON object containing a potential new transaction and/or the new state.
- Read-only functions (public functions) can return any JSON type (complex object, arrays or primitive data)

Because blockchains involve cryptography we often have to deal with binary and because binary is not JSON compatible we should encapsulate and wrap to serve multiple implementations of how binary is handled.
So a binary can be wrapped into an object serving different representations.

For example, an address, can be encoded as: `{ "hex": "0000…….." }`for WebAssembly module supporting only JSON but blockchain nodes can then transmit data on the wire on pure binary and response to the client request as JSON back using the hexadecimal representation.

However, if some WebAssembly sdk would be able to leverage a binary exchange, the node would be able to communicate with the contract in binary as long as the blockchain and WebAssembly are talking the same protocol.

Another important aspect regarding types is about safety and determinism of execution. 
Hence, we should not use decimals in smart contracts because of the problems relating to the floating point approximation, particularly in some arithmetic computations.
The blockchain should then reject smart contracts using decimals numbers.
