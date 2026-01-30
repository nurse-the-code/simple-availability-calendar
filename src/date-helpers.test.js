import { describe, it, expect } from 'vitest';
import { formatShort, formatLong, formatLongWithYear, parseDate, formatYMD, padToSunday, padToSaturday } from './date-helpers.js';

describe('formatShort', () => {
  it('formats "2026-01-25" as "Jan 25"', () => {
    expect(formatShort('2026-01-25')).toBe('Jan 25');
  });
});

describe('formatLong', () => {
  it('formats "2026-01-25" as "January 25"', () => {
    expect(formatLong('2026-01-25')).toBe('January 25');
  });
});

describe('formatLongWithYear', () => {
  it('formats "2026-01-25" as "January 25, 2026"', () => {
    expect(formatLongWithYear('2026-01-25')).toBe('January 25, 2026');
  });
});

describe('parseDate', () => {
  it('parses "2026-01-25" into a Date for January 25, 2026', () => {
    const date = parseDate('2026-01-25');
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(0);
    expect(date.getDate()).toBe(25);
  });
});

describe('formatYMD', () => {
  it('formats January 25, 2026 as "2026-01-25"', () => {
    const date = new Date(2026, 0, 25);
    expect(formatYMD(date)).toBe('2026-01-25');
  });
});

describe('padToSunday', () => {
  it('returns the same date when already Sunday', () => {
    const sunday = new Date(2026, 1, 1); // Feb 1 2026 is Sunday
    expect(padToSunday(sunday).getTime()).toBe(sunday.getTime());
  });

  it('pads Friday back to Sunday', () => {
    const friday = new Date(2026, 1, 6); // Feb 6 2026 is Friday
    const result = padToSunday(friday);
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(1);
    expect(result.getDate()).toBe(1);
  });
});

describe('padToSaturday', () => {
  it('returns the same date when already Saturday', () => {
    const saturday = new Date(2026, 1, 28); // Feb 28 2026 is Saturday
    expect(padToSaturday(saturday).getTime()).toBe(saturday.getTime());
  });

  it('pads Monday forward to Saturday', () => {
    const monday = new Date(2026, 1, 2); // Feb 2 2026 is Monday
    const result = padToSaturday(monday);
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(1);
    expect(result.getDate()).toBe(7);
  });
});
