import { useCallback, useEffect, useRef } from 'react';

export const useCashFlowBenchmark = () => {
  const workerRef = useRef(null);

  useEffect(() => {
    workerRef.current = new Worker(new URL('../workers/cashFlowWorker.js', import.meta.url), {
      type: 'module'
    });

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const runBenchmark = useCallback((algorithm, netAmount) => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        reject(new Error('Cash flow worker is not initialized'));
        return;
      }

      workerRef.current.onmessage = (event) => {
        // Skip the WASM initialization 'ready' message
        if (event.data.type === 'ready') return;
        resolve(event.data);
      };
      workerRef.current.onerror = (error) => reject(error);
      workerRef.current.postMessage({ algorithm, netAmount });
    });
  }, []);

  return { runBenchmark };
};
