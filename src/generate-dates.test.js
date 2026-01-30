import { describe, it, expect } from 'vitest';
import { generateDates } from './generate-dates.js';

describe('generateDates', () => {
  it('returns all 28 days for Feb 2026 (Sunday start, Saturday end)', () => {
    const result = generateDates('2026-02-01', '2026-02-28');

    expect(result.startDate).toBe('2026-02-01');
    expect(result.endDate).toBe('2026-02-28');

    const days = Object.keys(result.days);
    expect(days).toHaveLength(28);
    expect(days[0]).toBe('2026-02-01');
    expect(days[days.length - 1]).toBe('2026-02-28');
  });

  // See .plan.md "Padded Date Range" for padding behavior details.
  it('pads start backward to Sunday and end forward to Saturday', () => {
    // Feb 4 2026 is Wednesday, Apr 1 2026 is Wednesday
    const result = generateDates('2026-02-04', '2026-04-01');

    expect(result.startDate).toBe('2026-02-01');
    expect(result.endDate).toBe('2026-04-04');

    const days = Object.keys(result.days);
    expect(days).toHaveLength(63);
    expect(days[0]).toBe('2026-02-01');
    expect(days[days.length - 1]).toBe('2026-04-04');
  });

});
