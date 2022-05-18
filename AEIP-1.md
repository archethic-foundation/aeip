---
AEIP: 1
Title: AEIP Purpose and Guidelines
Author: Samuel Manzanera <samuel@uniris.io>
Type: Process
Status: Review
Created: 2022-05-16
---

# What is an AEIP ?

AEIP stands for Archethic Improvement Proposal. An AEIP is a design document providing information to the Archethic community, 
or describing a new feature for Archethic or its processes or environment.
The AEIP should provide a concise technical specification of the feature and a rationale for the feature.

We intend AEIPs to be the primary mechanisms for proposing new features, for collecting community input on an issue, 
and for documenting the design decisions that have gone into Archethic. 
The AEIP author is responsible for building consensus within the community and documenting dissenting opinions.

Because the AEIPs are maintained as text files in a versioned repository, their revision history is the historical record of the feature proposal. 

# AEIP types

* A Standards Track AEIP describes any change that affects Archethic implementation, such as a change to the network protocol, 
a change in chain or transaction validity rules, proposed application standards/conventions, or any change or addition that affects the interoperability of applications using Archethic.
Furthermore, Standards Track AEIPs can be broken down into the following categories: 
  - Core: improvements requiring a consensus upgrade, as well as changes that are not necessarily consensus critical but may be relevant to “core dev” discussions.
  - Networking: includes improvements around P2P layer and Supervised Multicast communication, as well as proposed improvements to the binary protocol.
  - Interface: includes improvements around client API/RPC specifications and standards. 
  - AERC: application-level standards and conventions, including standards such as token standards, name registries, URI schemes, library/package formats, and wallet formats.
* An Informational AEIP describes an Archethic design issue, or provides general guidelines or information to Archethic community, but does not propose a new feature. 
Informational AEIP does not necessarily represent an Archethic community consensus or recommendation, so users and implementors are free to ignore Informational AEIPs or follow their advice.
* A Process AEIP describes a process surrounding Archethic, or proposes a change to (or an event in) a process. Process AEIPs are like Standards Track AEIPs but apply to areas other than the Archethic protocol itself. 
They may propose an implementation, but not to Archethic's codebase; they often require community consensus; unlike Informational AEIPs, they are more than recommendations, and users are typically not free to ignore them. 
Examples include procedures, guidelines, changes to the decision-making process, and changes to the tools or environment used in Archethic development. Any meta-AEIP is also considered a Process AEIP.

# AEIP Workflow

## Creation

The AEIP process begins with a new idea for Archethic. 
Each potential AEIP must have a champion -- someone who writes the AEIP using the style and format described below, 
shepherds the discussions in the appropriate forums, and attempts to build community consensus around the idea. 

The AEIP champion (a.k.a. Author) should first attempt to verify whether the idea is AEIP-able. 

Vetting an idea publicly before going as far as writing an AEIP is meant to save both the potential author and the wider community time. 
Many ideas have been brought forward for changing Archethic that have been rejected for various reasons. 

Asking the Archethic community first if an idea is original helps prevent too much time being spent on something that is guaranteed to be rejected based on prior discussions (searching the internet does not always do the trick). 
It also helps to make sure the idea is applicable to the entire community and not just to the author. 

Just because an idea sounds good to the author does not mean it will work for most people in most areas where Archethic is used. 

Small enhancements or patches often don't need standardization between multiple projects;
these don't need an AEIP and should be injected into the relevant Archethic development workflow 
with a patch submission to the applicable Archethic issue tracker. 

Once the champion has asked the Archethic community as to whether an idea has any chance of acceptance, a draft AEIP should be presented.
This gives the author a chance to flesh out the draft AEIP to make it properly formatted, of high quality, and to address additional concerns about the proposal. 
This draft must be written in AEIP style as described below, else it will be sent back without further regard until proper formatting rules are followed. 

AEIP authors are responsible for collecting community feedback on both the initial idea and the AEIP before submitting it for review. 
However, wherever possible, long open-ended discussions should be avoided. 

It is highly recommended that a single AEIP contain a single key proposal or new idea. 
The more focused the AEIP, the more successful it tends to be. 
If in doubt, split your AEIP into several well-focused ones. 

Once the idea is well-formalized, the AEIP's author can submit a pull-request to the [AEIP repository](github.com/archethic-foundation/aeip) to propose 
its enhancement.

## Validation

The AEIP editor reserves the right to reject AEIP proposals if they appear too unfocused or too broad. 

Reasons for denying AEIP status include duplication of effort, disregard for formatting rules, being too unfocused or too broad, 
being technically unsound, not providing proper motivation or addressing backwards compatibility, or not in keeping with the Archethic philosophy. 

For an AEIP to be accepted it must meet certain minimum criteria. 
It must be a clear and complete description of the proposed enhancement. 
The enhancement must represent a net improvement. 
The proposed implementation, if applicable, must be solid and must not complicate the protocol unduly. 

Standards Track AEIPs consist of two parts:
- a design document
- a reference implementation. 

The AEIP should be reviewed and accepted before a reference implementation is begun, 
unless a reference implementation will aid people in studying the AEIP. 

Standards Track AEIPs must include an implementation -- in the form of code, a patch, or a URL to same -- before it can be considered Final. 

### Criteria for a successful AEIP 

Each AEIP should have the following parts: 
- Preamble: RFC 822 style headers containing meta-data about the AEIP, including the AEIP number, 
a short descriptive title (limited to a maximum of 44 characters), the names, and optionally the contact info for each author, etc.
- Abstract: a short (~200 word) description of the technical issue being addressed.
- Specification: The technical specification should describe the syntax and semantics of any new feature. 
The specification should be detailed enough to allow competing, interoperable implementations for any of the current Archethic platforms (lib-js, lib-dart).
- Motivation: The motivation is critical for AEIPs that want to change the Archethic protocol. 
It should clearly explain why the existing protocol specification is inadequate to address the problem that the AEIP solves. 
AEIP submissions without sufficient motivation may be rejected outright.
- Rationale: The rationale fleshes out the specification by describing what motivated the design and why particular design decisions were made. 
It should describe alternate designs that were considered and related work, e.g. how the feature is supported in other languages.
- Backwards Compatibility: All AEIPs that introduce backwards incompatibilities must include a section describing these incompatibilities and their severity. 
The AEIP must explain how the author proposes to deal with these incompatibilities. 
AEIP submissions without a sufficient backwards compatibility treatise may be rejected outright.
- Reference Implementation: The reference implementation must be completed before any AEIP is given status "Final", 
but don't have to be completed before the AEIP is accepted. 
It is better to finish the specification and rationale first and reach consensus on it before writing code.
- The final implementation must include test code and documentation appropriate for the Archethic protocol.

# AEIP Format and Templates

AEIPs should be written in markdown format. 

Once a AEIP has been accepted, the reference implementation must be completed. 
When the reference implementation is complete and accepted by the community, the status will be changed to "Final". 

The AEIP author or editor can assign the AEIP this status when any progress is being made on the AEIP. 
Once an AEIP is deferred, the AEIP editor can re-assign it to draft status.

An AEIP can also be "Rejected". Perhaps after all is said and done it was not a good idea. 
It is still important to have a record of this fact.

AEIPs can also be replaced by a different AEIP, rendering the original obsolete. 
This is intended for Informational AEIPs, where version 2 of an API can replace version 1. 

Some Informational and Process AEIPs may also have a status of "Active" if they are never meant to be completed. E.g. AEIP 1 (this AEIP). 


## Header preamble

Each AEIP must begin with an RFC 822 style header preamble. 
The headers must appear in the following order. 
Headers marked with "*" are optional and are described below. 
All other headers are required. 

```
  ---
  AEIP: <AEIP number>
  Title: <AEIP title>
  Author: <list of authors real names and optionally, email addrs>
  Status: <Draft | Review | Final | Replaced | Active>
  Type: <Standards Track | Informational | Process>
  * Category: <Core | Networkin | Interface | AERC>
  Created: <date created on, in ISO 8601 (yyyy-mm-dd) format>
  * Replaced-By: <AEIP number>
  ---
```
    
The Author header lists the names, and optionally the email addresses of all the authors/owners of the AEIP. 
    The format of the Author header value must be 
```
John Doe <john.doe@dom.ain>    
```
    
if the email address is included, and just 
    
```
John Doe
```
if the address is not given. 
    
If there are multiple authors, each should be on a separate line following RFC 2822 continuation line conventions.

While an AEIP is in private discussions (usually during the initial Draft phase), a Discussions-To header will indicate the mailing list or URL where the AEIP is being discussed. 
No Discussions-To header is necessary if the AEIP is being discussed privately with the author

The Type header specifies the type of AEIP: Standards Track, Informational, or Process.
    
The Category header must one of Core, Networking, Interface, or AERC (Optional field, only needed for Standards Track EIPs)

The Created header records the date that the AEIP was assigned a number and should be in yyyy-mm-dd format, e.g. 2001-08-14.

AEIPs may also have a Replaced-By header indicating that a AEIP has been rendered obsolete by a later document; 
the value is the number of the AEIP that replaces the current document. 

## Appendix files
    
AEIPs may include auxiliary files such as diagrams. 
Image files should be included in a subdirectory for that AEIP. 
Auxiliary files must be named AEIP-XXXX-Y.ext, where "XXXX" is the AEIP number, "Y" is a serial number (starting at 1), 
and "ext" is replaced by the actual file extension (e.g. "png").
    
    
    
