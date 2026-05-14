const sortingBasedAlgorithm = (netAmount) => {
  const steps = [];
  const balances = [];

  Object.entries(netAmount).forEach(([person, amount]) => {
    if (Math.abs(amount) > 0.01) {
      balances.push({ person, amount });
    }
  });

  steps.push({ type: 'info', message: 'Sorting all balances from positive to negative' });
  balances.sort((a, b) => b.amount - a.amount);

  steps.push({ type: 'consider', people: balances.map((b) => b.person) });

  const minimized = [];
  let left = 0;
  let right = balances.length - 1;

  while (left < right) {
    const creditor = balances[left];
    const debtor = balances[right];

    if (creditor.amount < 0.01) {
      steps.push({ type: 'info', message: `Skipping ${creditor.person} (settled)` });
      left++;
      continue;
    }
    if (debtor.amount > -0.01) {
      steps.push({ type: 'info', message: `Skipping ${debtor.person} (settled)` });
      right--;
      continue;
    }

    steps.push({
      type: 'select',
      creditor: creditor.person,
      debtor: debtor.person,
      message: `Two-pointer: ${debtor.person} and ${creditor.person}`
    });

    const settleAmount = Math.min(creditor.amount, -debtor.amount);
    const transaction = {
      from: debtor.person,
      to: creditor.person,
      amount: settleAmount
    };

    minimized.push(transaction);
    steps.push({
      type: 'transaction',
      ...transaction,
      message: `Settling ${settleAmount.toFixed(2)}`
    });

    creditor.amount -= settleAmount;
    debtor.amount += settleAmount;

    if (creditor.amount < 0.01) {
      steps.push({ type: 'info', message: `${creditor.person} settled, moving left pointer` });
      left++;
    }
    if (debtor.amount > -0.01) {
      steps.push({ type: 'info', message: `${debtor.person} settled, moving right pointer` });
      right--;
    }
  }

  return { transactions: minimized, steps };
};

export default sortingBasedAlgorithm;
