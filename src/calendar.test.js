import { describe, it, expect } from 'vitest';
import { mergeCalendarData } from './calendar.js';

describe('mergeCalendarData', () => {
  it('uses title from statuses, not dates', () => {
    const dates = {
      title: "Dates Title",
      startDate: "2026-02-01",
      endDate: "2026-04-30",
      days: { "2026-02-01": {} },
    };
    const statuses = { title: "My Availability", days: {} };
    const result = mergeCalendarData(dates, statuses);
    expect(result.title).toBe("My Availability");
  });

  it('uses startDate and endDate from dates, not statuses', () => {
    const dates = {
      startDate: "2026-02-01",
      endDate: "2026-04-30",
      days: {},
    };
    const statuses = {
      title: "My Availability",
      startDate: "2099-01-01",
      endDate: "2099-12-31",
      days: {},
    };
    const result = mergeCalendarData(dates, statuses);
    expect(result.startDate).toBe("2026-02-01");
    expect(result.endDate).toBe("2026-04-30");
  });

  it('includes days from dates', () => {
    const dates = {
      startDate: "2026-02-01",
      endDate: "2026-04-30",
      days: { "2026-02-01": {}, "2026-02-02": {} },
    };
    const statuses = { title: "My Availability", days: {} };
    const result = mergeCalendarData(dates, statuses);
    expect(Object.keys(result.days)).toEqual(["2026-02-01", "2026-02-02"]);
  });
});
