// Web Worker: Runs DSA algorithms off the main thread with benchmarking
// Uses the JavaScript algorithm implementations directly

import greedyAlgorithm from '../algorithms/greedyAlgorithm.js';
import heapBasedAlgorithm from '../algorithms/heapBasedAlgorithm.js';
import sortingBasedAlgorithm from '../algorithms/sortingBasedAlgorithm.js';
import minCashFlowAlgorithm from '../algorithms/minCashFlowAlgorithm.js';
import priorityQueueAlgorithm from '../algorithms/priorityQueueAlgorithm.js';

const ALGORITHM_MAP = {
  greedy: greedyAlgorithm,
  heapBased: heapBasedAlgorithm,
  sorting: sortingBasedAlgorithm,
  minCashFlow: minCashFlowAlgorithm,
  priorityQueue: priorityQueueAlgorithm
};

const WARMUP_ITERATIONS = 10;
const BENCHMARK_ITERATIONS = 20;
const BATCH_SIZE = 5000; // Run algorithm this many times per benchmark iteration
const OUTLIER_TRIM_PERCENT = 0.1;

// Signal that the worker is ready
postMessage({ type: 'ready' });

self.onmessage = (event) => {
  const { algorithm, netAmount } = event.data;
  const algorithmFn = ALGORITHM_MAP[algorithm] || ALGORITHM_MAP.greedy;

  // Deep-copy helper — netAmount is mutated by algorithms
  const cloneInput = () => JSON.parse(JSON.stringify(netAmount));

  // Get the final result from one clean run (for steps/transactions)
  const result = algorithmFn(cloneInput());

  // Warm-up runs to let the JS engine JIT-compile
  for (let i = 0; i < WARMUP_ITERATIONS; i++) {
    algorithmFn(cloneInput());
  }

  // Timed benchmark runs — batch many runs per measurement to overcome
  // performance.now() timer granularity (~0.1ms in most browsers)
  const times = [];

  for (let i = 0; i < BENCHMARK_ITERATIONS; i++) {
    const startTime = performance.now();
    for (let j = 0; j < BATCH_SIZE; j++) {
      algorithmFn(cloneInput());
    }
    const endTime = performance.now();
    // Time per single run in milliseconds
    times.push((endTime - startTime) / BATCH_SIZE);
  }

  // Statistical analysis — trim outliers
  times.sort((a, b) => a - b);
  const trimCount = Math.floor(BENCHMARK_ITERATIONS * OUTLIER_TRIM_PERCENT);
  const trimmedTimes = times.slice(trimCount, BENCHMARK_ITERATIONS - trimCount);

  const avgTime = trimmedTimes.reduce((a, b) => a + b, 0) / trimmedTimes.length;
  const minTime = trimmedTimes[0];
  const maxTime = trimmedTimes[trimmedTimes.length - 1];

  self.postMessage({
    result,
    executionTime: avgTime,
    avgTime,
    allTimes: times,
    minTime,
    maxTime
  });
};
