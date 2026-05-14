import greedyAlgorithm from '../algorithms/greedyAlgorithm';
import heapBasedAlgorithm from '../algorithms/heapBasedAlgorithm';
import minCashFlowAlgorithm from '../algorithms/minCashFlowAlgorithm';
import priorityQueueAlgorithm from '../algorithms/priorityQueueAlgorithm';
import sortingBasedAlgorithm from '../algorithms/sortingBasedAlgorithm';
import { runBenchmark } from './benchmarkRunner';

const ALGORITHM_LOOKUP = {
  greedy: greedyAlgorithm,
  heapBased: heapBasedAlgorithm,
  sorting: sortingBasedAlgorithm,
  minCashFlow: minCashFlowAlgorithm,
  priorityQueue: priorityQueueAlgorithm
};

self.onmessage = (event) => {
  const { algorithm, netAmount } = event.data;
  const selectedAlgorithm = ALGORITHM_LOOKUP[algorithm] || greedyAlgorithm;

  self.postMessage(runBenchmark(selectedAlgorithm, netAmount));
};
