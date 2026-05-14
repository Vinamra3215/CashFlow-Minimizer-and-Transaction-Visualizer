const priorityQueueAlgorithm = (netAmount) => {
  const steps = [];
  const creditors = [];
  const debtors = [];

  Object.entries(netAmount).forEach(([person, amount]) => {
    if (amount > 0.01) creditors.push({ person, amount, priority: amount });
    if (amount < -0.01) debtors.push({ person, amount: -amount, priority: -amount });
  });

  steps.push({ type: 'info', message: 'Using priority queues for optimal matching' });

  const sortByPriority = (arr) => arr.sort((a, b) => b.priority - a.priority);

  sortByPriority(creditors);
  sortByPriority(debtors);

  steps.push({ type: 'consider', people: [...creditors.map((c) => c.person), ...debtors.map((d) => d.person)] });

  const minimized = [];

  while (creditors.length > 0 && debtors.length > 0) {
    const creditor = creditors[0];
    const debtor = debtors[0];

    steps.push({
      type: 'select',
      creditor: creditor.person,
      debtor: debtor.person,
      message: `Priority match: ${debtor.person} (priority: ${debtor.priority.toFixed(0)}) -> ${creditor.person} (priority: ${creditor.priority.toFixed(0)})`
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
      message: `Priority transaction: ${settleAmount.toFixed(2)}`
    });

    creditor.amount -= settleAmount;
    debtor.amount -= settleAmount;
    creditor.priority = creditor.amount;
    debtor.priority = debtor.amount;

    if (creditor.amount < 0.01) {
      steps.push({ type: 'info', message: `Dequeuing ${creditor.person}` });
      creditors.shift();
    }
    if (debtor.amount < 0.01) {
      steps.push({ type: 'info', message: `Dequeuing ${debtor.person}` });
      debtors.shift();
    }

    sortByPriority(creditors);
    sortByPriority(debtors);
  }

  return { transactions: minimized, steps };
};

export default priorityQueueAlgorithm;
