// Benchmark runner for WASM-compiled C++ algorithms

const WARMUP_ITERATIONS = 5;
const BENCHMARK_ITERATIONS = 50;
const OUTLIER_TRIM_PERCENT = 0.1;

export const runWasmBenchmark = (wasmModule, funcName, netAmount) => {
  const inputJson = JSON.stringify(netAmount);

  // Warm-up runs to prime WASM
  for (let i = 0; i < WARMUP_ITERATIONS; i++) {
    wasmModule.ccall(funcName, 'string', ['string'], [inputJson]);
  }

  // Timed runs
  const times = [];
  let resultJson;

  for (let i = 0; i < BENCHMARK_ITERATIONS; i++) {
    const startTime = performance.now();
    resultJson = wasmModule.ccall(funcName, 'string', ['string'], [inputJson]);
    const endTime = performance.now();
    times.push(endTime - startTime);
  }

  // Statistical analysis - trim outliers
  times.sort((a, b) => a - b);
  const trimCount = Math.floor(BENCHMARK_ITERATIONS * OUTLIER_TRIM_PERCENT);
  const trimmedTimes = times.slice(trimCount, BENCHMARK_ITERATIONS - trimCount);

  const medianTime = trimmedTimes[Math.floor(trimmedTimes.length / 2)];
  const avgTime = trimmedTimes.reduce((a, b) => a + b, 0) / trimmedTimes.length;
  const minTime = trimmedTimes[0];
  const maxTime = trimmedTimes[trimmedTimes.length - 1];

  const result = JSON.parse(resultJson);

  return {
    result,
    executionTime: avgTime,
    medianTime,
    avgTime,
    allTimes: times,
    minTime,
    maxTime
  };
};
