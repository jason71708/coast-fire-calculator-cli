import { jest } from '@jest/globals';
import { sleep, formatCurrency } from '../utils.js';

describe('Utils', () => {
  describe('sleep', () => {
    test('should resolve after specified milliseconds', async () => {
      const start = Date.now();
      await sleep(100);
      const end = Date.now();

      // Should wait at least 100ms (allowing for some tolerance)
      expect(end - start).toBeGreaterThanOrEqual(95);
    });

    test('should use default 2000ms when no argument provided', async () => {
      const start = Date.now();
      await sleep();
      const end = Date.now();

      // Should wait at least 2000ms (allowing for some tolerance)
      expect(end - start).toBeGreaterThanOrEqual(1995);
    });

    test('should handle zero milliseconds', async () => {
      const start = Date.now();
      await sleep(0);
      const end = Date.now();

      // Should resolve immediately or very quickly
      expect(end - start).toBeLessThan(10);
    });
  });

  describe('formatCurrency', () => {
    test('should format small amounts correctly', () => {
      expect(formatCurrency(1000)).toBe('$1,000');
      expect(formatCurrency(50000)).toBe('$50,000');
      expect(formatCurrency(100000)).toBe('$100,000');
    });

    test('should format large amounts with proper comma separation', () => {
      expect(formatCurrency(1000000)).toBe('$1,000,000');
      expect(formatCurrency(20000000)).toBe('$20,000,000');
      expect(formatCurrency(100000000)).toBe('$100,000,000');
    });

    test('should handle zero amount', () => {
      expect(formatCurrency(0)).toBe('$0');
    });

    test('should handle decimal numbers by rounding', () => {
      expect(formatCurrency(1000.5)).toBe('$1,001');
      expect(formatCurrency(1000.4)).toBe('$1,000');
      expect(formatCurrency(1000000.99)).toBe('$1,000,001');
    });

    test('should handle very large numbers', () => {
      expect(formatCurrency(1000000000)).toBe('$1,000,000,000');
      expect(formatCurrency(999999999)).toBe('$999,999,999');
    });

    test('should handle negative numbers', () => {
      expect(formatCurrency(-1000)).toBe('-$1,000');
      expect(formatCurrency(-50000)).toBe('-$50,000');
    });

    test('should format amounts less than 1000 without commas', () => {
      expect(formatCurrency(100)).toBe('$100');
      expect(formatCurrency(999)).toBe('$999');
      expect(formatCurrency(1)).toBe('$1');
    });

    test('should handle amounts with thousands separator', () => {
      expect(formatCurrency(1234567)).toBe('$1,234,567');
      expect(formatCurrency(987654321)).toBe('$987,654,321');
    });
  });
});