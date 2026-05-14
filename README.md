# Cashflow Minimizer & Transaction Visualizer

A graph-based transaction optimization system developed as part of a Data Structures & Algorithms project.

The project minimizes the number of transactions required to settle debts between multiple participants while also providing a visualization of money flow before and after optimization.

---

## Problem Statement

In group expense systems, direct transactions between individuals can create unnecessarily complex payment chains.

Example:

Before Optimization:
- A pays B ₹500
- B pays C ₹500

Instead of performing 2 separate transactions, the same settlement can be simplified to:

After Optimization:
- A pays C ₹500

This project focuses on minimizing such redundant transactions efficiently.

---

## Features

- Cashflow minimization
- Debt settlement optimization
- Graph-based transaction modelling
- Visualization of transactions
- Efficient handling of multiple participants
- Modular implementation of algorithms

---

## Tech Stack

- C++
- STL
- Graph Algorithms
- Greedy Algorithms
- Data Structures

---

## Approach

The system works in the following steps:

1. Calculate the net balance of every participant.
   - Positive balance → amount to receive
   - Negative balance → amount to pay

2. Identify creditors and debtors.

3. Apply transaction minimization logic to reduce unnecessary intermediate payments.

4. Generate optimized transactions between entities.

5. Visualize the transaction flow before and after optimization.

---

## Example

### Initial Transactions

| Sender | Receiver | Amount |
|--------|----------|--------|
| A | B | 500 |
| B | C | 500 |

### Optimized Transactions

| Sender | Receiver | Amount |
|--------|----------|--------|
| A | C | 500 |

Number of transactions reduced from 2 to 1.

---

## Project Structure

```bash
DSA-Project/
│
├── src/                 # Core source files
├── visualization/       # Transaction visualization logic
├── algorithms/          # Optimization algorithms
├── utils/               # Helper functions
└── README.md
```

---

## Concepts Used

- Graph Representation
- Greedy Optimization
- Net Balance Computation
- Transaction Simplification
- Data Structures using STL

---

## Future Improvements

- GUI-based visualization
- Real-time transaction updates
- Web deployment
- Advanced optimization techniques
- Splitwise-like interface

---

## Contributors

- Devang
- Vinamra
- Darsh
- Gurtej

---

## Status

Project completed as part of an academic DSA project and currently being improved for better visualization and modularity.
