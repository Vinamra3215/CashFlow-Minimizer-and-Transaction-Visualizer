export const getTotalCashFlow = (transactions) =>
  transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

export const getOptimizedCount = (animationSteps) =>
  animationSteps.filter((step) => step.type === 'transaction').length;

export const getReductionPercent = (optimizedCount, total, decimals = 0) => {
  if (total <= 0) {
    return (0).toFixed(decimals);
  }

  return ((1 - optimizedCount / total) * 100).toFixed(decimals);
};

export const getEfficiencyPercentValue = (transactionsCount, totalTransactions) => {
  if (totalTransactions <= 0) {
    return 0;
  }

  return 100 - (transactionsCount / totalTransactions * 100);
};
