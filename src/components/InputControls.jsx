import { Users, Sparkles, Play, RotateCcw, Download, Upload, Shuffle } from 'lucide-react';
import { ALGORITHM_CATALOG } from '../config/algorithmCatalog';

const InputControls = ({
  people,
  transactions,
  selectedAlgorithm,
  isAnimating,
  showResults,
  personName,
  fromPerson,
  toPerson,
  amount,
  customVertexCount,
  showCustomGenerator,
  onAlgorithmChange,
  onPersonNameChange,
  onFromPersonChange,
  onToPersonChange,
  onAmountChange,
  onCustomVertexCountChange,
  onToggleCustomGenerator,
  onAddPerson,
  onAddTransaction,
  onGenerateRandom,
  onGenerateCustomRandom,
  onMinimizeCashFlow,
  onReset,
  onSaveState,
  onLoadState,
  onClearAll,
  getPersonColor
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Sparkles className="text-yellow-400" />
        Configuration
      </h2>

      <div className="mb-6">
        <label className="block text-white mb-2 font-semibold">Select Algorithm</label>
        <select
          value={selectedAlgorithm}
          onChange={(event) => onAlgorithmChange(event.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          disabled={isAnimating}
        >
          {ALGORITHM_CATALOG.map(({ id, controlLabel }) => (
            <option key={id} value={id} className="bg-slate-700">
              {controlLabel}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-white mb-2 font-semibold">Add Person</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={personName}
            onChange={(event) => onPersonNameChange(event.target.value)}
            onKeyPress={(event) => event.key === 'Enter' && onAddPerson()}
            placeholder="Name"
            className="flex-1 px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            disabled={isAnimating}
          />
          <button
            onClick={onAddPerson}
            disabled={isAnimating}
            className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-bold hover:scale-105 transition-transform disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </div>

      {people.length > 0 && (
        <div className="mb-6">
          <p className="text-white/70 mb-2">People ({people.length}):</p>
          <div className="flex flex-wrap gap-2">
            {people.map((person, idx) => (
              <span
                key={idx}
                className="px-4 py-2 rounded-full text-white font-semibold shadow-lg"
                style={{ backgroundColor: getPersonColor(people, person) }}
              >
                {person}
              </span>
            ))}
          </div>
        </div>
      )}

      {people.length >= 2 && (
        <div className="space-y-3">
          <label className="block text-white font-semibold">Add Transaction</label>
          <select
            value={fromPerson}
            onChange={(event) => onFromPersonChange(event.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            disabled={isAnimating}
          >
            <option value="" className="bg-slate-700">From</option>
            {people.map((person, idx) => (
              <option key={idx} value={person} className="bg-slate-700">{person}</option>
            ))}
          </select>
          <select
            value={toPerson}
            onChange={(event) => onToPersonChange(event.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            disabled={isAnimating}
          >
            <option value="" className="bg-slate-700">To</option>
            {people.map((person, idx) => (
              <option key={idx} value={person} className="bg-slate-700">{person}</option>
            ))}
          </select>
          <input
            type="number"
            value={amount}
            onChange={(event) => onAmountChange(event.target.value)}
            placeholder="Amount"
            className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            disabled={isAnimating}
          />
          <button
            onClick={onAddTransaction}
            disabled={isAnimating}
            className="w-full px-6 py-3 bg-gradient-to-r from-green-400 to-cyan-500 text-white rounded-xl font-bold hover:scale-105 transition-transform disabled:opacity-50"
          >
            Add Transaction
          </button>
        </div>
      )}

      {transactions.length > 0 && (
        <div className="mt-6">
          <p className="text-white/70 mb-2">Transactions ({transactions.length}):</p>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {transactions.map((txn, idx) => (
              <div key={idx} className="bg-white/10 p-2 rounded-lg text-sm">
                <span className="text-white">
                  <span style={{ color: getPersonColor(people, txn.from) }} className="font-bold">{txn.from}</span>
                  {' → '}
                  <span style={{ color: getPersonColor(people, txn.to) }} className="font-bold">{txn.to}</span>
                  {' '}
                  <span className="text-yellow-400 font-bold">${txn.amount.toFixed(0)}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 space-y-3">
        <button
          onClick={onGenerateRandom}
          disabled={isAnimating}
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:scale-105 transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Shuffle size={20} />
          Quick Random (4-6 people)
        </button>

        <button
          onClick={onToggleCustomGenerator}
          disabled={isAnimating}
          className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-bold hover:scale-105 transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Users size={20} />
          Custom Random Generator
        </button>

        {showCustomGenerator && (
          <div className="bg-white/5 p-4 rounded-xl space-y-3 border border-white/10">
            <label className="block text-white font-semibold">
              Number of People: {customVertexCount}
            </label>
            <input
              type="range"
              min="2"
              max="20"
              value={customVertexCount}
              onChange={(event) => onCustomVertexCountChange(parseInt(event.target.value))}
              className="w-full"
              disabled={isAnimating}
            />
            <div className="flex justify-between text-white/50 text-xs">
              <span>2</span>
              <span>20</span>
            </div>
            <button
              onClick={onGenerateCustomRandom}
              disabled={isAnimating}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-400 to-cyan-500 text-white rounded-xl font-bold hover:scale-105 transition-transform disabled:opacity-50"
            >
              Generate with {customVertexCount} People
            </button>
          </div>
        )}

        {transactions.length > 0 && (
          <button
            onClick={onMinimizeCashFlow}
            disabled={isAnimating}
            className="w-full px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold hover:scale-105 transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Play size={20} />
            {isAnimating
              ? 'Optimizing...'
              : showResults
                ? 'Run Selected Algorithm'
                : 'Start Optimization'}
          </button>
        )}

        {(isAnimating || showResults) && (
          <button
            onClick={onReset}
            className="w-full px-6 py-3 bg-white/20 text-white rounded-xl font-bold hover:bg-white/30 transition flex items-center justify-center gap-2"
          >
            <RotateCcw size={20} />
            Reset Animation
          </button>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onSaveState}
            disabled={isAnimating || people.length === 0}
            className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-xl font-bold hover:bg-blue-500/30 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Download size={16} />
            Save
          </button>
          <label className="px-4 py-2 bg-green-500/20 text-green-300 rounded-xl font-bold hover:bg-green-500/30 transition cursor-pointer flex items-center justify-center gap-2">
            <Upload size={16} />
            Load
            <input
              type="file"
              accept=".json"
              onChange={onLoadState}
              className="hidden"
              disabled={isAnimating}
            />
          </label>
        </div>

        <button
          onClick={onClearAll}
          disabled={isAnimating}
          className="w-full px-6 py-3 bg-red-500/20 text-red-300 rounded-xl font-bold hover:bg-red-500/30 transition disabled:opacity-50"
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default InputControls;
