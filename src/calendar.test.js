import { describe, it, expect } from "vitest";
import {
  mergeCalendarData,
  availabilityClass,
  collectStatuses,
} from "./calendar.js";

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

  it("overrides Saturday user status 'available' to 'unavailable'", () => {
    const dates = {
      startDate: "2026-01-25",
      endDate: "2026-01-31",
      days: { "2026-01-31": {} }, // Saturday
    };
    const statuses = {
      title: "Test",
      days: { "2026-01-31": { status: "available" } },
    };
    const result = mergeCalendarData(dates, statuses);
    expect(result.days["2026-01-31"].status).toBe("unavailable");
  });

  it("overrides Saturday user status 'partial' to 'unavailable'", () => {
    const dates = {
      startDate: "2026-01-25",
      endDate: "2026-01-31",
      days: { "2026-01-31": {} },
    };
    const statuses = {
      title: "Test",
      days: { "2026-01-31": { status: "partial" } },
    };
    const result = mergeCalendarData(dates, statuses);
    expect(result.days["2026-01-31"].status).toBe("unavailable");
  });

  it("marks Saturday as unavailable even with no user status", () => {
    const dates = {
      startDate: "2026-01-25",
      endDate: "2026-01-31",
      days: { "2026-01-31": {} },
    };
    const statuses = { title: "Test", days: {} };
    const result = mergeCalendarData(dates, statuses);
    expect(result.days["2026-01-31"].status).toBe("unavailable");
  });

  it("downgrades Friday user status 'available' to 'partial'", () => {
    const dates = {
      startDate: "2026-01-25",
      endDate: "2026-01-31",
      days: { "2026-01-30": {} }, // Friday
    };
    const statuses = {
      title: "Test",
      days: { "2026-01-30": { status: "available" } },
    };
    const result = mergeCalendarData(dates, statuses);
    expect(result.days["2026-01-30"].status).toBe("partial");
  });

  it("keeps Friday user status 'unavailable' unchanged", () => {
    const dates = {
      startDate: "2026-01-25",
      endDate: "2026-01-31",
      days: { "2026-01-30": {} }, // Friday
    };
    const statuses = {
      title: "Test",
      days: { "2026-01-30": { status: "unavailable" } },
    };
    const result = mergeCalendarData(dates, statuses);
    expect(result.days["2026-01-30"].status).toBe("unavailable");
  });

  it("leaves Friday with no user status as no status", () => {
    const dates = {
      startDate: "2026-01-25",
      endDate: "2026-01-31",
      days: { "2026-01-30": {} }, // Friday
    };
    const statuses = { title: "Test", days: {} };
    const result = mergeCalendarData(dates, statuses);
    expect(result.days["2026-01-30"].status).toBeUndefined();
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

  it("copies notes from statuses into matching days", () => {
    const dates = {
      startDate: "2026-02-01",
      endDate: "2026-04-30",
      days: { "2026-02-01": {}, "2026-02-02": {} },
    };
    const statuses = {
      title: "My Availability",
      days: {
        "2026-02-01": { status: "available", notes: "Free all day" },
        "2026-02-02": { status: "partial" },
      },
    };
    const result = mergeCalendarData(dates, statuses);
    expect(result.days["2026-02-01"].notes).toBe("Free all day");
    expect(result.days["2026-02-02"].notes).toBeUndefined();
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

describe("collectStatuses", () => {
  it("returns empty set when there are no days", () => {
    expect(collectStatuses({})).toEqual(new Set());
  });

  it("returns a single valid status", () => {
    const days = { "2026-02-02": { status: "available" } };
    expect(collectStatuses(days)).toEqual(new Set(["available"]));
  });

  it("returns multiple different statuses", () => {
    const days = {
      "2026-02-01": { status: "available" },
      "2026-02-02": { status: "unavailable" },
    };
    expect(collectStatuses(days)).toEqual(
      new Set(["available", "unavailable"]),
    );
  });

  it("deduplicates repeated statuses", () => {
    const days = {
      "2026-02-01": { status: "available" },
      "2026-02-02": { status: "available" },
      "2026-02-03": { status: "partial" },
    };
    expect(collectStatuses(days)).toEqual(new Set(["available", "partial"]));
  });

  it("returns 'no-data' for days without a status", () => {
    expect(collectStatuses({ "2026-02-01": {} })).toEqual(new Set(["no-data"]));
  });

  it("treats unrecognized statuses as 'no-data'", () => {
    const days = { "2026-02-01": { status: "banana" } };
    expect(collectStatuses(days)).toEqual(new Set(["no-data"]));
  });
});
