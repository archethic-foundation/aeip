---
AEIP: 13
Title: AEWeb - Publication Status
Author: Bastien CHAMAGNE <bastien@archethic.net>
Type: Standard Track
Category: AERC
Status: Draft
Created: 2023-06-26
---

## Specification
It's a fact, data on the blockchain is immutable. No-one can erase a transaction. 
Since we cannot remove anything, how can a user remove a AEWeb website? 

This AEIP defines a new schema for AEWeb reference transactions. By adding an attribute, it allows a AEWeb website's owner to change its AEWeb website publication status. This new attribute `publicationStatus` tells the AEWeb internal dApp to not serve the content and return an error message instead.

This works because the first thing AEWeb does is fetch the latest reference transaction of the chain. This is how a AEWeb website is able to keep the same URL even though it might be updated multiple times. 

The node needs two modifications:

1. Add a new schema for AEWeb transaction
1. The controller which serves the AEWeb content should check the status and act accordingly

### New schema
```json
{
    "type": "object",
    "description": "Reference tx of an unpublished website",
    "properties": {
        "aewebVersion": {
            "type": "number",
            "exclusiveMinimum": 0,
            "description": "AEWeb's version"
        },
        "publicationStatus": {
            "type": "string",
            "enum": [
            "UNPUBLISHED"
            ]
        }
    },
    "required": [
        "aewebVersion",
        "publicationStatus"
    ],
    "additionalProperties": false
}
```

### Controller logic

When fetching the reference transaction for a AEWeb website, the controller will check the new `publicationStatus` attribute from the JSON. From there, there is 3 possibilities: 

1. `publicationStatus` is not set, defaults to PUBLISHED
1. `publicationStatus` is set to PUBLISHED
1. `publicationStatus` is set to UNPUBLISHED

Now, when the website is unpublished, instead of fetching the data, the controller will return a `410 Gone` HTTP response status.
  

## Backward compatibility

Backward compatibility is assured because we default to PUBLISHED status.