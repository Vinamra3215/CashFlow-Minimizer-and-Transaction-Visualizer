// Web Worker: Loads C++ WASM algorithms and handles benchmarking
// The DSA algorithms run in C++ (WebAssembly), benchmarking stays in JS

import { runWasmBenchmark } from './benchmarkRunner.js';

// C++ function names mapped to algorithm keys
const WASM_FUNC_MAP = {
  greedy: 'run_greedy',
  heapBased: 'run_heap_based',
  sorting: 'run_sorting',
  minCashFlow: 'run_min_cashflow',
  priorityQueue: 'run_priority_queue'
};

let wasmModule = null;

// Load the Emscripten-compiled WASM module
async function initWasm() {
  const response = await fetch('/algorithms.wasm');
  const wasmBytes = await response.arrayBuffer();

  // Load the Emscripten glue code
  const glueResponse = await fetch('/algorithms.js');
  const glueCode = await glueResponse.text();

  // Evaluate the glue code to get the module factory
  const moduleFactory = new Function(glueCode + '; return AlgorithmsModule;')();

  wasmModule = await moduleFactory({
    wasmBinary: wasmBytes
  });

  postMessage({ type: 'ready' });
}

initWasm();

self.onmessage = (event) => {
  if (!wasmModule) {
    console.error('WASM module not ready yet');
    return;
  }

  const { algorithm, netAmount } = event.data;
  const funcName = WASM_FUNC_MAP[algorithm] || WASM_FUNC_MAP.greedy;

  self.postMessage(runWasmBenchmark(wasmModule, funcName, netAmount));
};
