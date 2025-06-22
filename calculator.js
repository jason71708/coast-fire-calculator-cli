export const MAX_FIRE_AGE = 70;

export function calculateFireAge({
  currentAge,
  fireAmount,
  currentAmount,
  regularlyInvestment,
  investInterval,
  annualPercentage,
  compoundFrequency
}) {
  let age = currentAge;
  let amount = currentAmount;
  const annualRate = annualPercentage / 100;

  // Check if already at or above target amount
  if (amount >= fireAmount) {
    return { canReach: true, ageReached: age, finalAmount: amount };
  }

  let periodsPerYear;
  if (compoundFrequency === 'annual') periodsPerYear = 1;
  else if (compoundFrequency === 'quarter') periodsPerYear = 4;
  else periodsPerYear = 12;

  const periodRate = Math.pow(1 + annualRate, 1 / periodsPerYear) - 1;
  let periods = 0;

  while (age + periods / periodsPerYear <= MAX_FIRE_AGE) {
    // Add investment at the specified interval (convert months to periods)
    if (periods % Math.round(investInterval / (12 / periodsPerYear)) === 0 && periods !== 0) {
      amount += regularlyInvestment;
    }
    // Compound at the chosen frequency
    amount *= (1 + periodRate);

    if (amount >= fireAmount) {
      const reachedAge = age + periods / periodsPerYear;
      return { canReach: true, ageReached: reachedAge, finalAmount: amount };
    }
    periods++;
  }
  return { canReach: false, ageReached: null, finalAmount: amount };
}