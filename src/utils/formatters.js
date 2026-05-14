export const formatCurrency = (amount, decimals = 0) => `$${amount.toFixed(decimals)}`;

export const formatSignedCurrency = (amount, decimals = 0) => {
  const sign = amount >= 0 ? '+' : '-';
  return `${sign}$${Math.abs(amount).toFixed(decimals)}`;
};

export const formatDecimal = (value, decimals = 0) => value.toFixed(decimals);
