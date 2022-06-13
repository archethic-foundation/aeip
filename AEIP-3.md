---
AEIP: 3
Title: Deeplinking
Author: Sylvain Séramy <sylvain@uniris.io>
Type: Standard Track
Category: AERC
Status: Draft
Created: 2022-06-12
---

# Abstract

The following standard defines the specification for deep linking.
Deep linking does this by specifying a custom URL scheme (iOS Universal Links) or an intent URL (on Android devices) that opens a mobile app if it's already installed. 
This specification will define the standard and the structure of the links for Archethic ecosystem.

# Specification

These links are simply web-browser-like-links that activate your app and may contain information that you can use to load specific section of the app or continue certain user activity from a website (or another app).

App Links and Universal Links are regular https links, thus if the app is not installed (or setup correctly) they'll load in the browser, allowing you to present a web-page for further action, eg. install the app.

## Scheme structure

archethic

## Methods

### Send Transaction (type transfer)

#### Workflow

User clicks on a link on a website contained an url structured to launch the mobile app directly in transfert transaction screen prefilled with recipient(s) and amount
Next, user has just to confirmed the transaction in the app.

#### Structure 

archethic://transfer/recipients/amount/base64_checksum

- `archethic://` : Scheme of link

- `transfer` : transaction type used to open mobile app to prepare a funds transfer of UCO Tokens and NFTs

- `recipients` : addresses of the recipient. If more than one recipient for on transaction, each recipient is seperated by a coma ','

- `amount` : amount of the financial token transaction or quantity of non financial tokens

- `base64_checksum` : blake2b hash encoded on Base 64 URL of the link without the checksum to allow mobile app to verify that the link is complete and not corrupted 

#### Example

archethic://transfer/0000430994d68cbeb13529d25421f6537d6528ce9cc1c6fb7a8dd29ed7bf6a87e85f,00006B06736E2BA5875EF9D9442AAD7C4D9E16CE97B71D1419302B63BBCB482DC4FD/100/MDQ1YjI4NWVmNzcwYWM5NzRkMmViMzQ3YWRiNTBiN2U1OTdhMTQxOWExOGIzMWZiZGUwMzFkYzkzYjlkZmJhNGI2ZWI1OWZmYjgzMmQ1NGFjMmVkNjM3MGE0OGRmY2JhMTNkOWM4YjM5YTRhMzczNzBmOWMwZjNmN2E0ZmIxYWE3OQ

## Create NFT

To be defined...

## ...


