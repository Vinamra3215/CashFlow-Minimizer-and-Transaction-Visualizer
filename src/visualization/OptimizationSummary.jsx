import MetricsCards from '../components/MetricsCards.jsx';

const OptimizationSummary = ({ transactions, animationSteps, algorithmResults, selectedAlgorithm }) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl mb-6">
      <h3 className="text-2xl font-bold text-white mb-4 text-center">✨ Optimization Complete!</h3>
      <MetricsCards
        transactions={transactions}
        animationSteps={animationSteps}
        algorithmResults={algorithmResults}
        selectedAlgorithm={selectedAlgorithm}
      />
    </div>
  );
};

export default OptimizationSummary;
