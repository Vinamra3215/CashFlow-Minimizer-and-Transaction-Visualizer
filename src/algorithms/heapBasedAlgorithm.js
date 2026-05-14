const heapBasedAlgorithm = (netAmount) => {
  const steps = [];
  const creditors = [];
  const debtors = [];

  Object.entries(netAmount).forEach(([person, amount]) => {
    if (amount > 0.01) creditors.push({ person, amount });
    if (amount < -0.01) debtors.push({ person, amount: -amount });
  });

  steps.push({ type: 'info', message: 'Sorting creditors and debtors by amount (heap simulation)' });

  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  steps.push({ type: 'consider', people: [...creditors.map((c) => c.person), ...debtors.map((d) => d.person)] });

  const minimized = [];

  while (creditors.length > 0 && debtors.length > 0) {
    const creditor = creditors[0];
    const debtor = debtors[0];

    steps.push({
      type: 'select',
      creditor: creditor.person,
      debtor: debtor.person,
      message: `Heap top: ${debtor.person} (${debtor.amount.toFixed(0)}) -> ${creditor.person} (${creditor.amount.toFixed(0)})`
    });

    const settleAmount = Math.min(creditor.amount, debtor.amount);
    const transaction = {
      from: debtor.person,
      to: creditor.person,
      amount: settleAmount
    };

    minimized.push(transaction);
    steps.push({
      type: 'transaction',
      ...transaction,
      message: `Transaction: ${settleAmount.toFixed(2)}`
    });

    creditor.amount -= settleAmount;
    debtor.amount -= settleAmount;

    if (creditor.amount < 0.01) {
      steps.push({ type: 'info', message: `Removing ${creditor.person} from heap` });
      creditors.shift();
    }
    if (debtor.amount < 0.01) {
      steps.push({ type: 'info', message: `Removing ${debtor.person} from heap` });
      debtors.shift();
    }

    steps.push({ type: 'info', message: 'Re-heapifying...' });
    creditors.sort((a, b) => b.amount - a.amount);
    debtors.sort((a, b) => b.amount - a.amount);
  }

  return { transactions: minimized, steps };
};

export default heapBasedAlgorithm;
