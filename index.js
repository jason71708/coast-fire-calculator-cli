#! /usr/bin/env node
import chalk from 'chalk';
import { pastel } from 'gradient-string';
import inquirer from 'inquirer';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';

import { validateAge, validateTargetAmount, validateAmount, validateInvestInterval, validateAnnualRate } from './validators.js';
import { sleep, formatCurrency } from './utils.js';
import { calculateFireAge, MAX_FIRE_AGE } from './calculator.js';

let currentAge = 20;
let fireAmount = 20000000;
let currentAmount = 0;
let regularlyInvestment = 0;
let investInterval = 12; // month
let annualPercentage = 5;
let compoundFrequency = 'month';

const main = async () => {
  /** Title */
  let figletText = figlet.textSync('Coast FIRE Calculator');
  console.log(pastel.multiline(figletText));

  try {
    /** Current Age */
    const { currentAge: ageInput } = await inquirer.prompt({
      type: 'number',
      name: 'currentAge',
      message: 'What is your current age?',
      default: 20,
      validate: validateAge
    });
    currentAge = ageInput;

    /** Target Fire Amount */
    const { fireAmount: fireInput } = await inquirer.prompt({
      type: 'number',
      name: 'fireAmount',
      message: 'What is your target fire amount?',
      default: 20000000,
      validate: validateTargetAmount
    });
    fireAmount = fireInput;

    /** Current Amount */
    const { currentAmount: currentInput } = await inquirer.prompt({
      type: 'number',
      name: 'currentAmount',
      message: 'What is your current amount of assets?',
      default: 100000,
      validate: validateAmount
    });
    currentAmount = currentInput;

    /** Regularly Invest Amount */
    const { regularlyInvestment: regularInput } = await inquirer.prompt({
      type: 'number',
      name: 'regularlyInvestment',
      message: 'How much can you invest regularly?',
      default: 50000,
      validate: validateAmount
    });
    regularlyInvestment = regularInput;

    /** Invest Interval */
    const { investInterval: intervalInput } = await inquirer.prompt({
      type: 'number',
      name: 'investInterval',
      message: 'How often do you want to invest? (in months)',
      default: 1,
      validate: validateInvestInterval
    });
    investInterval = intervalInput;

    /** Annual Rate */
    const { annualPercentage: rateInput } = await inquirer.prompt({
      type: 'number',
      name: 'annualPercentage',
      message: 'What is your annual rate? (in %)',
      default: 5,
      validate: validateAnnualRate
    });
    annualPercentage = rateInput;

    /** Compound Frequency */
    const { compoundFrequency: freqInput } = await inquirer.prompt({
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
    compoundFrequency = freqInput;
  } catch (error) {
    process.exit(1);
  }

  /** Calculating */
  const spinner = createSpinner('Calculating...');
  spinner.start();
  const { canReach, ageReached, finalAmount } = calculateFireAge({
    currentAge,
    fireAmount,
    currentAmount,
    regularlyInvestment,
    investInterval,
    annualPercentage,
    compoundFrequency
  });
  await sleep(1000);
  if (canReach) {
    spinner.success(`You can reach your target at ${chalk.green.underline.bold(Math.ceil(ageReached))} years old with ${chalk.green.underline.bold(formatCurrency(Math.round(finalAmount)))} assets.`);
  } else {
    spinner.error(`You cannot reach your target before ${chalk.red.underline.bold(MAX_FIRE_AGE)} years old.`);
    process.exit(1);
  }

  console.log(chalk.cyan('\nPress Enter to quit...'));

  /** Final Animation */
  const animation = chalkAnimation.rainbow('Congratulations! You are on the right track to become a Coast FIRE.');
  animation.start();

  /** Wait for user input to quit */
  try {
    await inquirer.prompt({
      type: 'input',
      name: 'quit',
      message: '',
    });
    animation.stop();
  } catch (error) {
    process.exit(0);
  }
};

main();