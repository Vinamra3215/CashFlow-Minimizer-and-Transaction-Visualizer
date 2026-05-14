const cloneNetAmount = (netAmount, iterations) => {
  const cloned = [];
  for (let i = 0; i < iterations; i++) {
    cloned.push(JSON.parse(JSON.stringify(netAmount)));
  }
  return cloned;
};

export const runBenchmark = (algorithm, netAmount) => {
  for (let i = 0; i < 5; i++) {
    const warmupData = JSON.parse(JSON.stringify(netAmount));
    algorithm(warmupData);
  }

  const iterations = 50;
  const clonedData = cloneNetAmount(netAmount, iterations);

  const times = [];
  let result;

  for (let i = 0; i < iterations; i++) {
    const startTime = performance.now();
    result = algorithm(clonedData[i]);
    const endTime = performance.now();
    times.push(endTime - startTime);
  }

  times.sort((a, b) => a - b);

  const trimCount = Math.floor(iterations * 0.1);
  const trimmedTimes = times.slice(trimCount, iterations - trimCount);

  const medianTime = trimmedTimes[Math.floor(trimmedTimes.length / 2)];
  const avgTime = trimmedTimes.reduce((a, b) => a + b, 0) / trimmedTimes.length;
  const minTime = trimmedTimes[0];
  const maxTime = trimmedTimes[trimmedTimes.length - 1];

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
