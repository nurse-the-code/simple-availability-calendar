import { describe, it, expect } from "vitest";
import { formatHebrewDate, formatHebrewRange } from "./hebrew-date-helpers.js";

// Reference dates verified against `hebcal -d -g -h` CLI output.
// See spikes/hebcal-api.md for details.

describe("formatHebrewDate", () => {
  it("converts a Gregorian date to Hebrew date string", async () => {
    expect(await formatHebrewDate("2026-02-01")).toBe("14 Sh'vat 5786");
  });

  it("handles month boundaries", async () => {
    expect(await formatHebrewDate("2026-02-17")).toBe("30 Sh'vat 5786");
    expect(await formatHebrewDate("2026-02-18")).toBe("1 Adar 5786");
  });
});

describe("formatHebrewRange", () => {
  it("joins two Hebrew date strings with an en dash", () => {
    expect(formatHebrewRange("14 Sh'vat 5786", "11 Adar 5786")).toBe(
      "14 Sh'vat 5786 – 11 Adar 5786",
    );
  });
});
