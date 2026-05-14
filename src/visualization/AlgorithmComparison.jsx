import BenchmarkPanel from '../components/BenchmarkPanel.jsx';
import { ALGORITHM_LABELS } from '../utils/algorithmLabels';
import { formatCurrency, formatDecimal } from '../utils/formatters';
import { getEfficiencyPercentValue } from '../utils/transactionMetrics';

const AlgorithmComparison = ({ algorithmResults, transactionsLength }) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl mb-6">
      <h3 className="text-2xl font-bold text-white mb-4">📊 Algorithm Comparison</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-white">
          <thead>
            <tr className="border-b border-white/20">
              <th className="px-4 py-3 text-left">Algorithm</th>
              <th className="px-4 py-3 text-center">Transactions</th>
              <th className="px-4 py-3 text-center">Reduction %</th>
              <th className="px-4 py-3 text-center">Cash Flow</th>
              <th className="px-4 py-3 text-center">Avg Time (ms)</th>
              <th className="px-4 py-3 text-center">Efficiency</th>
            </tr>
          </thead>
          <tbody>
            {[...algorithmResults]
              .sort((a, b) => {
                if (a.transactions !== b.transactions) return a.transactions - b.transactions;
                if (a.totalCashFlow !== b.totalCashFlow) return a.totalCashFlow - b.totalCashFlow;
                return a.executionTime - b.executionTime;
              })
              .map((result, idx) => {
                const efficiencyPercent = getEfficiencyPercentValue(result.transactions, transactionsLength);
                const isBest = idx === 0;
                return (
                  <tr
                    key={result.algorithm}
                    className={`border-b border-white/10 ${isBest ? 'bg-green-500/20' : ''}`}
                  >
                    <td className="px-4 py-3 font-semibold">
                      {ALGORITHM_LABELS[result.algorithm]}
                      {isBest && <span className="ml-2 text-yellow-400">👑</span>}
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-green-400">
                      {result.transactions}
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-pink-400">
                      {result.reduction}%
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-teal-400">
                      {formatCurrency(result.totalCashFlow)}
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-blue-400">
                      {formatDecimal(result.executionTime, 4)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-24 bg-white/10 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-400 to-cyan-500 h-2 rounded-full"
                            style={{ width: `${efficiencyPercent}%` }}
                          />
                        </div>
                        <span className="text-xs">{formatDecimal(efficiencyPercent, 0)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <BenchmarkPanel />
    </div>
  );
};

export default AlgorithmComparison;
