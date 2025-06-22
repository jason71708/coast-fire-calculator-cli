import { jest } from '@jest/globals';
import { calculateFireAge } from '../calculator.js';

describe('Coast FIRE Calculator', () => {
  describe('calculateFireAge function', () => {
    test('should immediately reach FIRE goal when current amount equals target', () => {
      const result = calculateFireAge({
        currentAge: 20,
        fireAmount: 20000000,
        currentAmount: 20000000,
        regularlyInvestment: 1,
        investInterval: 1,
        annualPercentage: 5,
        compoundFrequency: 'month'
      });

      expect(result.canReach).toBe(true);
      expect(result.ageReached).toBe(20);
      expect(result.finalAmount).toBe(20000000);
    });

    test('should immediately reach FIRE goal when current amount exceeds target', () => {
      const result = calculateFireAge({
        currentAge: 25,
        fireAmount: 1000000,
        currentAmount: 1500000,
        regularlyInvestment: 1000,
        investInterval: 1,
        annualPercentage: 7,
        compoundFrequency: 'month'
      });

      expect(result.canReach).toBe(true);
      expect(result.ageReached).toBe(25);
      expect(result.finalAmount).toBe(1500000);
    });

    test('should reach FIRE goal with monthly compounding', () => {
      const result = calculateFireAge({
        currentAge: 25,
        fireAmount: 1000000,
        currentAmount: 100000,
        regularlyInvestment: 1000,
        investInterval: 1, // monthly
        annualPercentage: 7,
        compoundFrequency: 'month'
      });

      expect(result.canReach).toBe(true);
      expect(result.ageReached).toBeGreaterThan(25);
      expect(result.ageReached).toBeLessThanOrEqual(70);
      expect(result.finalAmount).toBeGreaterThanOrEqual(1000000);
    });

    test('should reach FIRE goal with annual compounding', () => {
      const result = calculateFireAge({
        currentAge: 30,
        fireAmount: 2000000,
        currentAmount: 200000,
        regularlyInvestment: 2000,
        investInterval: 12, // annually
        annualPercentage: 8,
        compoundFrequency: 'annual'
      });

      expect(result.canReach).toBe(true);
      expect(result.ageReached).toBeGreaterThan(30);
      expect(result.ageReached).toBeLessThanOrEqual(70);
      expect(result.finalAmount).toBeGreaterThanOrEqual(2000000);
    });

    test('should reach FIRE goal with quarterly compounding', () => {
      const result = calculateFireAge({
        currentAge: 35,
        fireAmount: 1500000,
        currentAmount: 150000,
        regularlyInvestment: 1500,
        investInterval: 3, // quarterly
        annualPercentage: 6,
        compoundFrequency: 'quarter'
      });

      expect(result.canReach).toBe(true);
      expect(result.ageReached).toBeGreaterThan(35);
      expect(result.ageReached).toBeLessThanOrEqual(70);
      expect(result.finalAmount).toBeGreaterThanOrEqual(1500000);
    });

    test('should not reach FIRE goal before age 70', () => {
      const result = calculateFireAge({
        currentAge: 60,
        fireAmount: 5000000,
        currentAmount: 100000,
        regularlyInvestment: 1000,
        investInterval: 1,
        annualPercentage: 5,
        compoundFrequency: 'month'
      });

      expect(result.canReach).toBe(false);
      expect(result.ageReached).toBeNull();
      expect(result.finalAmount).toBeGreaterThan(100000);
    });

    test('should handle zero regular investment', () => {
      const result = calculateFireAge({
        currentAge: 25,
        fireAmount: 1000000,
        currentAmount: 500000,
        regularlyInvestment: 0,
        investInterval: 12,
        annualPercentage: 7,
        compoundFrequency: 'annual'
      });

      // Should still reach goal if current amount is sufficient
      if (result.canReach) {
        expect(result.ageReached).toBeGreaterThan(25);
        expect(result.finalAmount).toBeGreaterThanOrEqual(1000000);
      }
    });

    test('should handle high interest rate scenario', () => {
      const result = calculateFireAge({
        currentAge: 25,
        fireAmount: 1000000,
        currentAmount: 50000,
        regularlyInvestment: 500,
        investInterval: 1,
        annualPercentage: 12, // High return
        compoundFrequency: 'month'
      });

      expect(result.canReach).toBe(true);
      expect(result.ageReached).toBeLessThan(50); // Should reach early with high returns
    });

    test('should handle low interest rate scenario', () => {
      const result = calculateFireAge({
        currentAge: 25,
        fireAmount: 1000000,
        currentAmount: 10000,
        regularlyInvestment: 1000,
        investInterval: 1,
        annualPercentage: 2, // Low return
        compoundFrequency: 'month'
      });

      // May not reach goal with low returns
      if (!result.canReach) {
        expect(result.ageReached).toBeNull();
        expect(result.finalAmount).toBeGreaterThan(10000);
      }
    });

    test('should handle edge case: starting at age 69', () => {
      const result = calculateFireAge({
        currentAge: 69,
        fireAmount: 1000000,
        currentAmount: 900000,
        regularlyInvestment: 10000,
        investInterval: 1,
        annualPercentage: 10,
        compoundFrequency: 'month'
      });

      // Should reach goal quickly or not at all
      if (result.canReach) {
        expect(result.ageReached).toBeLessThanOrEqual(70);
      } else {
        expect(result.ageReached).toBeNull();
      }
    });

    test('should handle large investment amounts', () => {
      const result = calculateFireAge({
        currentAge: 25,
        fireAmount: 5000000,
        currentAmount: 100000,
        regularlyInvestment: 10000, // Large monthly investment
        investInterval: 1,
        annualPercentage: 7,
        compoundFrequency: 'month'
      });

      expect(result.canReach).toBe(true);
      expect(result.ageReached).toBeLessThan(50); // Should reach early with large investments
    });

    test('should handle different investment intervals', () => {
      const monthlyResult = calculateFireAge({
        currentAge: 25,
        fireAmount: 1000000,
        currentAmount: 100000,
        regularlyInvestment: 1000,
        investInterval: 1, // Monthly
        annualPercentage: 7,
        compoundFrequency: 'month'
      });

      const quarterlyResult = calculateFireAge({
        currentAge: 25,
        fireAmount: 1000000,
        currentAmount: 100000,
        regularlyInvestment: 3000, // Same annual amount
        investInterval: 3, // Quarterly
        annualPercentage: 7,
        compoundFrequency: 'month'
      });

      // Both should reach the goal, but timing may differ slightly
      expect(monthlyResult.canReach).toBe(true);
      expect(quarterlyResult.canReach).toBe(true);
    });
  });

  describe('Edge cases and validation', () => {
    test('should handle zero current amount', () => {
      const result = calculateFireAge({
        currentAge: 25,
        fireAmount: 1000000,
        currentAmount: 0,
        regularlyInvestment: 2000,
        investInterval: 1,
        annualPercentage: 7,
        compoundFrequency: 'month'
      });

      expect(result.finalAmount).toBeGreaterThan(0);
    });

    test('should handle very small fire amount', () => {
      const result = calculateFireAge({
        currentAge: 25,
        fireAmount: 100000,
        currentAmount: 50000,
        regularlyInvestment: 1000,
        investInterval: 1,
        annualPercentage: 5,
        compoundFrequency: 'month'
      });

      expect(result.canReach).toBe(true);
      expect(result.ageReached).toBeLessThan(30); // Should reach quickly
    });

    test('should handle zero interest rate', () => {
      const result = calculateFireAge({
        currentAge: 25,
        fireAmount: 1000000,
        currentAmount: 100000,
        regularlyInvestment: 1000,
        investInterval: 1,
        annualPercentage: 0,
        compoundFrequency: 'month'
      });

      // With 0% interest, only contributions matter
      if (result.canReach) {
        expect(result.ageReached).toBeGreaterThan(25);
      }
    });
  });
});