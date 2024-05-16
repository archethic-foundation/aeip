---
AEIP: 20
Title: Smart Contracts - Fetch
Author: Bastien Chamagne <bastien@archethic.net>
Type: Standard Track
Category: AERC
Require: none
Status: Final
Created: 2023-07-06
---

## Abstract

This AEIP defines new functions available in the Smart Contract Library that developers may use to fetch web services. For technical reasons, these functions must only be used to read data.

## Motivation

A Smart Contract may require to fetch off-chain data to do some work. For example the Archethic Bridge might use this to ensure a smart contract on an other blockchain is created. Some contracts could query the weather and act on it. The use cases are infinite.

## Specification

A new module `Http` is added to the Smart Contract Library. In this module there would be two functions defined: `fetch/1` and `fetch_many/1` which send one (or multiple) GET request(s) to the URL(s) provided.

This module is not accessible on the `condition` blocks.

### Http.fetch/1

Takes a URL, returns a map with 2 keys:

1. `status :: Integer`, the response's status. See the Status section below.
1. `body :: String`, the response's body. In the case of negative `status` it will be an empty string.

```elixir
response = Http.fetch("https://fakerapi.it/api/v1/addresses?_quantity=1&_seed=watermelon")
if response.status == 200 do
  api_result = Json.parse(response.body)
  first_address = List.at(api_result.data, 0)
  [...]
end
```

### Http.fetch_many/1

Takes a list of maximum 5 URLs, returns a list of 5 maps (each of them is the same map `fetch/1` returns).

Sending more URLs would only result in an error. See the Status section below.

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

## Limitations

For performance and security reasons we impose a set of rules:

- Only GET requests.
- No request body nor headers.
- The endpoint must be HTTPS.
- The endpoint must be [idempotent](https://en.wikipedia.org/wiki/Idempotence) (because it will be called hundreds of times for validation purposes).
- The endpoint must reply quickly (a very strict timeout is hardcoded).

To continue to be able to validate transactions very quickly, we only allow one `fetch/1` or `fetch_many/1` call per contract execution. This is because these functions may time-out, and adding timeouts would not perform well.

For the same reason, we also require that the sum of all HTTP responses of a contract execution must not exceed 256 KB.

## Status

Errors are returned via a `status` integer.
This status integer can be any [HTTP status code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) the endpoint returns or one of these:

- `-4000 Internal Error`
- `-4001 Timeout`
- `-4002 Body too large`
- `-4003 Too many urls`
- `-4004 Non-HTTPS`

For convenience, the `fetch_many/1` always returns a list of responses. Even in cases such as `-4003 Too many urls`.
