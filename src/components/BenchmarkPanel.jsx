const BenchmarkPanel = () => {
  return (
    <div className="mt-4 bg-blue-500/10 border border-blue-400/30 p-4 rounded-xl">
      <p className="text-blue-200 text-sm text-center">
        <span className="font-bold">⚡ Web Worker Powered:</span> Each algorithm runs 50 times in an isolated thread after 5 warm-up runs.
        Average time (with outliers removed) in milliseconds ensures accurate, consistent performance measurements without UI interference.
      </p>
    </div>
  );
};

export default BenchmarkPanel;
