---
AEIP: 17
Title: Smart Contract Functions
Author: Samuel Manzanera <samuelmanzanera@protonmail.com>
Status: Final
Type: Standard Track
Category: Core/Interface
Created: 2023-06-29
---

## Abstract

Archethic leverages a new smart contract language designed to be simple to use through a specification and domain specific language based on actions, triggers and conditions.

All the logic is located within the actions block however as developer we wish to split our logic into smaller chunk of code to ease the understanding and maintability.
In addition, smart contract are executing from a trigger (transaction, oracle, date/time) but we wish to expose readonly code to be queried by applications to have a quick and easy access of a dApps state for example.

This specification aims to introduce functions into the smart contract's language to enhance the productivity of dApps developers.

## Specification

The idea is to introduce a new whitelisted AST into the contract's parser to accept the keyword: `fun`.

### Definition

This AST would have to be a block to support the following syntax:

```elixir
fun hello do
  # Do or return something
end
```

The AST should accept function with 0 or N arity to accept parameters.

```elixir
fun hello(param1, param2) do
  # Do or return something
end
```

Any information or variable within a function will remain in the local of scope of this function, unless it's mutating the state of the contract or emit a transaction.

### Visibility

By default function have implicit **internal** visibility.

To support the exposal of certain function we can annotate any function with the keyword: `export`.
The previous example can be transformed as :

```elixir
export fun hello do
  # Return something
end
```

When a function is marked as **external** it cannot mutate state or create transaction and behaves as a **view** function.
They may or not be pure by accessing or not the contract's information.

So, by definition those function can only return values.

To scope of the external function should limited to:

- State's readonly access (require [AEIP14](/AEIP-14.md))
- Library functions which doesn't involve any I/O (ie. network requests should be prohibed)
- For Loops should be limited to certain range or complexity.

A default allowed complexity has to be defined to be consumed on each instruction (aka gas) limiting the execution of the external functions.

### API

To ease the exposure of services and the usuabilty, we transform our REST API in to JSON-RPC which will serve more the purpose of our HTTP API oriented actions vs resources.

So methods about contract exposure could be available as JSON RPC including the Contract Function Args (CFA) request

```
   // With 0 arity:
   POST /api/rpc
   {
     "jsonrpc": "2.0",
     "method": "contract_fun",
     "params": {
        "contract": "addressContract",
        "function": "functionName"
     },
     "id": 1
   }

   // With N arity
   POST /api/rpc
   {
      "jsonrpc": "2.0",
      "method": "contract_fun",
       "params": {
          "contract": "addressContract",
          "function": "functionName",
          "args": [1, "hello", true]
       },
      "id": 1
   }
```

Response could be returned in that shape:

```
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
     "state": "..."
  }
}
```
