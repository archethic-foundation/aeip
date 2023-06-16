---
AEIP: 9
Title: Keychain - bookmarks
Author: Sylvain Séramy <sylvain@archethic.net>
Type: Standard Track
Category: AERC
Require: none
Status: Draft
Created: 2023-06-15
---

## Abstract
This AEIP defines a standardized JSON structure for managing **bookmarks** for different uses.
Each bookmark corresponds to a **transaction address** and the associated **usage**.

For example, a keychain owner may wish to bookmark certain elements such as NFTs or tokens (which may or may not belong to him/her), certain contacts in his/her address book, or his/her messegner groups.
This will enable them to retrieve this information from their DApps or wallet, whatever device they're using.
These bookmarks can be global to the keychain or specific to one or more keychain services.
In order to protect the information, it's stored in a keychain transaction secret, which can only be read or written by the means of access referenced in the `keychain access` associated with the`keychain`.
 
Bookmark types can be :
- **NFT**: genesis address of a NFT or a collection
- **Fungible token**: genesis address of fungible token
- **Website**: specific address of a website hosted on AEWeb. 
- **Smart-contract**: specific address of a smart contract
- **Discussion group**: genesis address of a discussion group
- **Message**: specific address of a message in a discussion group  
- **Contact**: genesis address of a contact

Notes:
- When genesis address is specified, this means that the application processing the information will have to work on the genesis address of the transaction chain, and that the bookmarked information concerns any transaction in the chain.
- when specific address is specified, this means that the application must bookmark specifically the address in the transaction chain 

## Motivation
It's advantageous to store preference information on-chain, such as favorite addresses, so that users can access them wherever they are and from any device without the need for import/export mechanisms or sharing. 
Additionally, **encrypting this data in a secret of the transaction** and associating it with the keychain helps secure the information at the owner's level, mitigating the risk of alteration or unauthorized disclosure of the information.
Finally, storing the information within a `keychain` transaction eliminates the need for generating additional fees for the user.

## Specification
The JSON structure for bookmarks must adhere to this JSON specification:

In the JSON format, the top level represents either the global information for the keychain or the specific information for each keychain service.

NB: We remind you of the structure of a service within a keychain: `did:archethic` + the keychain address + `#` the service name.
Example : `did:archethic:keychainAddress#serviceName1` -> `did:archethic:0100e3d7f666fd8cb43d6918c15458a10a05acc622c972ee70dd91d90c712892e241#BOB`

The management of bookmarks is encapsulated within a `bookmark` level of the JSON format within each top level (if necessary). Within the `bookmark` level, we find:

- The `version` of the bookmark information format. (mandatory)
- The list of `addresses` with their associated `type` (mandatory). Please refer to the chapter on usages
Note that bookmark information is optional. In that case, no information is present in the secret. 
It isn't necessary to provide an empty bookmark.

Notes:
- The number of addresses within a bookmark is not limited.
- The information at the global level of the keychain and the service level are cumulative. The service level doesn't override the keychain level.

### Example
```jsonc
{
    "did:archethic:keychainAddress": 
    {
      "bookmarks": {
        "version": 1,
        "addresses": {
          "0000F860810B3FE5D9A90B2DB181489251653CA680D08CA2A5F0D8F025036E9D8003": "NFT",
          "00015380A46010DEBB7A80782F9394E982F6AE94F6E1CA40B4A8FC6FEA3FF613C9E3": "contact"
        }
      }
    },
    "did:archethic:keychainAddress#serviceName1":
    {
      "bookmarks": {
        "version": 1,
        "addresses": {
          "0001C07F265AE582D0E91BFBC16D842A65D0A0A73289301721B777B30B16AFAAEA52": "discussionGroupMessage"
        }
      }
    },
		"did:archethic:keychainAddress#serviceName2":
    {
      "bookmarks": {
        "version": 1,
        "addresses": {
          "0000223A3EA65D57465F5FC0AF471548E91F6D4D09B7C874332B3F92E030720DEE42": "token",
          "00003E071D129F70BBA56595EE8F8FD45843DB341BF4F9BDE2B59C2B11AB29A04C52": "discussionGroup"
        }
      }
    }
}
```

### Nomenclature of bookmark types

- **NFT**: `NFT`
- **Fungible token**: `token`
- **Website**: `website`
- **Smart-contract**: `sc`
- **Discussion group**: `discussionGroup`
- **Message**: `discussionGroupMessage` 
- **Contact**: `contact`
  
## Rationale
This standardization of the JSON structure for address bookmarks provides a consistent and universal format for the various DApps that wish to exploit this information. It facilitates integration with existing tools, libraries and services, and promotes interoperability between different applications and systems.

## Backwards Compatibility
Since it's just a matter of creating a secret at the level of the keychain transaction, this doesn't generate any backwards compatibility problems.

## Security Considerations
Care must be taken to ensure that the content returned corresponds to the structure set out in this AEIP so as not to retrieve unsuitable information.