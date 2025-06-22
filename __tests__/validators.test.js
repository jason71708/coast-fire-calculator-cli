import { jest } from '@jest/globals';
import {
  validateAge,
  validateTargetAmount,
  validateAmount,
  validateInvestInterval,
  validateAnnualRate
} from '../validators.js';

describe('Validators', () => {
  describe('validateAge', () => {
    test('should return true for valid ages', () => {
      expect(validateAge(1)).toBe(true);
      expect(validateAge(25)).toBe(true);
      expect(validateAge(100)).toBe(true);
    });

    test('should return error message for age less than 1', () => {
      expect(validateAge(0)).toBe('Age must be at least 1.');
      expect(validateAge(-5)).toBe('Age must be at least 1.');
    });

    test('should return error message for age greater than 100', () => {
      expect(validateAge(101)).toBe('Age must be at most 100.');
      expect(validateAge(150)).toBe('Age must be at most 100.');
    });
  });

  describe('validateTargetAmount', () => {
    test('should return true for amounts >= 100000', () => {
      expect(validateTargetAmount(100000)).toBe(true);
      expect(validateTargetAmount(1000000)).toBe(true);
      expect(validateTargetAmount(5000000)).toBe(true);
    });

    test('should return error message for amounts < 100000', () => {
      expect(validateTargetAmount(99999)).toBe('Amount must be at least 100000.');
      expect(validateTargetAmount(50000)).toBe('Amount must be at least 100000.');
      expect(validateTargetAmount(0)).toBe('Amount must be at least 100000.');
    });
  });

  describe('validateAmount', () => {
    test('should return true for non-negative amounts', () => {
      expect(validateAmount(0)).toBe(true);
      expect(validateAmount(1000)).toBe(true);
      expect(validateAmount(1000000)).toBe(true);
    });

    test('should return error message for negative amounts', () => {
      expect(validateAmount(-1)).toBe('Amount must be at least 0.');
      expect(validateAmount(-1000)).toBe('Amount must be at least 0.');
    });
  });

  describe('validateInvestInterval', () => {
    test('should return true for valid intervals', () => {
      expect(validateInvestInterval(0)).toBe(true);
      expect(validateInvestInterval(1)).toBe(true);
      expect(validateInvestInterval(6)).toBe(true);
      expect(validateInvestInterval(12)).toBe(true);
    });

    test('should return error message for negative intervals', () => {
      expect(validateInvestInterval(-1)).toBe('Interval must be at least 0.');
      expect(validateInvestInterval(-5)).toBe('Interval must be at least 0.');
    });

    test('should return error message for intervals > 12', () => {
      expect(validateInvestInterval(13)).toBe('Interval must be at most 12.');
      expect(validateInvestInterval(24)).toBe('Interval must be at most 12.');
    });
  });

  describe('validateAnnualRate', () => {
    test('should return true for valid rates', () => {
      expect(validateAnnualRate(0)).toBe(true);
      expect(validateAnnualRate(5)).toBe(true);
      expect(validateAnnualRate(10)).toBe(true);
      expect(validateAnnualRate(100)).toBe(true);
    });

    test('should return error message for negative rates', () => {
      expect(validateAnnualRate(-1)).toBe('Rate must be at least 0.');
      expect(validateAnnualRate(-5)).toBe('Rate must be at least 0.');
    });

    test('should return error message for rates > 100', () => {
      expect(validateAnnualRate(101)).toBe('Rate must be at most 100.');
      expect(validateAnnualRate(150)).toBe('Rate must be at most 100.');
    });
  });
});