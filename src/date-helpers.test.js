import { describe, it, expect } from "vitest";
import {
  formatShort,
  formatLong,
  formatLongWithYear,
  formatFullDate,
  parseDate,
  formatYMD,
  padToSunday,
  padToSaturday,
  validateDateRange,
  isSaturday,
  isFriday,
} from "./date-helpers.js";

describe("formatShort", () => {
  it('formats "2026-01-25" as "Jan 25"', () => {
    expect(formatShort("2026-01-25")).toBe("Jan 25");
  });
});

describe("formatLong", () => {
  it('formats "2026-01-25" as "January 25"', () => {
    expect(formatLong("2026-01-25")).toBe("January 25");
  });
});

describe("formatLongWithYear", () => {
  it('formats "2026-01-25" as "January 25, 2026"', () => {
    expect(formatLongWithYear("2026-01-25")).toBe("January 25, 2026");
  });
});

describe("parseDate", () => {
  it('parses "2026-01-25" into a Date for January 25, 2026', () => {
    const date = parseDate("2026-01-25");
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(0);
    expect(date.getDate()).toBe(25);
  });
});

describe("formatYMD", () => {
  it('formats January 25, 2026 as "2026-01-25"', () => {
    const date = new Date(2026, 0, 25);
    expect(formatYMD(date)).toBe("2026-01-25");
  });
});

describe("padToSunday", () => {
  it("returns the same date when already Sunday", () => {
    const sunday = new Date(2026, 1, 1); // Feb 1 2026 is Sunday
    expect(padToSunday(sunday).getTime()).toBe(sunday.getTime());
  });

  it("pads Friday back to Sunday", () => {
    const friday = new Date(2026, 1, 6); // Feb 6 2026 is Friday
    const result = padToSunday(friday);
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(1);
    expect(result.getDate()).toBe(1);
  });
});

describe("padToSaturday", () => {
  it("returns the same date when already Saturday", () => {
    const saturday = new Date(2026, 1, 28); // Feb 28 2026 is Saturday
    expect(padToSaturday(saturday).getTime()).toBe(saturday.getTime());
  });

  it("pads Monday forward to Saturday", () => {
    const monday = new Date(2026, 1, 2); // Feb 2 2026 is Monday
    const result = padToSaturday(monday);
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(1);
    expect(result.getDate()).toBe(7);
  });
});

describe("isSaturday", () => {
  it("returns true for a Saturday", () => {
    expect(isSaturday("2026-01-31")).toBe(true); // Jan 31 2026 is Saturday
  });

  it("returns false for a Friday", () => {
    expect(isSaturday("2026-01-30")).toBe(false);
  });

  it("returns false for a Sunday", () => {
    expect(isSaturday("2026-02-01")).toBe(false);
  });
});

describe("isFriday", () => {
  it("returns true for a Friday", () => {
    expect(isFriday("2026-01-30")).toBe(true); // Jan 30 2026 is Friday
  });

  it("returns false for a Saturday", () => {
    expect(isFriday("2026-01-31")).toBe(false);
  });

  it("returns false for a Thursday", () => {
    expect(isFriday("2026-01-29")).toBe(false);
  });
});

describe("validateDateRange", () => {
  it("does not throw for a valid range", () => {
    expect(() => validateDateRange("2026-01-25", "2026-02-28")).not.toThrow();
  });

  it("throws when start date is missing", () => {
    expect(() => validateDateRange(undefined, "2026-02-28")).toThrow();
  });

  it("throws when end date is missing", () => {
    expect(() => validateDateRange("2026-01-25", undefined)).toThrow();
  });

  it("throws for invalid start date format", () => {
    expect(() => validateDateRange("not-a-date", "2026-02-28")).toThrow();
  });

  it("throws for invalid end date format", () => {
    expect(() => validateDateRange("2026-01-25", "bad")).toThrow();
  });

  it("throws when start date is after end date", () => {
    expect(() => validateDateRange("2026-03-01", "2026-02-01")).toThrow();
  });
});

describe("formatFullDate", () => {
  it('formats "2026-01-25" as "Sunday, January 25, 2026"', () => {
    expect(formatFullDate("2026-01-25")).toBe("Sunday, January 25, 2026");
  });

  it('formats "2026-02-28" as "Saturday, February 28, 2026"', () => {
    expect(formatFullDate("2026-02-28")).toBe("Saturday, February 28, 2026");
  });
});
