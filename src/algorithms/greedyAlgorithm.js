const greedyAlgorithm = (netAmount) => {
  const steps = [];
  const balances = [];

  Object.entries(netAmount).forEach(([person, amount]) => {
    if (Math.abs(amount) > 0.01) {
      balances.push({ person, amount });
    }
  });

  steps.push({ type: 'info', message: 'Starting greedy algorithm - optimized O(N^2) with simple linear scans' });
  steps.push({ type: 'consider', people: balances.map((b) => b.person) });

  const minimized = [];

  while (true) {
    let maxCreditIdx = -1;
    let maxDebitIdx = -1;
    let maxCredit = 0;
    let maxDebit = 0;

    for (let i = 0; i < balances.length; i++) {
      if (balances[i].amount > maxCredit) {
        maxCredit = balances[i].amount;
        maxCreditIdx = i;
      }
      if (balances[i].amount < -maxDebit) {
        maxDebit = -balances[i].amount;
        maxDebitIdx = i;
      }
    }

    if (maxCredit < 0.01 && maxDebit < 0.01) {
      steps.push({ type: 'info', message: 'All balances settled' });
      break;
    }

    const creditor = balances[maxCreditIdx];
    const debtor = balances[maxDebitIdx];

    steps.push({
      type: 'select',
      creditor: creditor.person,
      debtor: debtor.person,
      message: `Greedy: Found max creditor ${creditor.person} (${creditor.amount.toFixed(0)}) and max debtor ${debtor.person} (${Math.abs(debtor.amount).toFixed(0)})`
    });

    const settleAmount = Math.min(creditor.amount, maxDebit);
    const transaction = {
      from: debtor.person,
      to: creditor.person,
      amount: settleAmount
    };

    minimized.push(transaction);
    steps.push({
      type: 'transaction',
      ...transaction,
      message: `${debtor.person} pays ${settleAmount.toFixed(2)} to ${creditor.person}`
    });

    creditor.amount -= settleAmount;
    debtor.amount += settleAmount;

    if (creditor.amount < 0.01) {
      steps.push({ type: 'info', message: `${creditor.person} settled completely` });
    }
    if (Math.abs(debtor.amount) < 0.01) {
      steps.push({ type: 'info', message: `${debtor.person} settled completely` });
    }
  }

  return { transactions: minimized, steps };
};

export default greedyAlgorithm;
