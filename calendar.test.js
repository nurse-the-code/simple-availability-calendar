import { describe, it, expect } from 'vitest';
import { formatShort, formatLong, formatLongWithYear } from './calendar.js';

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
