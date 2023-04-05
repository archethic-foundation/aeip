---
AEIP: 11
Title: Verifiable Credentials
Author: Samuel Manzanera <samuelmanzanera@protonmail.com>
Status: Draft
Type: Standard Track
Category: AERC
Created: 2023-04-04
---

## Abstract

This document aims to describe a way to leverage the standard [https://www.w3.org/TR/vc-data-model/](W3C Verifiable Credentials) on Archethic Blockchain.
They are credentials (attestations) of subjects (person, organizations, etc.) to be secury cryptographically, respecting the privacy and being verifiable.

This come along with new standard and ideas such as [https://github.com/archethic-foundation/aeip/blob/main/AEIP-10.md](Soul Bounded Tokens (SBTs)) in the Web3 to build decentralized identity
but yet issued by recognized entities while being verifiable and usable in our daily life.

Verifiable Credentials are information related to a subject and certified/attested by an issuer.

Those entities are usually represented as [https://www.w3.org/TR/did-core/](Decentralized Identifiers) to be cryptographically trusted and verified.

The verifiable credential then hold the entire attestation which can be disclosed or not according to the subject's volontee.

In order to make a verifiable but yet privacy-focused, Verifiable Presentation can be built to disclose a certain information or an information predicate to a verifier (selective credentials or zero knowlegedge proof)

To do so, the verifiable credential needs to be stored on a credential repository such as digital wallet, or in the case Web3 technology can be encoded into tokens like SBTs.

## Specification

Once delivered inside a token, a verifiable credential should always be encrypted for the subject, using the DID's document key material.
This encryption can be leveraged by the `Ownerships` field in any transaction.

By using Archethic's Blockchain, every wallet have its own DID and DID's document where the key materials are available for public usage.
The credential must be encrypted with the public key present in the Keychain's DID document.

However, some information could be made public in the token properties to ensure the issuer and subject authenticity. 
A verifiable credential could be sent to the owner of a SBT to prove the ownership of the token without revealing their personal information.
The same approach can be taken to track the provenance of the token. Particulary useful for high-value assets, such as artwork or collectibles.

The veriaible credentials can be encoded in plain json or using Json Web Token standard.

### Hybrid privacy for the verifiable credential

Example with plain JSON token

```jsonc
{
  "type": "soul-bounded",
  "aeip": [2, 10, 11],
  "properties": {
    "credential": {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.w3.org/2018/credentials/examples/v1",
        "https://w3id.org/security/suites/ed25519-2020/v1"
      ],
      "type": [
        "VerifiableCredential",
        "UniversityDegreeCredential"
      ],
      "issuer": "did:archethic:0fa.....Fac",
      "issuanceDate": "13813091930",
      "credentialSubject": "..." // The credential claims could be encrypted directly or linked to the secrets of the transaction
      "proof": {
        "type": "Ed25519Signature2020",
        "verificationMethod": "did:archethic:0fa......Fac#keys-1",
        "proofPurpose": "assertionMethod",
        "proofValue": "z5JKxik9jw25W2s9Q3N3RMovCVLSt1h6bBTZrKsy3JWP48KokH4spdBUxTykSb11FCtn8q5HWybySAGCFaWwN2aiT"
      }
    }    
  }
}
```

### Complete obfuscation of the verifiable credential

In this example all the metadata of the verifiable credential have been encrypted so only the subject can disclose them or not.

```jsonc
{
  "type": "soul-bounded",
  "aeip": [2, 10, 11],
  "properties": {
    "credential": encryptedCredential,
    "proof": {
      "type": "Ed25519Signature2020",
      "verificationMethod": "did:archethic:0fa......Fac#keys-1",
      "proofPurpose": "assertionMethod",
      "proofValue": "z5JKxik9jw25W2s9Q3N3RMovCVLSt1h6bBTZrKsy3JWP48KokH4spdBUykSb11FCtn8q5HWybySAGCFaWwN2aiT"
      }
    }    
}
```

Once the token is minted and send to the owner(subject), the subject can proove the ownership of this Verifiable Credential as being transfered in the blockchain network.

Now, in order to proove to a verifier certains claims, the subject would have to produce a verifiable presentation disclosing or not certain claims& information.
For privacy reason this can happen on chain and will require a interactive communication between the verifier and the holder (subject).

A claim could be used to derive a presented value which will be asserted such that a verifier can trust the value if they trust the issue.
This will involve zero-knowledge proofs techniques.

But in other cases, the subject(holder of the credential) has the complete control of sharing the entire credential with the verifier, if no zero knowledge proof techniques are used.




