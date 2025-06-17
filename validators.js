export const validateAge = (input) => {
  if (input < 1) return 'Age must be at least 1.';
  if (input > 100) return 'Age must be at most 100.';
  return true;
};

export const validateTargetAmount = (input) => {
  if (input < 100000) return 'Amount must be at least 100000.';
  return true;
};

export const validateAmount = (input) => {
  if (input < 0) return 'Amount must be at least 0.';
  return true;
};

export const validateInvestInterval = (input) => {
  if (input < 0) return 'Interval must be at least 0.';
  if (input > 12) return 'Interval must be at most 12.';
  return true;
};

export const validateAnnualRate = (input) => {
  if (input < 0) return 'Rate must be at least 0.';
  if (input > 100) return 'Rate must be at most 100.';
  return true;
};