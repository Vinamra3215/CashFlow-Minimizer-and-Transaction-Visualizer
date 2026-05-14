import { useState } from 'react';
import { Users } from 'lucide-react';
import AlgorithmComparison from './visualization/AlgorithmComparison.jsx';
import AlgorithmDetails from './visualization/AlgorithmDetails.jsx';
import OptimizationSummary from './visualization/OptimizationSummary.jsx';
import { buildNetAmount } from './algorithms/netAmount';
import { useAnimationPlayback } from './hooks/useAnimationPlayback';
import { useCashFlowBenchmark } from './hooks/useCashFlowBenchmark';
import { generateCustomRandomScenario, generateQuickRandomScenario } from './utils/randomData';
import { downloadCashFlowState, readCashFlowStateFile } from './services/cashFlowStateStorage';
import { getStepMessage } from './utils/stepUtils';
import { getReductionPercent, getTotalCashFlow } from './utils/transactionMetrics';
import { getPersonColor } from './utils/colorUtils';
import InputControls from './components/InputControls.jsx';
import GraphPanel from './visualization/GraphPanel.jsx';

// Cash Flow Minimizer Component with Web Worker
const CashFlowMinimizer = () => {
  const [people, setPeople] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('greedy');
  const [algorithmResults, setAlgorithmResults] = useState([]);
  const [currentBalances, setCurrentBalances] = useState({});

  const [personName, setPersonName] = useState('');
  const [fromPerson, setFromPerson] = useState('');
  const [toPerson, setToPerson] = useState('');
  const [amount, setAmount] = useState('');
  const [customVertexCount, setCustomVertexCount] = useState(5);
  const [showCustomGenerator, setShowCustomGenerator] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1500);

  const {
    currentStep,
    isAnimating,
    animationSteps,
    showResults,
    prepareAnimation,
    playAnimation,
    resetAnimation
  } = useAnimationPlayback();
  const { runBenchmark } = useCashFlowBenchmark();

  const addPerson = () => {
    if (personName.trim() && !people.includes(personName.trim())) {
      setPeople([...people, personName.trim()]);
      setPersonName('');
    }
  };

  const addTransaction = () => {
    if (fromPerson && toPerson && amount && fromPerson !== toPerson) {
      setTransactions([...transactions, { from: fromPerson, to: toPerson, amount: parseFloat(amount) }]);
      setFromPerson('');
      setToPerson('');
      setAmount('');
    }
  };

  const generateRandom = () => {
    const { people: generatedPeople, transactions: generatedTransactions } = generateQuickRandomScenario();
    setPeople(generatedPeople);
    setTransactions(generatedTransactions);
    reset();
  };

  const generateCustomRandom = () => {
    const { people: generatedPeople, transactions: generatedTransactions } = generateCustomRandomScenario(customVertexCount);
    setPeople(generatedPeople);
    setTransactions(generatedTransactions);
    setShowCustomGenerator(false);
    reset();
  };

  const saveState = () => {
    downloadCashFlowState({ people, transactions });
  };

  const loadState = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const state = await readCashFlowStateFile(file);
      setPeople(state.people);
      setTransactions(state.transactions);
      reset();
    } catch {
      alert('Invalid file format');
    }
  };

  const minimizeCashFlow = async () => {
    if (people.length === 0 || transactions.length === 0) return;

    prepareAnimation();

    const netAmount = buildNetAmount(people, transactions);

    setCurrentBalances(netAmount);

    try {
      const { result, executionTime, avgTime, allTimes, minTime, maxTime } = await runBenchmark(selectedAlgorithm, netAmount);
      const totalCashFlow = getTotalCashFlow(result.transactions);

      const newResult = {
        algorithm: selectedAlgorithm,
        transactions: result.transactions.length,
        executionTime,
        avgTime,
        minTime,
        maxTime,
        allTimes,
        reduction: getReductionPercent(result.transactions.length, transactions.length, 1),
        totalCashFlow
      };

      setAlgorithmResults((prev) => {
        const resultsForOtherAlgorithms = prev.filter((result) => result.algorithm !== selectedAlgorithm);
        return [...resultsForOtherAlgorithms, newResult];
      });

      playAnimation(result.steps, animationSpeed);
    } catch {
      reset();
      alert('Unable to run cash flow benchmark');
    }
  };

  const reset = () => {
    resetAnimation();
    setCurrentBalances({});
  };

  const clearAll = () => {
    reset();
    setPeople([]);
    setTransactions([]);
    setAlgorithmResults([]);
  };

  const currentStepMessage = getStepMessage(animationSteps, currentStep);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="text-yellow-400" size={48} />
            <h1 className="text-5xl font-bold text-white">Cash Flow Minimizer</h1>
          </div>
          <p className="text-blue-200 text-lg">Multi-Algorithm Graph Visualization with Web Worker-Powered Timing</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <InputControls
            people={people}
            transactions={transactions}
            selectedAlgorithm={selectedAlgorithm}
            isAnimating={isAnimating}
            showResults={showResults}
            personName={personName}
            fromPerson={fromPerson}
            toPerson={toPerson}
            amount={amount}
            customVertexCount={customVertexCount}
            showCustomGenerator={showCustomGenerator}
            onAlgorithmChange={setSelectedAlgorithm}
            onPersonNameChange={setPersonName}
            onFromPersonChange={setFromPerson}
            onToPersonChange={setToPerson}
            onAmountChange={setAmount}
            onCustomVertexCountChange={setCustomVertexCount}
            onToggleCustomGenerator={() => setShowCustomGenerator((prev) => !prev)}
            onAddPerson={addPerson}
            onAddTransaction={addTransaction}
            onGenerateRandom={generateRandom}
            onGenerateCustomRandom={generateCustomRandom}
            onMinimizeCashFlow={minimizeCashFlow}
            onReset={reset}
            onSaveState={saveState}
            onLoadState={loadState}
            onClearAll={clearAll}
            getPersonColor={getPersonColor}
          />

          <GraphPanel
            isAnimating={isAnimating}
            showResults={showResults}
            currentStep={currentStep}
            animationSteps={animationSteps}
            animationSpeed={animationSpeed}
            onAnimationSpeedChange={setAnimationSpeed}
            people={people}
            transactions={transactions}
            balances={currentBalances}
            stepMessage={currentStepMessage}
          />
        </div>

        {showResults && (
          <>
            <OptimizationSummary
              transactions={transactions}
              animationSteps={animationSteps}
              algorithmResults={algorithmResults}
              selectedAlgorithm={selectedAlgorithm}
            />
            {algorithmResults.length > 1 && (
              <AlgorithmComparison
                algorithmResults={algorithmResults}
                transactionsLength={transactions.length}
              />
            )}
            <AlgorithmDetails />
          </>
        )}
      </div>
    </div>
  );
};

export default CashFlowMinimizer;
