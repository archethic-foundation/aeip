---
AEIP: 16
Title: Smart Contract Named Actions
Authors: Samuel Manzanera <samuelmanzanera@protonmail.com>, Julien Leclerc <julien.leclerc05@protonmail.com>, Bastien Chamagne <bastien@archethic.net>
Status: Review
Type: Standard Track
Category: Core/Interface
Created: 2023-06-28
---

## Abstract

Archethic leverages a new smart contract language designed to be simple to use through a specification and domain specific language based on actions, triggers and conditions.

The actions are pieces of code which are executed from a specific trigger: 
- incoming transaction
- time interval
- datetime
- oracle update

Sometimes when we receive an incoming transaction we want to split the actions code logic into branches according to a context of execution, like a function.
Despite the fact it is possible for now, it makes the developers/user tasks complex requiring it to be implemented by parsing the content of the transaction and make actions block long to read and to write.

In this specification, the goal is propose an approach to help branching action blocks to ease the development and use of smart contract for dApps adoption.

This would work as what is called in functional programming,  "pattern matching".
The interpreter would make the branching by intercepting the function to call.

## Specification

### Smart Contract's langage 

The actions block of the smart contract would leverage a new parameter: `on` for the trigger transaction.

Here some examples:
```elixir
actions triggered_by: transaction, on: vote(candidate) do
  # Do something to insert the vote
end

actions triggered_by: transaction, on: maintain do
  # Do something to maintain the contract
end
```

This parameter will accept a function name as value to identify the action block to execute.

> The behavior should be backward compatible, meaning we can still use the straight trigger transaction without the `on` parameter.

If the function supports arity (any arguments), the arguments should be present in the `on` parameter.
Hence, the given variables will directly accessible by the action block in the scope.

This also means the variables bounded to the parameters should not be assignable, risking to loose the value passed from the incoming transaction. 

Once ingested, the validation node could delegate the function call to the interpreter which would execute the specific action block.

The validation node could also assert if the function is not present in the contract and therefore returns an error. 
This would simplify the smart contract code with not need to whitelist/blacklist the function to call in the condition transaction block.

The condition field will also be adpated to support named action branching.

```elixir
condition triggered_by: transaction, on: vote, as: [
  content: "hello"
]
```

> As for the actions, the parameters in the function arity would be accessible in the condition's block

To make the condition extendable by simple or advanced user, we propose to have capability to define expectation of condition with: `as` keyword or direct code returning a boolean to accept the transaction using `do` keyword.

```elixir
condition triggered_by: transaction, on: vote(x, y) do
   Regex.match?(x, ....) and Regex.match?(y, ....)
end
```
This notion of extension could also be applied to block actions to simplify flow

```elixir
actions triggered_by: transaction, on: upgrade, as: [
    code: transaction.content
]
```

### Transaction's structure

To be able to define the function to call, the transaction's structure should be adapted to support this new field.

To call a smart contract, we use the `recipients` section of the transaction's data.

So we would have to provide a new structure and new version:
```jsonc
//Before
{
   "version": 1,
   "data": {
      "recipients": ["01df....."]
   }  
}

//After
{
   "version": 2,
   "data": {
      "recipients": [{
         to: "01df.....", 
         action: "vote",
         parameters: ["Mr.X"]
      }]
   }  
}
```

> To be backward compatible we should accept the function arguments to be empty in order to support contracts which do not handle the function call.
