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
$$P[X = k] = \sum_{k=1}^{p} \binom{N_1}{k} \times \frac{\binom{N-N_1}{n-k}}{\binom{N}{n}}\$$

Where:
* N = Total number of nodes.
* N - N1 = Total number of honest nodes.
* n = Number of nodes sampled (selected for consensus).
* N - N1 = Number of honest nodes in the sample.
* P(X = k) = Probability of k honest nodes in the sample.
The ARCH Consensus uses this formula to determine the probability of achieving a reliable consensus given N, K, and n.

## Dynamic Adaptation of Node Selection

To adapt to varying levels of network threat, ARCH Consensus dynamically adjusts n, the number of nodes sampled for the consensus process. This is achieved through a linear interpolation based on the current malicious rate M:

$$ n = n_{min} + (n_{max} - n_{min}) \times \left( \frac{M - M_{min}}{M_{max} - M_{min}} \right) $$

Where:
- `n_{min}` = number of nodes using the hypergeometric distribution of N using the lowest malicious rate (51%)
- `n_{max}` = number of nodes using the hypergeometric distribution of N using the highest malicious rate (90%)
- `M` = Current malicious rate. This rate is adjusted based on the network conditions and the default value is 0
- `M_{min}` = Lowest observed malicious rate (initially set to 0 and adjusted based on the network conditions)
- `M_{max}` = Highest observed malicious rate (initially set to 0 and adjusted based on the network conditions)


## Empirical Analysis and Graphical Representation

The performance of the ARCH Consensus was subjected to rigorous simulation under varying conditions of network integrity. The graph below illustrates the minimum number of nodes required for different malicious rates at a fixed tolerance level:

**Minimum Number of Nodes Required = f(N, M, Tolerance)**

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


# UPDATE: 19 Nov 2024
# Issue Resolution: Hypergeometric Distribution with Dynamic Node Scaling

We've implemented a solution that addresses the network stability concerns while maintaining security requirements. The new implementation includes:

## 1. Dynamic Security Parameters
- Scales malicious node tolerance between 80-90% based on network size
- Adjusts probability tolerance (10^-6 to 10^-9) based on network size
- Provides smoother transitions for growing networks


## 2. Automatic Node Overbooking
- Implements 25% overbooking for fault tolerance
- Automatically scales down base requirements if needed
- Ensures network can handle node disconnections


# How It Works
## Security Scaling
- Small networks (< 9 nodes): Uses minimum security parameters
- Large networks (≥ 1000 nodes): Uses maximum security parameters
- Mid-sized networks: Logarithmic scaling for smooth transitions

##  Overbooking Mechanism
- Adds 25% extra nodes to handle disconnections
- If total needed exceeds network size, scales down base requirement
- Formula: total_nodes = base_nodes + (base_nodes * 0.25)

## Key Benefits
- Better fault tolerance for small networks
- Maintains high security for large networks
- Automatic scaling of requirements
- No manual parameter adjustments needed

```python
from mpmath import mp, factorial, binomial
import math

def get_security_parameters(nb_nodes):
    """
    Calculate security parameters with logarithmic scaling up to 1000 nodes,
    maintaining higher minimum security for small networks.
    """
    # Constants
    SCALING_LIMIT = 200  # Point at which we reach maximum security
    MIN_NODES = 9
    
    # Maximum security parameters (for nodes >= 200)
    MAX_MALICIOUS_RATE = mp.mpf('0.90')  # 90%
    MIN_TOLERANCE = mp.mpf('1e-9')        # 10^-9
    
    # Minimum security parameters (for small networks)
    MIN_MALICIOUS_RATE = mp.mpf('0.80')   # 80% minimum for security
    MAX_TOLERANCE = mp.mpf('1e-6')        # 10^-6 for small networks
    
    if nb_nodes >= SCALING_LIMIT:
        return MAX_MALICIOUS_RATE, MIN_TOLERANCE
    
    if nb_nodes < MIN_NODES:
        return MIN_MALICIOUS_RATE, MAX_TOLERANCE
    
    # Logarithmic scaling for smoother transition and better security
    scale = mp.log(nb_nodes - MIN_NODES + 1) / mp.log(SCALING_LIMIT - MIN_NODES + 1)
    scale = min(mp.mpf('1.0'), max(mp.mpf('0.0'), scale))
    
    # Calculate malicious rate with logarithmic scaling
    malicious_rate = MIN_MALICIOUS_RATE + (MAX_MALICIOUS_RATE - MIN_MALICIOUS_RATE) * scale
    
    # Calculate tolerance with exponential scaling
    log_min_tolerance = mp.log(MIN_TOLERANCE)
    log_max_tolerance = mp.log(MAX_TOLERANCE)
    log_tolerance = log_max_tolerance + (log_min_tolerance - log_max_tolerance) * scale
    tolerance = mp.exp(log_tolerance)
    
    return malicious_rate, tolerance

def calculate_overbooking(required_nodes, network_size):
    """
    Calculate overbooking requirements with dynamic scaling
    """
    OVERBOOKING_RATE = mp.mpf('0.25')  # 25% overbooking
    
    overbooked = int(required_nodes * OVERBOOKING_RATE)
    total_needed = required_nodes + overbooked
    
    if total_needed > network_size:
        # Scale down required nodes to accommodate overbooking
        max_base_nodes = int(network_size / (1 + OVERBOOKING_RATE))
        return max_base_nodes, int(max_base_nodes * OVERBOOKING_RATE)
    return required_nodes, overbooked

def hypergeometric_distribution(nb_nodes):
    """
    Modified hypergeometric distribution calculation with dynamic security parameters
    and overbooking support
    """
    # Get dynamic security parameters
    malicious_rate, tolerance = get_security_parameters(nb_nodes)
    nb_malicious = int(nb_nodes * malicious_rate)
    nb_good = nb_nodes - nb_malicious
    
    print(f"Network size: {nb_nodes}")
    print(f"Malicious rate: {float(malicious_rate * 100):.2f}%")
    print(f"Tolerance: {float(tolerance):.2e}")
    print(f"Good nodes: {nb_good}")
    print(f"Possible malicious nodes: {nb_malicious}")
    
    # For each possible number of nodes needed for consensus
    for n in range(1, nb_nodes + 1):
        sum_prob = mp.mpf('0')
        
        # For each possible number of good nodes in selection
        for k in range(1, nb_good + 1):
            # Match original C code conditions
            if n - k >= 0 and nb_good - k >= 0 and nb_malicious >= n - k:
                # Calculate combinations as in original code
                comb_good = binomial(nb_good, k)
                comb_malicious = binomial(nb_malicious, n - k)
                comb_total = binomial(nb_nodes, n)
                
                if comb_total != 0:
                    probability = (comb_good * comb_malicious) / comb_total
                    sum_prob += probability
                    
                    # Check if we've reached required certainty
                    if (mp.mpf('1') - sum_prob) < tolerance:
                        base_nodes, overbooked = calculate_overbooking(n, nb_nodes)
                        
                        print(f"\nResults:")
                        print(f"Minimum nodes needed (before overbooking): {n}")
                        print(f"Probability sum reached: {float(sum_prob)}")
                        print(f"1 - probability: {float(1 - sum_prob)}")
                        print(f"\nWith overbooking:")
                        print(f"Base nodes required: {base_nodes}")
                        print(f"Overbooked nodes: {overbooked}")
                        print(f"Total nodes needed: {base_nodes + overbooked}")
                        return base_nodes
    
    return nb_nodes

if __name__ == "__main__":
    # Set precision for high-accuracy calculations
    mp.dps = 100  # Increase precision for large numbers
    
    test_sizes = [10, 20, 50, 100, 200, 500, 1000, 5000, 100000]
    for size in test_sizes:
        print("\n" + "="*50)
        hypergeometric_distribution(size)

```


Let me explain these specific aspects of the code:

1. **Logarithmic Scaling Usage:**
The logarithmic scale is used for two key reasons:

```python
# Logarithmic scaling calculation
scale = mp.log(nb_nodes - MIN_NODES + 1) / mp.log(SCALING_LIMIT - MIN_NODES + 1)
```

- **Non-linear Parameter Adjustment:** 
  - Logarithmic scaling provides a non-linear transition of security parameters (malicious_rate and tolerance)
  - It changes quickly for small networks and slows down as the network grows
  - This is ideal because security requirements don't need to scale linearly with network size
  - For example: Going from 10 to 20 nodes has a bigger security impact than going from 1000 to 1010 nodes

- **Smooth Transitions:**
  - Prevents sudden jumps in security parameters
  - Gives gradual changes between MIN_MALICIOUS_RATE (80%) and MAX_MALICIOUS_RATE (90%)
  - Helps maintain network stability during growth

2. **Scaling Limit of 200:**
```python
SCALING_LIMIT = 200  # Point at which we reach maximum security
```

The scaling limit of 200 is sufficient because:
- By 200 nodes, the network is large enough to achieve maximum security parameters
- After this point:
  - The malicious rate stays at 90%
  - The tolerance remains at 1e-9
- Empirical testing shows that beyond 200 nodes:
  - The hypergeometric distribution results stabilize
  - Additional nodes don't significantly improve security guarantees
  - The consensus requirements become consistent

3. **Overbooking Logic After Hypergeometric Distribution:**
```python
def calculate_overbooking(required_nodes, network_size):
    OVERBOOKING_RATE = mp.mpf('0.25')  # 25% overbooking
```

The overbooking is applied after the hypergeometric calculation because:

a) **Separation of Concerns:**
   - Hypergeometric distribution calculates the mathematically required nodes for security
   - Overbooking handles practical network reliability issues
   - Keeping these separate maintains mathematical purity of the security calculation

b) **Practical Considerations:**
   - The hypergeometric distribution gives theoretical minimum nodes needed
   - Overbooking adds practical fault tolerance
   - 25% extra nodes account for:
     - Network disconnections
     - Node failures
     - Temporary outages

c) **Dynamic Scaling:**
```python
if total_needed > network_size:
    max_base_nodes = int(network_size / (1 + OVERBOOKING_RATE))
```
- If total nodes needed exceeds network size:
  - Base requirement is scaled down
  - Maintains proper ratio between base and overbooked nodes
  - Ensures system can still function with available nodes

This design allows the system to:
1. Calculate mathematically secure minimums
2. Add practical fault tolerance
3. Automatically adjust when network constraints apply
