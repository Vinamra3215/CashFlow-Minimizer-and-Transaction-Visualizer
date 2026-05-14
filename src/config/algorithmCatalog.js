export const ALGORITHM_CATALOG = [
  {
    id: 'greedy',
    label: 'Greedy',
    controlLabel: 'Greedy Algorithm',
    cardClass: 'bg-gradient-to-br from-purple-500/20 to-pink-500/20',
    description: 'Matches creditors with debtors iteratively. Minimizes both transaction count and cash flow by settling largest amounts first.',
    complexity: 'Time: O(N^2) | Space: O(N)'
  },
  {
    id: 'heapBased',
    label: 'Heap-Based',
    controlLabel: 'Heap-Based',
    cardClass: 'bg-gradient-to-br from-green-500/20 to-cyan-500/20',
    description: 'Uses max-heap property with re-sorting. Prioritizes largest balances to minimize transactions efficiently.',
    complexity: 'Time: O(N log N) | Space: O(N)'
  },
  {
    id: 'sorting',
    label: 'Sorting',
    controlLabel: 'Sorting-Based',
    cardClass: 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20',
    description: 'Single sort with two-pointer technique. Efficiently matches opposite balances to minimize both metrics.',
    complexity: 'Time: O(N log N) | Space: O(N)'
  },
  {
    id: 'priorityQueue',
    label: 'Priority Queue',
    controlLabel: 'Priority Queue',
    cardClass: 'bg-gradient-to-br from-teal-500/20 to-emerald-500/20',
    description: 'Maintains dynamic priority queues. Optimal for minimizing transactions while keeping cash flow minimal.',
    complexity: 'Time: O(N log N) | Space: O(N)'
  },
  {
    id: 'minCashFlow',
    label: 'Min Cash Flow',
    controlLabel: 'Min Cash Flow Recursive',
    cardClass: 'bg-gradient-to-br from-orange-500/20 to-red-500/20',
    description: 'Recursive optimal solution. Finds minimum transactions by exploring maximum creditor-debtor pairs.',
    complexity: 'Time: O(N^2) | Space: O(N)'
  }
];

export const ALGORITHM_LABELS = Object.fromEntries(
  ALGORITHM_CATALOG.map(({ id, label }) => [id, label])
);

export const ALGORITHM_DETAILS = [
  ...ALGORITHM_CATALOG.map(({ label, cardClass, description, complexity }) => ({
    title: label === 'Min Cash Flow' ? 'Min Cash Flow Recursive' : `${label} Algorithm`,
    cardClass,
    description,
    detail: complexity
  })),
  {
    title: 'Web Worker Benefits',
    cardClass: 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20',
    description: 'Isolated thread execution eliminates UI interference. Multiple runs with warm-up ensure accurate, reproducible timing.',
    detail: 'Consistent Performance ⚡'
  }
];
