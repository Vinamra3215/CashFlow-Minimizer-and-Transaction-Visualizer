export const buildNetAmount = (people, transactions) => {
  const netAmount = {};

  people.forEach((person) => {
    netAmount[person] = 0;
  });

  transactions.forEach(({ from, to, amount }) => {
    netAmount[from] -= amount;
    netAmount[to] += amount;
  });

  return netAmount;
};
