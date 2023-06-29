---
AEIP: 15
Title: Standard Token - Icons
Author: Sylvain Séramy <sylvain@uniris.io>
Type: Standard Track
Category: AERC
Require: AEIP-2, AEIP-8, AEIP-9
Status: Draft
Created: 2023-06-27
---

## Abstract
This AEIP improve the standardized JSON structure for the metadata of a fungble token or a non-fungible tokens (NFTs) on the Archethic blockchain.
The aim is to provide icons definition associated to the token.

## Motivation
The motivation for having icons for fungible tokens or collections of NFTs is primarily related to user-friendliness and user experience. Here are some reasons:

- Easy identification: Icons allow for quick and visual identification of a token or collection. They can represent the logo, symbol, or distinctive image associated with the token or collection, making it easier to identify and differentiate them from others.
- Visibility and recognition: Well-designed icons can help increase visibility and recognition of a token or collection. They contribute to creating a strong visual identity and can attract the attention of users, investors, and digital art enthusiasts.
- Enhanced user experience: Icons add an aesthetic dimension to the user experience. They make the interface more visually appealing and enjoyable to use, which can encourage user engagement and adoption of tokens or collections.
- Marketing and promotion: Icons can be used for marketing and promotion purposes. They can be displayed on trading platforms, marketplaces, digital wallets, social media, etc., to promote tokens or collections and generate interest among users.
- Navigation facilitation: When there are multiple tokens or collections within an ecosystem, icons serve as visual markers to facilitate navigation and search. They allow users to quickly spot the tokens or collections they are looking for.

In summary, icons for fungible tokens or collections of NFTs are essential for identification, differentiation, user experience, marketing, and navigation within a blockchain ecosystem. They contribute to making the overall experience more attractive, recognizable, and user-friendly.

## Specification
The JSON structure for creating a token on the Archethic must adhere to the guidelines set forth by 
- [AEIP-2](/AEIP-02.md).
- [AEIP-9](/AEIP-09.md).


This AEIP introduces the following new fields to define icon
```jsonc
"icon": [
  {
    "url": "https://example.com/token_icon_16x16.png",
    "scale": "1x",
    "size": "16x16"
  },
  {
    "url": "https://example.com/token_icon_64x64.png",
    "scale": "3x",
    "size": "64x64"
  },
]
```

- `url` (string): The HTTPS URI to the icon
- `scale` (string): Indicates the scaling factor of the icon relative to the reference size for that device. Common values for scale are "1x", "2x", and "3x". For example, if the reference size of an icon is 20x20 and the scale is "2x", it means that the icon will be displayed at a size of 40x40 pixels on the device.
- `size` (string): Refers to the physical dimensions of the icon, specified as width x height. For example, "20x20", "40x40", "1024x1024", etc. It indicates the actual size of the icon when displayed. 
NB: In summary, "size" specifies the physical dimensions of the icon, while "scale" indicates the scaling factor of the icon relative to a reference size. 
These two parameters are used together to define different versions of icons to be used on different devices with different screen resolutions.

The JSON structure must adhere to the JSON specification. 

These informations are in the same level of symbol informations:

### Example
```jsonc
{
  "supply": 200000000,
  "type": "non-fungible",
  "name": "My collection",
  "symbol": "NFT",
  "icon": [
    {
      "url": "https://example.com/token_icon_16x16.png",
      "scale": "1x",
      "size": "16x16"
    },
    {
      "url": "https://example.com/token_icon_64x64.png",
      "scale": "3x",
      "size": "64x64"
    },
  ],
  "aeip": [2, 8, 9, 15],
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

Finally, like precise in the [AEIP-8](/AEIP-08.md), if icon is declared in the json structure, developer should add `15` in the `aeip` field to be compliant with the Standard Specification Detection.

## Rationale
This standardization of the JSON structure for token's metadata on Archethic provides a consistent and universal format for the metadata associated with token's icon.
It allows for easier integration with existing tools, libraries, and services, and promotes interoperability between different applications and systems.

## Backwards Compatibility
This AEIP does not break backwards compatibility with token's AEIPs, as it only adds new optional fields to the existing JSON structure.

## Security Considerations
Care must be taken to ensure that any content linked to by the "content" field is safe and does not contain malicious code or content. Developers should follow best practices for content management and security to prevent any potential attacks or vulnerabilities.
