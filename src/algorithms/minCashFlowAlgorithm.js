const minCashFlowAlgorithm = (netAmount) => {
  const steps = [];
  const balances = [];

  Object.entries(netAmount).forEach(([person, amount]) => {
    if (Math.abs(amount) > 0.01) {
      balances.push({ person, amount });
    }
  });

  if (balances.length === 0) {
    return { transactions: [], steps: [{ type: 'info', message: 'No transactions needed' }] };
  }

  steps.push({ type: 'info', message: 'Finding optimal solution recursively' });

  const minimized = [];

  const minTransactions = (workingBalances) => {
    let maxCredit = 0;
    let maxDebit = 0;
    let maxCreditIdx = -1;
    let maxDebitIdx = -1;

    steps.push({ type: 'consider', people: workingBalances.map((b) => b.person) });

    for (let i = 0; i < workingBalances.length; i++) {
      if (workingBalances[i].amount > maxCredit) {
        maxCredit = workingBalances[i].amount;
        maxCreditIdx = i;
      }
      if (workingBalances[i].amount < maxDebit) {
        maxDebit = workingBalances[i].amount;
        maxDebitIdx = i;
      }
    }

    if (maxCredit === 0 && maxDebit === 0) {
      steps.push({ type: 'info', message: 'All balances settled' });
      return;
    }

    steps.push({
      type: 'select',
      creditor: workingBalances[maxCreditIdx].person,
      debtor: workingBalances[maxDebitIdx].person,
      message: `Max creditor: ${workingBalances[maxCreditIdx].person}, Max debtor: ${workingBalances[maxDebitIdx].person}`
    });

    const settleAmount = Math.min(maxCredit, -maxDebit);
    const transaction = {
      from: workingBalances[maxDebitIdx].person,
      to: workingBalances[maxCreditIdx].person,
      amount: settleAmount
    };

    minimized.push(transaction);
    steps.push({
      type: 'transaction',
      ...transaction,
      message: `Recursive step: ${settleAmount.toFixed(2)}`
    });

    workingBalances[maxCreditIdx].amount -= settleAmount;
    workingBalances[maxDebitIdx].amount += settleAmount;

    minTransactions(workingBalances);
  };

  minTransactions(balances);
  return { transactions: minimized, steps };
};

export default minCashFlowAlgorithm;
