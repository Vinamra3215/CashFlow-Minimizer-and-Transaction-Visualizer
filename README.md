# CashFlow Minimizer and Transaction Visualizer

A web-based transaction optimization and visualization system built using graph-based algorithms to minimize redundant cash transactions between multiple participants.

The project compares multiple cashflow minimization strategies, visualizes transaction graphs, and benchmarks algorithmic performance using isolated worker-thread execution.

---

# Overview

In group payment systems, transactions between participants often become unnecessarily complex.

Example:

Instead of:

- A → B → C

the system optimizes the flow into:

- A → C

thereby reducing:
- redundant transactions
- settlement complexity
- unnecessary intermediate transfers

---

# Features

- Cashflow minimization
- Interactive transaction visualization
- Multiple algorithm comparison
- Real-time performance benchmarking
- Graph-based settlement optimization
- Web Worker powered execution
- Optimized transaction flow generation

---

# Algorithms Implemented

The project compares different minimization approaches including:

- Greedy Algorithm
- Min Cash Flow Algorithm
- Priority Queue Based Approach
- Heap-Based Optimization
- Sorting-Based Optimization

Each algorithm is benchmarked based on:
- transaction reduction
- execution time
- efficiency
- cash flow optimization

---

# Tech Stack

## Frontend
- HTML
- CSS
- JavaScript

## Concepts Used
- Graph Algorithms
- Greedy Optimization
- Heap/Priority Queue Concepts
- Net Balance Computation
- Transaction Minimization
- Web Workers

---

# Algorithm Comparison

The platform benchmarks different optimization techniques and compares their efficiency.

## Comparison Dashboard

![Algorithm Comparison](assets/algorithm-comparison.png)

---

# Transaction Visualization

## Original Transaction Flow

![Original Transaction Flow](assets/original-graph.png)

## Optimized Transaction Flow

![Optimized Transaction Flow](assets/optimized-graph.png)

The optimized graph significantly reduces unnecessary intermediate transactions while preserving final balances.

---

# Working Principle

## Step 1: Transaction Input

Transactions between multiple participants are provided as input.

---

## Step 2: Net Balance Calculation

For each participant:
- Positive balance → amount to receive
- Negative balance → amount to pay

---

## Step 3: Cashflow Minimization

The algorithms directly settle balances between debtors and creditors while minimizing transaction count and total flow complexity.

---

## Step 4: Visualization & Benchmarking

The project visualizes:
- original transaction graph
- optimized transaction graph
- algorithm performance metrics

Benchmarking is performed using Web Workers to avoid UI blocking and ensure accurate timing measurements.

---

# Applications

The concepts used in this project are relevant to:

- Expense splitting applications
- Financial settlement systems
- Payment optimization engines
- Group transaction platforms

---

# Future Improvements

- Dynamic graph editing
- Real-time collaborative settlements
- Larger dataset optimization
- Advanced graph analytics
- Backend integration and database support

---

# Contributors

- Devang
- Vinamra
- Gurtej
- Darsh

---

# Status

Completed as part of a Data Structures & Algorithms course project and currently being improved for scalability, visualization, and modularity.