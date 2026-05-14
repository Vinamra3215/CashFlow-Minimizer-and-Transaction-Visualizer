import { Zap } from 'lucide-react';
import GraphVisualization from './GraphVisualization.jsx';

const GraphPanel = ({
  isAnimating,
  showResults,
  currentStep,
  animationSteps,
  animationSpeed,
  onAnimationSpeedChange,
  people,
  transactions,
  balances,
  stepMessage
}) => {
  return (
    <div className="lg:col-span-2 bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">
          {!isAnimating && !showResults && 'Original Transaction Graph'}
          {isAnimating && 'Algorithm Visualization in Progress...'}
          {showResults && 'Optimized Transaction Graph'}
        </h2>
        {isAnimating && (
          <div className="bg-green-500/20 px-4 py-2 rounded-full animate-pulse">
            <span className="text-green-400 font-bold">
              Step {currentStep + 1} / {animationSteps.length}
            </span>
          </div>
        )}
      </div>

      {isAnimating && (
        <div className="mb-4 bg-white/5 p-4 rounded-xl border border-white/10">
          <label className="block text-white mb-2 font-semibold text-sm">
            Animation Speed: {animationSpeed}ms per step
          </label>
          <input
            type="range"
            min="300"
            max="3000"
            step="100"
            value={animationSpeed}
            onChange={(event) => onAnimationSpeedChange(parseInt(event.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-white/50 text-xs mt-1">
            <span>Fast (300ms)</span>
            <span>Slow (3000ms)</span>
          </div>
        </div>
      )}

      <div className="bg-slate-900/50 rounded-xl p-4" style={{ height: '600px' }}>
        <GraphVisualization
          people={people}
          transactions={transactions}
          animationSteps={animationSteps}
          currentStep={currentStep}
          showOptimized={isAnimating || showResults}
          balances={balances}
        />
      </div>

      {isAnimating && stepMessage && (
        <div className="mt-4 bg-gradient-to-r from-green-500/20 to-cyan-500/20 p-4 rounded-xl animate-pulse border border-green-400/30">
          <div className="flex items-center gap-3">
            <Zap className="text-yellow-400" size={24} />
            <p className="text-white text-center text-lg flex-1">
              {stepMessage}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphPanel;
