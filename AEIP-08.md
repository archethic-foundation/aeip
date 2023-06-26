---
AEIP: 8
Title: Standard Specification Detection
Author: Julien Leclerc <julien.leclerc05@protonmail.com>
Type: Standard Track
Category: AERC
Status: Final
Created: 2023-02-28
---

# Abstract

The following standard defines a method to detect what specification a transaction content implements.  
The standard contains the following:

- How to detect if a transaction implements this AEIP-8
- How to use this standard

# Motivation

Since [AEIP-2](https://github.com/archethic-foundation/aeip/blob/main/AEIP-2.md), tokens are created using the content part of a token transaction.  
The content value must follow some specifications using JSON format with specific attributes.  
In more general case, the content part of a transaction is a free place where any kind of value can be written, we need to identify if the content of a transaction follow some AEIP specifications.

# Specification

According to [AEIP-2](https://github.com/archethic-foundation/aeip/blob/main/AEIP-2.md), this specification keeps using JSON format and adds a specific attribute which defines the AEIP standards implemented for a transaction.

The new attribute `aeip` is added in the root of the JSON structure. It's an array of positive integer where each value represent an AEIP number.

```jsonc
{
  supply: 100000000,
  type: "fungible",
  name: "AEIP2 token",
  aeip: [2], // this attribute defines that the transaction content follows the AEIP 2 specification
  properties: {
    ...
  }
}
```

## How to detect if a transaction content implements the AEIP-8

To detect if this AEIP is implemented in a transaction content there is few rules:

- The content must be JSON format
- In the root of the JSON structure, an attribute `aeip` must be present
- This attribute must be an array of integer

Here is a full javascript verification:

```javascript
try {
  const jsonContent = JSON.parse(tx.data.content);
  if (jsonContent.aeip && Array.isArray(jsonContent.aeip)) {
    implementAEIP8 = jsonContent.aeip.every((value) => {
      return Number.isInteger(value) && value > 0;
    });

    if (implementAEIP8) {
      console.log("this transaction implements AEIP8");
    } else {
      console.log("this transaction does not implement AEIP8");
    }
  }
} catch (error) {
  // SyntaxError means the transaction content is not a JSON format,
  // so the transaction does not implements this AEIP
  console.log("this transaction does not implement AEIP8");
}
```

This standard is not applicable only for token specification like AEIP-2 but can be used for all kind of standard that uses a JSON format.

It is recommended that future AEIP require this AEIP-8 if possible.  
[AEIP-2](https://github.com/archethic-foundation/aeip/blob/main/AEIP-2.md) does not require this AEIP standard but it's strongly recommended to use it.

## How to use this standard

Applications that require a specific AEIP standard to works can verify if the transaction implements the needed AEIP.

For example if an application needs to display token name, it can get the transaction that created a token, and read its content.  
If the transaction content follows the previous standard and the AEIP-2 is implemented, the application knows that it can get from the token specification the `name` or `symbol` attribute to display it on a UI.
