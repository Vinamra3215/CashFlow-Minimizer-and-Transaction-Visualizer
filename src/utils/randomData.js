const QUICK_RANDOM_NAMES = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'];
const CUSTOM_RANDOM_NAMES = [
  'Alice',
  'Bob',
  'Charlie',
  'Diana',
  'Eve',
  'Frank',
  'Grace',
  'Henry',
  'Iris',
  'Jack',
  'Kelly',
  'Liam',
  'Mia',
  'Noah',
  'Olivia',
  'Peter',
  'Quinn',
  'Ryan',
  'Sophia',
  'Tyler'
];

const createRandomTransactions = (people, count) => {
  const transactions = [];

  for (let i = 0; i < count; i++) {
    const from = people[Math.floor(Math.random() * people.length)];
    let to = people[Math.floor(Math.random() * people.length)];

    while (to === from) {
      to = people[Math.floor(Math.random() * people.length)];
    }

    const amount = Math.floor(Math.random() * 90) + 10;
    transactions.push({ from, to, amount });
  }

  return transactions;
};

export const generateQuickRandomScenario = () => {
  const numPeople = Math.floor(Math.random() * 3) + 4;
  const selectedPeople = QUICK_RANDOM_NAMES.slice(0, numPeople);
  const numTransactions = Math.floor(Math.random() * 5) + 5;

  return {
    people: selectedPeople,
    transactions: createRandomTransactions(selectedPeople, numTransactions)
  };
};

export const generateCustomRandomScenario = (customVertexCount) => {
  const numPeople = Math.min(Math.max(customVertexCount, 2), 20);
  const selectedPeople = CUSTOM_RANDOM_NAMES.slice(0, numPeople);
  const numTransactions = Math.floor(Math.random() * (numPeople * 1.5)) + numPeople * 1.5;

  return {
    people: selectedPeople,
    transactions: createRandomTransactions(selectedPeople, numTransactions)
  };
};
