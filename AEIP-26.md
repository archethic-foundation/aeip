---
AEIP: 26
Title: Dynamic Hypergeometric Distribution
Author: Akshay Kumar KANDHI MANJUNATHA REDDY <akshaykumarkm9@gmail.com>
Type: Core
Status: Draft
Created: 2024-02-13
---


# Problem Statement
In the evolving landscape of blockchain technology, ensuring transactional integrity and network security in the face of potential internal threats poses a significant challenge. 

Traditional consensus mechanisms often fall short when confronted with high percentages of malicious nodes, compromising the system's reliability. The problem intensifies as the network grows, demanding a scalable and flexible solution.

The ARCH Consensus mechanism, underpinned by dynamic hypergeometric distribution and threshold signatures, aims to address this challenge. It ensures a secure and stable consensus by adjusting the number of validating nodes according to the detected level of network maliciousness. For example:

- At a lower threat level with 51% malicious nodes, only 30 nodes might be needed to reach a reliable consensus.
- As the threat level escalates to 66% maliciousness, this number increases to 50 nodes to preserve the network's integrity.
- At a high-risk level with 90% malicious nodes, the ARCH Consensus would require up to 197 nodes to validate transactions securely.

This dynamic adjustment, governed by the principles of hypergeometric distribution, allows the ARCH Consensus to maintain a high threshold for security, ensuring that even with a majority of malicious actors, the network can operate effectively and trust can be maintained in the system's veracity. 

The integration of threshold signatures further enhances security by requiring a minimum number of qualifying signatures for a transaction to be approved, thus preventing any single point of failure or attack.

The problem statement, therefore, is: How can a blockchain network dynamically adjust its consensus mechanism to maintain transactional integrity and robust security across various levels of malicious activity, leveraging the mathematical rigor of hypergeometric distribution and the added security layer of threshold signatures?

# Solution
The Mathematical Underpinning: Hypergeometric Distribution

## Hypergeometric Distribution

The hypergeometric distribution serves as the statistical backbone of ARCH Consensus. It's described by the probability mass function:
![image](https://github.com/archethic-foundation/aeip/assets/75987671/e61aa2d2-ef18-4120-aef6-8e1ac46261c4)

Where:
* N = Total number of nodes.
* N - N1 = Total number of honest nodes.
* n = Number of nodes sampled (selected for consensus).
* N - N1 = Number of honest nodes in the sample.
* P(X = k) = Probability of k honest nodes in the sample.
The ARCH Consensus uses this formula to determine the probability of achieving a reliable consensus given N, K, and n.

## Dynamic Adaptation of Node Selection

To adapt to varying levels of network threat, ARCH Consensus dynamically adjusts n, the number of nodes sampled for the consensus process. This is achieved through a linear interpolation based on the current malicious rate M:
![image](https://github.com/archethic-foundation/aeip/assets/75987671/077f09fa-b7f0-4855-9e57-1a628f978897)

To be more precise:
* n(min) is the number of nodes using the hypergeometric distribution of N when malicious rate is 51%
* n(max) is the number of nodes using the hypergeometric distribution of N when malicious rate is 90%
* M is the malicious rate, this rate is adjusted based on the network conditions and the default value is 0
* M(min) and M(max) are initially set to 0, but are adjusted based on the network conditions


## Empirical Analysis and Graphical Representation

The performance of the ARCH Consensus was subjected to rigorous simulation under varying conditions of network integrity. The graph below illustrates the minimum number of nodes required for different malicious rates at a fixed tolerance level:
![image](https://github.com/archethic-foundation/aeip/assets/75987671/05ac8ca0-f740-4857-a54b-6997585f92dc)

The Hypergeometric distribution was developed to simulate the minimum number of nodes necessary to counteract the influence of malicious nodes within a network. 

This program built in C, calculates the probability of a consensus not being overtaken by malicious actors, given the total number of nodes and the proportion of those that are malicious. 

The analysis was conducted for various malicious rates 51%, 66% and 90% (0.51, 0.66, 0.90 respectively) and total node counts (100, 1000, 10000), with a set tolerance threshold of 10^-9 for the decision-making process.

## Results

The findings reveal a clear trend of substancial decrease in no of nodes with respect to the decrease in malicious rates: (**For a  `TOLERANCE`  of 10^-9**)

- At a **malicious rate of 51% (0.51)**, the minimum nodes required are 26 for 100 nodes, 31 for 1000 nodes, and similarly 31 for 10000 nodes.
- For a **malicious rate of 66% (0.66)**, these figures rise to 38, 49, and 50 for 100, 1000, and 10000 total nodes, respectively.
- At a **malicious rate of 90% (0.90)**, the network demands a substantially higher count of minimum nodes for resilience: 84 for 100 nodes, 178 for 1000 nodes, and 195 for 10000 nodes.

![image](https://github.com/archethic-foundation/aeip/assets/75987671/3509f152-4cb8-4243-bc60-6391ab719b4c)

These results were visualized in a graph, distinguishing each scenario with distinct colors, to effectively communicate the relationship between the total number of nodes, the proportion of malicious nodes, and the network's resilience.
The tolerance level, representing the desired confidence in the consensus decision, was set to 10^-9 for these simulations. The graph demonstrates a nonlinear increase in the number of required honest nodes as the malicious rate escalates, underscoring the mechanism's capacity to bolster network security proactively.
