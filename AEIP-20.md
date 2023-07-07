---
AEIP: 20
Title: Smart Contracts - Fetch
Author: Bastien Chamagne <bastien@archethic.net>
Type: Standard Track
Category: AERC
Require: none
Status: Review
Created: 2023-07-06
---

## Abstract
This AEIP defines new functions available in the Smart Contract Library that developers may use to fetch web services. For technical reasons, these functions must only be used to read data. 

## Motivation
A Smart Contract may require to fetch off-chain data to do some work. For example the Archethic Bridge might use this to ensure a smart contract on an other blockchain is created. Some contracts could query the weather and act on it. The use cases are infinite.

## Specification
A new module `Http` is added to the Smart Contract Library. In this module there would be two functions defined: `fetch/1` and `fetch_many/1` which send one (or multiple) GET request(s) to the URL(s) provided.

This module is not accessible on the `condition` blocks.

For performance and security reasons we impose a set of rules:
- Only GET requests.
- No request body nor headers.
- Response `Content-Length` is limited to 256 KB.
- The endpoint must be HTTPS.
- The endpoint must be [idempotent](https://en.wikipedia.org/wiki/Idempotence)(because it will be called hundreds of times for validation purposes).
- The endpoint must reply quickly (a very strict timeout is hardcoded).

### Example: fetch
```elixir
response = Http.fetch("https://fakerapi.it/api/v1/addresses?_quantity=1&_seed=watermelon")
if response.status == 200 do 
  api_result = Json.parse(response.body)
  first_address = List.at(api_result.data, 0)
  [...]
end
```

### Example: fetch_many
```elixir
responses = Http.fetch_many([
  "https://fakerapi.it/api/v1/users?_quantity=1&_gender=male&_seed=cucumber",
  "https://fakerapi.it/api/v1/users?_quantity=1&_gender=female&_seed=tomato"
])

users = []
for response in responses do 
  if response.status == 200 do 
    api_result = Json.parse(response.body)
    for user in api_result.data do 
	    List.prepend(users, user)
    end
  end
end
[...]
```
  


