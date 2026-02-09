import { describe, it, expect } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";
import {
  generateDates,
  serializeDatesFile,
  resolveDest,
  validateDest,
  deployCalendar,
} from "./generate-calendar.js";

describe("generateDates", () => {
  it("returns all 28 days for Feb 2026 (Sunday start, Saturday end)", async () => {
    const result = await generateDates("2026-02-01", "2026-02-28");

    expect(result.startDate).toBe("2026-02-01");
    expect(result.endDate).toBe("2026-02-28");

    const days = Object.keys(result.days);
    expect(days).toHaveLength(28);
    expect(days[0]).toBe("2026-02-01");
    expect(days[days.length - 1]).toBe("2026-02-28");
  });

  it("includes hebrew date for each day", async () => {
    const result = await generateDates("2026-02-01", "2026-02-28");

    expect(result.days["2026-02-01"].hebrew).toBe("14 Sh'vat 5786");
    expect(result.days["2026-02-28"].hebrew).toBe("11 Adar 5786");

    // Every day has a hebrew string
    for (const day of Object.values(result.days)) {
      expect(typeof day.hebrew).toBe("string");
      expect(day.hebrew.length).toBeGreaterThan(0);
    }
  });

  it("includes hebrewRange spanning first to last day", async () => {
    const result = await generateDates("2026-02-01", "2026-02-28");

    expect(result.hebrewRange).toBe("14 Sh'vat 5786 – 11 Adar 5786");
  });

  // See .plan.md "Padded Date Range" for padding behavior details.
  it("pads start backward to Sunday and end forward to Saturday", async () => {
    // Feb 4 2026 is Wednesday, Apr 1 2026 is Wednesday
    const result = await generateDates("2026-02-04", "2026-04-01");

    expect(result.startDate).toBe("2026-02-01");
    expect(result.endDate).toBe("2026-04-04");

    const days = Object.keys(result.days);
    expect(days).toHaveLength(63);
    expect(days[0]).toBe("2026-02-01");
    expect(days[days.length - 1]).toBe("2026-04-04");

    // Padded days include hebrew dates
    expect(result.days["2026-02-01"].hebrew).toBe("14 Sh'vat 5786");
    expect(result.days["2026-04-04"].hebrew).toBe("17 Nisan 5786");

    // hebrewRange spans the padded range
    expect(result.hebrewRange).toBe("14 Sh'vat 5786 – 17 Nisan 5786");
  });
});

const serializedOneWeek = `const CALENDAR_DATES = {
  startDate: "2026-02-01",
  endDate: "2026-02-07",
  hebrewRange: "14 Sh'vat 5786 – 20 Sh'vat 5786",
  days: {
    "2026-02-01": { hebrew: "14 Sh'vat 5786" },
    "2026-02-02": { hebrew: "15 Sh'vat 5786" },
    "2026-02-03": { hebrew: "16 Sh'vat 5786" },
    "2026-02-04": { hebrew: "17 Sh'vat 5786" },
    "2026-02-05": { hebrew: "18 Sh'vat 5786" },
    "2026-02-06": { hebrew: "19 Sh'vat 5786" },
    "2026-02-07": { hebrew: "20 Sh'vat 5786" },
  },
};\n`;

describe("serializeDatesFile", () => {
  it("produces a JS string that sets CALENDAR_DATES", async () => {
    const data = await generateDates("2026-02-01", "2026-02-07");
    const result = serializeDatesFile(data);

    expect(result).toBe(serializedOneWeek);
  });
});

describe("deployCalendar", () => {
  it("writes all required files to the destination", async () => {
    const dest = fs.mkdtempSync(path.join(os.tmpdir(), "cal-test-"));
    try {
      await deployCalendar("2026-02-01", "2026-02-07", dest);

      expect(fs.existsSync(path.join(dest, "calendar.html"))).toBe(true);
      expect(fs.existsSync(path.join(dest, "calendar.css"))).toBe(true);
      expect(fs.existsSync(path.join(dest, "calendar-dates.js"))).toBe(true);
      expect(fs.existsSync(path.join(dest, "calendar-statuses.js"))).toBe(true);
      expect(fs.existsSync(path.join(dest, "src", "date-helpers.js"))).toBe(
        true,
      );
      expect(fs.existsSync(path.join(dest, "src", "calendar.js"))).toBe(true);
    } finally {
      fs.rmSync(dest, { recursive: true });
    }
  });

  it("does not overwrite existing calendar-statuses.js", async () => {
    const dest = fs.mkdtempSync(path.join(os.tmpdir(), "cal-test-"));
    try {
      await deployCalendar("2026-02-01", "2026-02-07", dest);
      fs.writeFileSync(path.join(dest, "calendar-statuses.js"), "my edits");
      await deployCalendar("2026-02-01", "2026-02-07", dest);

      expect(
        fs.readFileSync(path.join(dest, "calendar-statuses.js"), "utf-8"),
      ).toBe("my edits");
    } finally {
      fs.rmSync(dest, { recursive: true });
    }
  });
});

describe("validateDest", () => {
  it("throws when parent directory does not exist", () => {
    expect(() => validateDest("/nonexistent/parent/calendar")).toThrow(
      "does not exist",
    );
  });

  it("does not throw when parent directory exists", () => {
    expect(() =>
      validateDest(path.join(os.tmpdir(), "new-calendar")),
    ).not.toThrow();
  });

  it("does not throw when dest itself already exists", () => {
    const dest = fs.mkdtempSync(path.join(os.tmpdir(), "cal-test-"));
    try {
      expect(() => validateDest(dest)).not.toThrow();
    } finally {
      fs.rmSync(dest, { recursive: true });
    }
  });
});

describe("resolveDest", () => {
  it("expands ~/path to home directory", () => {
    expect(resolveDest("~/calendars/adar")).toBe(
      path.join(os.homedir(), "calendars", "adar"),
    );
  });

  it("expands bare ~ to home directory", () => {
    expect(resolveDest("~")).toBe(os.homedir());
  });
});
