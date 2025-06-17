#! /usr/bin/env node
import chalk from 'chalk';
import gradient from 'gradient-string';
import inquirer from 'inquirer';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import nanospinner from 'nanospinner';

import { validateAge, validateTargetAmount, validateAmount, validateInvestInterval, validateAnnualRate } from './validators.js';
import { sleep } from './utils.js';

let currentAge = 20;
let fireAmount = 20000000;
let currentAmount = 0;
let regularlyInvestment = 0;
let investInterval = 12; // month
let annualPercentage = 5;
let compoundFrequency = 'month';

const MAX_FIRE_AGE = 70;

function calculateFireAge({
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

  let periodsPerYear;
  if (compoundFrequency === 'annual') periodsPerYear = 1;
  else if (compoundFrequency === 'quarter') periodsPerYear = 4;
  else periodsPerYear = 12;

  const periodRate = Math.pow(1 + annualRate, 1 / periodsPerYear) - 1;
  let periods = 0;

  while (age + periods / periodsPerYear <= 70) {
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

const main = async () => {
  currentAge = await inquirer.prompt({
    type: 'number',
    name: 'currentAge',
    message: 'What is your current age?',
    default: 20,
    validate: validateAge
  });
  fireAmount = await inquirer.prompt({
    type: 'number',
    name: 'fireAmount',
    message: 'What is your target fire amount?',
    default: 20000000,
    validate: validateTargetAmount
  });
  currentAmount = await inquirer.prompt({
    type: 'number',
    name: 'currentAmount',
    message: 'What is your current amount of assets?',
    default: 0,
    validate: validateAmount
  });
  regularlyInvestment = await inquirer.prompt({
    type: 'number',
    name: 'regularlyInvestment',
    message: 'How much can you invest regularly?',
    default: 0,
    validate: validateAmount
  });
  investInterval = await inquirer.prompt({
    type: 'number',
    name: 'investInterval',
    message: 'How often do you want to invest? (in months)',
    default: 12,
    validate: validateInvestInterval
  });
  annualPercentage = await inquirer.prompt({
    type: 'number',
    name: 'annualPercentage',
    message: 'What is your annual rate? (in %)',
    default: 5,
    validate: validateAnnualRate
  });
  compoundFrequency = await inquirer.prompt({
    type: 'list',
    name: 'compoundFrequency',
    message: 'How often is your investment compounded?',
    choices: [
      { name: 'Annually', value: 'annual' },
      { name: 'Quarterly', value: 'quarter' },
      { name: 'Monthly', value: 'month' }
    ],
    default: 'month'
  });

  const rainbowLoading = chalkAnimation.rainbow('Calculating...');
  const { canReach, ageReached, finalAmount } = calculateFireAge({
    currentAge,
    fireAmount,
    currentAmount,
    regularlyInvestment,
    investInterval,
    annualPercentage,
    compoundFrequency
  });
  await sleep(2000);
  rainbowLoading.stop();
  console.log(chalk.green('Done!'));
};

main();