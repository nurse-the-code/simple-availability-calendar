import { describe, it, expect } from "vitest";
import { mergeCalendarData, availabilityClass } from "./calendar.js";

describe("mergeCalendarData", () => {
  it("uses title from statuses, not dates", () => {
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

  it("uses startDate and endDate from dates, not statuses", () => {
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

  it("copies status from statuses into matching days", () => {
    const dates = {
      startDate: "2026-02-01",
      endDate: "2026-04-30",
      days: { "2026-02-01": {}, "2026-02-02": {} },
    };
    const statuses = {
      title: "My Availability",
      days: {
        "2026-02-01": { status: "available" },
        "2026-02-02": { status: "unavailable" },
      },
    };
    const result = mergeCalendarData(dates, statuses);
    expect(result.days["2026-02-01"].status).toBe("available");
    expect(result.days["2026-02-02"].status).toBe("unavailable");
  });

  it("ignores status entries for dates not in the dates file", () => {
    const dates = {
      startDate: "2026-02-01",
      endDate: "2026-04-30",
      days: { "2026-02-01": {} },
    };
    const statuses = {
      title: "My Availability",
      days: {
        "2026-01-01": { status: "available" },
        "2099-01-01": { status: "available" },
      },
    };
    const result = mergeCalendarData(dates, statuses);
    expect(result.days["2026-01-01"]).toBeUndefined();
    expect(result.days["2099-01-01"]).toBeUndefined();
  });

  it("includes days from dates", () => {
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

describe("availabilityClass", () => {
  it('returns "no-data" when day has no status', () => {
    expect(availabilityClass({})).toBe("no-data");
  });

  it('returns "available" for available status', () => {
    expect(availabilityClass({ status: "available" })).toBe("available");
  });

  it('returns "partial" for partial status', () => {
    expect(availabilityClass({ status: "partial" })).toBe("partial");
  });

  it('returns "unavailable" for unavailable status', () => {
    expect(availabilityClass({ status: "unavailable" })).toBe("unavailable");
  });

  it('returns "no-data" for an unrecognized status', () => {
    expect(availabilityClass({ status: "banana" })).toBe("no-data");
  });
});
