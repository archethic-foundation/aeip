---
AEIP: 25
Title: Merkel Trees to secure the validation stamp, unspent inputs and consumed outputs 
Author: Akshay Kumar KANDHI MANJUNATHA REDDY <akshaykumarkm9@gmail.com>
Type: Standard Track
Category: Core
Status: Review
Created: 2024-02-13
---
# Problem Statement:
This AEIP solves the problem of 
1. Security of data for Unspent Outputs (UTXOs) and Consumed Inputs:
2. Verifying maliciousness without revealing the actual data:

# Understanding Merkel Trees:
There are 3 steps to understanding Merkel Trees (if you already know about Merkel trees skip introduction section) 
(* This introduction is directly copy pasted from ChatGPT)

## Components

![image](https://github.com/archethic-foundation/aeip/assets/75987671/0e8d90c3-24ac-4a4b-a0a4-442a73fde302)


## Poof of Inclusion:

![image](https://github.com/archethic-foundation/aeip/assets/75987671/62583d82-abcb-4980-88f8-6842ace0b3f8)


![image](https://github.com/archethic-foundation/aeip/assets/75987671/8d17dfcf-de86-4d76-a411-3c17abd301cb)

![image](https://github.com/archethic-foundation/aeip/assets/75987671/462de01d-9c6e-4446-a848-7d423f0b7661)

# Application of Merkel Trees in Archethic
Below is the transaction validation process (updated to also include AEIP 21). Only the steps in Violet are modified with the inclusion of merkel trees
![image](https://github.com/archethic-foundation/aeip/assets/75987671/0960e7b7-ebae-49e3-b3fc-fbc68c4065ab)

### Build Context:
- Fetch Previous Transaction and Network View: The elected nodes (coordinators and cross validation nodes) get all the transactions necessary for validation from the closest storage nodes
- **Fetch the Unspent entries (UTXO):** The elected nodes also get all the transactions related to unspent entries (UTXO) on the respective genesis pools. (During this fetching make sure to take the data from all the genesis nodes so that no UTXO entry is missed)

**Sender's Genesis**: Once the context of the transaction has been rebuilt, the cross-validation nodes communicate to the coordinating node the list of storage nodes used to collect the data and their views on the availability of the validation and storage nodes.
![image](https://github.com/archethic-foundation/aeip/assets/75987671/d1eb6c80-eb5c-4992-89ea-d88b21ed22ff)

### Build Validation Stamp:

The Coordinator node, later has to rebuild the context of the transaction (chain, inputs, output), figure out the proof of work (PoW), compute the replication tree , define the operations on the ledgers and sign the validation stamp and transmit it to the cross validation nodes.

Validation Stamp contains ( Merkel Root | Proof of Integrity | Proof of election | Recepients | Fee | Protocol Version | Time Stamp | Ledger Operations (From, Type, Amount, Aggregated Signature, Merkel Root & Merkel Path) | Unspent Outputs (Sender’s Genesis) | Spent Outputs (Sender’s Genesis)

This is Merkel Root of validation stamp is needed
1. Cross validation nodes can prepare the merkel root of validation stamp even before the coordinator nodes sends the validation stamp to cross validation.
2. Any part of the validation stamp can be verified without revealing the contents of the stamp. This is helpful and important in malicious detection and elimination.
![image](https://github.com/archethic-foundation/aeip/assets/75987671/4ef3181f-4c9c-4ee4-9406-465953acf677)

Unspent Outputs and Consumed Inputs Calculation:

- The validation stamp also builds the new “Consolidated Unspent UTXO” that is the full consolidation of the previous “Consolidated Unspent UTXO” and “New UTXOs”
- The validation stamp computes the Consumed Inputs into the “Spent”, calculating the new Merkel Root from the previous spent merkel path for the new “Spent”.

### Cross Validation Signatures:

The content of the Validation Stamp is verified by each cross-validation node which will further issue a "CrossValidation Stamp" to the coordinator and other cross validation nodes.

The cross validation just verify the merkel root. This saves the time taken to verify the validation stamp.

### Genesis Nodes Update:

Finally with the fully validated transaction,  

The Sender’s genesis nodes are updated with the new Consolidated Unspent UTXOs and Spent Outputs. 

The Receiver’s genesis nodes are updated with the new Unspent UTXO from the sender
Both Sender and Receiver genesis nodes will verify the contents of the UTXOs before taking it into account.

![image](https://github.com/archethic-foundation/aeip/assets/75987671/1bdec43a-d997-4b0f-8886-9c9850a5674a)

