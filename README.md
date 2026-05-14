# CashFlow Minimizer and Transaction Visualizer

A Data Structures & Algorithms project focused on minimizing redundant cash transactions between multiple participants using graph-based optimization techniques and transaction visualization.

The system analyzes transactions, computes net balances for each participant, and generates an optimized settlement flow that reduces unnecessary intermediate payments.

---

# Objective

In group expense systems, direct transactions between individuals often create unnecessarily complex payment chains.

Example:

Initial Transactions:
- A pays B ₹500
- B pays C ₹500

Optimized Settlement:
- A pays C ₹500

The project minimizes such redundant transactions while preserving the final balance of every participant.

---

# Key Features

- Cashflow minimization
- Transaction simplification
- Graph-based payment modelling
- Debt settlement optimization
- Visualization of money flow
- Multi-user transaction handling
- Efficient balance computation

---

# Concepts Used

This project applies several DSA concepts including:

- Graph Representation
- Greedy Algorithms
- Net Balance Computation
- Transaction Optimization
- STL Data Structures

---

# Working Principle

## Step 1: Transaction Input

The system takes transactions between participants as input.

Example:

| Sender | Receiver | Amount |
|--------|----------|--------|
| A | B | 500 |
| B | C | 500 |

---

## Step 2: Net Balance Calculation

For every participant:

- Positive value → amount to receive
- Negative value → amount to pay

Example:

| Person | Net Balance |
|--------|-------------|
| A | -500 |
| B | 0 |
| C | +500 |

---

## Step 3: Cashflow Minimization

Instead of routing payments through intermediate participants, the algorithm directly settles balances between creditors and debtors.

Optimized Result:

| Sender | Receiver | Amount |
|--------|----------|--------|
| A | C | 500 |

This reduces:
- Number of transactions
- Settlement complexity
- Redundant money flow

---

# Visualization

The project also includes transaction visualization to compare:

- Original transaction flow
- Optimized settlement flow

This helps users better understand how transactions are reduced after optimization.

---

# Tech Stack

## Frontend
- HTML
- CSS
- JavaScript

## Backend / Logic
- C++
- STL

## Concepts & Algorithms
- Graph Algorithms
- Greedy Optimization
- Net Balance Computation
- Transaction Minimization

---

# Project Structure

```bash
.
├── frontend/                 # UI and visualization
├── backend/                  # Core transaction processing
├── algorithms/               # Cashflow minimization logic
├── assets/                   # Static assets and resources
└── README.md
```

---

# Applications

The concepts used in this project are similar to systems used in:

- Expense splitting applications
- Group payment systems
- Financial settlement systems
- Transaction optimization engines

---

# Future Improvements

- Interactive graph visualization
- Better UI/UX design
- Real-time transaction editing
- Improved scalability for larger datasets
- Additional optimization strategies

---

# Contributors

- Devang
- Vinamra
- Gurtej
- Darsh

---

# Status

Completed as part of a DSA course project and currently being improved for cleaner visualization and better modularity.
