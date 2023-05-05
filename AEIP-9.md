---
AEIP: 9
Title: Standard NFT Metadata
Author: Julien Leclerc <julien.leclerc05@protonmail.com>
Type: Standard Track
Category: AERC
Require: AEIP-2, AEIP-8
Status: Final
Created: 2023-03-12
---

## Abstract
This AEIP defines a standardized JSON structure for the metadata of a non-fungible tokens (NFTs) on the Archethic blockchain. This AEIP builds on top of [AEIP-2](https://github.com/archethic-foundation/aeip/blob/main/AEIP-2.md), which defines the basic fields required for creating NFTs on Archethic. The new standardized JSON structure includes additional fields for specifying the content of the NFT, including its name, description, and various types of content references.

## Motivation
Currently, there is no standardized way of specifying the content of an NFT on Archethic. This creates inconsistency and potential confusion for users, and makes it difficult for developers to build NFT-related tools and applications. By defining a standardized JSON structure for NFT metadata that includes fields for specifying content, we can create a more consistent and user-friendly NFT ecosystem on Archethic.

## Specification
The JSON structure for creating an NFT on the Archethic must adhere to the guidelines set forth by [AEIP-2](https://github.com/archethic-foundation/aeip/blob/main/AEIP-2.md). It also requires to use the [AEIP-8](https://github.com/archethic-foundation/aeip/blob/main/AEIP-8.md) standard detection.

In the case of a collection, the properties specified within the `properties` object are common to all NFTs in the collection.

This AEIP introduces the following new fields, which can be included either within the properties object for single NFTs or as common values for a collection, or within each object of a collection list for each individual NFT:

- `type_mime` (string): The MIME type of the NFT content, defined according to [RFC 2046](https://www.rfc-editor.org/rfc/rfc2046) [(IANA list)](https://www.iana.org/assignments/media-types/media-types.xhtml).
- `content` (object): The content of the NFT, which must contain at least one of the following fields:
  - `raw` (string): The base64 encoding of the NFT content.
  - `ipfs` (string): The IPFS URI to the NFT content (e.g., ipfs://bafybeihkoviema7g3gxyt6la7vd5ho32ictqbilu3wnlo3rs7ewhnp7lly/).
  - `http` (string): The HTTPS URI to the NFT content (e.g., https://my-website.com/image.png).
  - `aeweb` (string): The Aeweb reference address and path to the file for the NFT content (e.g., 0000f2c75f55fb398e99b6a5e674c3422731fb167f79b9b08131dcfa3bb830d50b9a/image.png).
- `name` (string): The name of the NFT.
- `description` (string): A description of the NFT.

The JSON structure must adhere to the JSON specification. 

If multiple fields are used in the `content` object, they must all redirect to the same content.

Note that the content returned by `http` and `aeweb` may not be fixed and could return different values over time.

### Example
```jsonc
{
  "supply": 200000000,
  "type": "non-fungible",
  "name": "My collection",
  "symbol": "NFT",
  "aeip": [2, 9],
  "properties": {
    "type_mime": "image/png", // type/mime for all the collection's NFTs
    "description": "This collection is an example"
  },
  "collection": [
    {
      "content": {
        "raw": "BASE64 of the image"
      },
      "name": "First NFT name"
    },
    {
      "content": {
        "aeweb": "0000f2c75f55fb398e99b6a5e674c3422731fb167f79b9b08131dcfa3bb830d50b9a/image.png"
      },
      "name": "Second NFT name"
    }
  ]
}
```

## Rationale
This standardization of the JSON structure for NFTs metadata on Archethic provides a consistent and universal format for the metadata associated with NFTs. It allows for easier integration with existing tools, libraries, and services, and promotes interoperability between different applications and systems.

## Backwards Compatibility
This AEIP does not break backwards compatibility with AEIP-2, as it only adds new optional fields to the existing JSON structure.

## Security Considerations
Care must be taken to ensure that any content linked to by the "content" field is safe and does not contain malicious code or content. Developers should follow best practices for content management and security to prevent any potential attacks or vulnerabilities.
