const STATE_FILE_NAME = 'cashflow-state.json';

export const downloadCashFlowState = ({ people, transactions }) => {
  const state = { people, transactions };
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = STATE_FILE_NAME;
  anchor.click();
  URL.revokeObjectURL(url);
};

export const readCashFlowStateFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const state = JSON.parse(event.target.result);
        resolve({
          people: Array.isArray(state.people) ? state.people : [],
          transactions: Array.isArray(state.transactions) ? state.transactions : []
        });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
};
