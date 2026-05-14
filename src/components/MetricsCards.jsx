import { formatCurrency, formatDecimal } from '../utils/formatters';
import { getOptimizedCount, getReductionPercent } from '../utils/transactionMetrics';

const MetricsCards = ({ transactions, animationSteps, algorithmResults, selectedAlgorithm }) => {
  const optimizedCount = getOptimizedCount(animationSteps);
  const reductionPercent = getReductionPercent(optimizedCount, transactions.length, 0);
  const currentResult = algorithmResults.find((result) => result.algorithm === selectedAlgorithm);

  return (
    <div className="grid grid-cols-5 gap-4">
      <div className="text-center bg-gradient-to-br from-yellow-500/20 to-orange-500/20 p-6 rounded-xl">
        <p className="text-4xl font-bold text-yellow-400 mb-2">{transactions.length}</p>
        <p className="text-white/70 font-semibold text-sm">Original Transactions</p>
      </div>
      <div className="text-center bg-gradient-to-br from-green-500/20 to-cyan-500/20 p-6 rounded-xl">
        <p className="text-4xl font-bold text-green-400 mb-2">
          {optimizedCount}
        </p>
        <p className="text-white/70 font-semibold text-sm">Optimized Transactions</p>
      </div>
      <div className="text-center bg-gradient-to-br from-pink-500/20 to-purple-500/20 p-6 rounded-xl">
        <p className="text-4xl font-bold text-pink-400 mb-2">
          {reductionPercent}%
        </p>
        <p className="text-white/70 font-semibold text-sm">Transaction Reduction</p>
      </div>
      <div className="text-center bg-gradient-to-br from-blue-500/20 to-indigo-500/20 p-6 rounded-xl">
        <p className="text-4xl font-bold text-blue-400 mb-2">
          {currentResult ? formatDecimal(currentResult.executionTime, 4) : 0}
        </p>
        <p className="text-white/70 font-semibold text-sm">Avg Time (ms)</p>
      </div>
      <div className="text-center bg-gradient-to-br from-teal-500/20 to-emerald-500/20 p-6 rounded-xl">
        <p className="text-4xl font-bold text-teal-400 mb-2">
          {currentResult ? formatCurrency(currentResult.totalCashFlow) : '$0'}
        </p>
        <p className="text-white/70 font-semibold text-sm">Total Cash Flow</p>
      </div>
    </div>
  );
};

export default MetricsCards;
