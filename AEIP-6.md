---
AEIP: 6
Title: Keychain - Standardization
Author: Sylvain Séramy <sylvainl@uniris.io>
Type: Standard Track
Category: AERC
Status: Draft
Created: 2023-01-10
---

# Abstract

The services available in the Archethic network's DApps may require sharing **on-chain personalization information** associated with a globally-shared keychain or one or more services of a keychain.
These informations can be public or protected.

The naming and structure of the information must be standardized and interoperable in order to be taken into account in each DApp. 
This also prevents information redundancy by defining the same business information under different structures.

The means of sharing information related to the keychain is to store them directly in `keychain` type transactions.

The use of a keychain-type transaction has two positive points: 
- the information is directly linked to the keychain's services 
- the transaction fees associated with the `keychain` type transaction are free (=0 UCO), which is beneficial for users.

This AEIP addresses this need with these specific informations:
- archiving of smart-contracts, fungible or non-fungible tokens,
- sender blacklist, 
- contact address book.
*Other AEIPs may be able to further complement this need*

Reminder: a transaction can't exceed 3 Mo.

## Restriction

This AEIP doesn't address the management of personalization specific to a particular DApp. 
Personalization is agnostic to DApps.
For example, we won't store in the keychain the color of the theme of a user's Archethic Wallet DApp.
This specific Archethic Wallet DApp setting will have to be supported in another way.

# Specification

Before this AEIP, "keychain" type transactions contain in the `content` field a representation of a [W3C DID document](https://www.w3.org/TR/did-core/) that helps the discovery of key materials.

We need to add `personalization` section in the `content` field and add `did` section to continue to define DID document : 

```jsonc
{
  "did": {
     // W3C DID part ...
  },
  "personalization": {
    "public": {},
    "protected": {}
  }
}
```

Every changes in `personalization` will add a transaction in the keychain's transaction chain.

NB: For compatibility reasons, a `content` that only contains the DID and doesn't contain a `did` tag will be considered as a DID.

## Access scope of personalization

2 sections are defined in order to separate public data and protected data in a secret. 
- The `public` section is visible to anyone who has the address of the keychain or exploring blockchain transactions.
- The `protected` section allows to specify the index of the secret contained in the transaction to allow DApps to select the correct secret without having to decrypt all the secrets in the transaction.

For protected section, we could force the index with the type of information but it isn't mandatory to have certain personalization data. 
*TODO: Unless we decide that this AEIP defines a defined structure with always in 1 for example the blacklist and in 2 the address book even empty*

### Example

The blacklist informations are stored in the 1st secret in the ownerships list and adress book informations are stored in the 2nd secret. 

```jsonc
{
  "did": {},
  "personalization": {
    "public": {
      "archive": {
      }
    },
    "protected": {
      "blacklist": 1,
      "addressBook": 2
    }
  }
}

```

## Keychain scope of personalization

Personalization information can be attached to the whole keychain or a set of services of this keychain. 
The scope notion must therefore be defined for each item in order to specify on which service(s) the information is dedicated.

- If the scope section value is `keychain`, the personnalization informations are shared to all services of the keychain.
- If the scope section value is `services`, the personnalization informations are shared to the list of services defined in `scopeList` section.

### Examples

```jsonc
"adressBook": {
        "version": "1.0",
        "contacts": [
          {
            "pseudo": "Bob",
            "scope": "keychain",
          },
          {
            "pseudo": "Alice",
            "scope": "services",
            "scopeServices": [
              "did:archethic:00003a9a8d5f1c39a849560c97d7cc53b6ab01e4af5f337c6e9bf0eba8c67ad46d34",
              "did:archethic:0000DA93B2586F6E7C9B2F35B72064618937C372954546A30CEF3539888005B1FD41",
            ]
          },
        ]
      }
```

*Warning: This point requires a blockchain-side evolution to handle an array of secret instead of a map.*

## Personalization informations

### Tokens/Smart Contracts Archiving

#### Definition

In order to prevent spam actions, to convert tokens or smart contracts into cold data or to hide in a DApp some tokens or smart contracts , it may be useful to have an archiving function. 

Focus on tokens:
The addresses and IDs of archived tokens are stored in the keychain, and DApps can take this list into account to exclude or notify them as cold data. 
Since a token is attached to a service of the keychain, it isn't necessary to specify the scope.
*TODO: See if when sending a token to a recipient if the blockchain automatically removes the token from the archive.*

Focus on smart contracts:
The addresses of archived SC are stored in the keychain, and DApps can take this list into account to exclude or notify them as cold data. 
The scope notion must therefore be defined for each item in order to specify on which service(s) the information is dedicated.

#### Access scope of personalization

This information is provided in `public` scope.

#### Structure

List of archiving tokens property in `version: 1.0`.
- `tokens`: contains the list of addresses and id of a token to archive.
*See [AEIP-2](https://github.com/archethic-foundation/aeip/blob/main/AEIP-2.md) for further informations.*

- `smartContracts`: contains the list of addresses of a smart contract to archive.

```jsonc
"archive": {
        "version": "1.0",
        "tokens": [
          {
            "address": "address of the transaction",
            "id": 42,
          },
          {
            "address": "address of the transaction",
            "id": 0,
          },
        ],
        "smartContracts": [
          {
            "address": "address of the SC",
            "scope": "services",
            "scopeList": [
              "did:archethic:00003a9a8d5f1c39a849560c97d7cc53b6ab01e4af5f337c6e9bf0eba8c67ad46d34",
            ]
          },
          {
            "address": "address of the SC",
            "scope": "keychain",
          },
        ]
      }
```

### Blacklist

#### Definition

In order to prevent spam actions or to hide information from certain senders, it may be useful to have a blacklist function. 
The genesis addresses of the services or accounts noted on the list can be taken into account by DApps in order not to display the information. 
*Another AEIP will directly define in the blockchain the non-validation of a transaction from a blacklisted sender for a defined recipient.*

#### Access scope of personalization

This information is provided in `protected` scope.

#### Structure

List of blacklist property in `version: 1.0`.
- `genesisAddresses`: contains the list of genesis addresses to exclude.

```jsonc
"blacklist": {
        "version": "1.0",
        "genesisAddresses": [
            "0000F860810B3FE5D9A90B2DB181489251653CA680D08CA2A5F0D8F025036E9D8003",
            "0000223A3EA65D57465F5FC0AF471548E91F6D4D09B7C874332B3F92E030720DEE42"
        ]
      }
```

### Address book

#### Definition

It may be useful to share a global address book to a keychain or specific to certain accounts. 
This address book has the aim of simplifying the handling of actors in a transaction by avoiding the use of an address or complex hexadecimal public key. 
However, be aware that not all information can be shared in each DApps. 

#### Restriction 

For example, if a developer wants to manage a concept of favorite contacts, he will have to do so within his application because a favorite in a DApps X may not be a favorite in a DApps Y.
Personalization is agnostic to DApps.

#### Access scope of personalization

This information is provided in `protected` scope.
Contact address information is considered as non-public information. 
It is the responsibility of the keychain owner to define the public keys that can access the information considering that the past is unalterable; public keys removed from a transaction chain will always have access to the old information. 
It is therefore recommended that only the keychain can access the address book and that DApps provide, if they would, a system for sharing one or more contacts.

#### Structure

List of contact property in `version: 1.0`.
- `pseudo`: contains the pseudo of the contact. (required)
- `genesisAddress`: contains the genesis address of the contact's transaction chain. (required)
- `genesisPublicKey`: contains the first public key of the contact. (required)
- `avatar`: contains the link to a graphical representation of the contact. It could be a link to an image stored in a static website, to a AEWeb or IPFS link for example. (optional)
- `avatarThumbnail`: contains the link to a small graphical representation of the contact. It could be a link to an image stored in a static website, to a AEWeb or IPFS link for example. (optional) 
- `name`: contains the name of the contact. (optional)
- `lastName`: contains the last name of the contact. (optional)
- `firstName`: contains the first name of the contact. (optional)


`content` in transaction

```jsonc
{
  "did": {
     // W3C DID part ...
  },
  "personalization": {
    "public": {
        // Public informations
    },
    "protected": {
      "addressBook": 2
    }
  }
}

```

`secret` #2 in `ownerships` list

```jsonc
"adressBook": {
        "version": "1.0",
        "contacts": [
          {
            "pseudo": "The JS",
            "genesisAddress": "0000F860810B3FE5D9A90B2DB181489251653CA680D08CA2A5F0D8F025036E9D8003",
            "genesisPublicKey": "00015380A46010DEBB7A80782F9394E982F6AE94F6E1CA40B4A8FC6FEA3FF613C9E3",
            "avatar": "https://......", 
            "avatarThumbnail": "https://.....", 
            "name": "John Smith",
            "lastName": "Smith",
            "firstName": "John",
            "scope": "keychain",
          },
          {
            "pseudo": "Alice Smith",
            "genesisAddress": "0000223A3EA65D57465F5FC0AF471548E91F6D4D09B7C874332B3F92E030720DEE42",
            "genesisPublicKey": "0001C07F265AE582D0E91BFBC16D842A65D0A0A73289301721B777B30B16AFAAEA52",
            "avatar": "https://......",
            "avatarThumbnail": "https://.....",  
            "scope": "services",
            "scopeList": [
              "did:archethic:00003a9a8d5f1c39a849560c97d7cc53b6ab01e4af5f337c6e9bf0eba8c67ad46d34",
            ]
          },
        ]
      }
```



# Motivation

From a user experience perspective, that's important to store personalization information on-chain to prevent users from repeating similar configurations between different devices or decentralized applications.
This AEIP allows to bring cohesion between the applications on the Archethic network. 
The archiving and blacklist information are a way to protect the user from obsolete or unwanted information.
The contact management is a step towards simplifying the use of the network. 
Finally, the AEIP brings structure and interoperability between applications on an open blockchain in terms of concepts and possibilities.

# Rationale

Feedback from users on the wallet led to the establishment of the associated need

# Backwards Compatibility

As mentioned in the "Specification" chapter, adding the `did` section adds a level in the structure of the content of the `keychain` type transaction. 
The system must take into account that a content without specifically noted did corresponds to a did without customization.

