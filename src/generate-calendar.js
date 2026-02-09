const {
  parseDate,
  formatYMD,
  padToSunday,
  padToSaturday,
  validateDateRange,
} = require("./date-helpers.js");
const {
  formatHebrewDate,
  formatHebrewRange,
} = require("./hebrew-date-helpers.js");
const { writeFileSync, copyFileSync, mkdirSync, existsSync } = require("fs");
const os = require("os");
const { join, resolve } = require("path");

/**
 * Generate a padded date range with an entry for each day.
 * @param {string} startDate - "YYYY-MM-DD"
 * @param {string} endDate - "YYYY-MM-DD"
 * @returns {{ startDate: string, endDate: string, days: Object.<string, {}> }}
 */
async function generateDates(startDate, endDate) {
  const start = padToSunday(parseDate(startDate));
  const end = padToSaturday(parseDate(endDate));

  const days = {};
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const key = formatYMD(d);
    days[key] = { hebrew: await formatHebrewDate(key) };
  }

  const dayKeys = Object.keys(days);
  const hebrewRange = formatHebrewRange(
    days[dayKeys[0]].hebrew,
    days[dayKeys[dayKeys.length - 1]].hebrew,
  );

  return {
    startDate: formatYMD(start),
    endDate: formatYMD(end),
    hebrewRange,
    days,
  };
}

function serializeDays(days) {
  return Object.entries(days).map(
    ([date, day]) => `    "${date}": { hebrew: "${day.hebrew}" },`,
  );
}

function serializeDatesFile(data) {
  const lines = [
    "const CALENDAR_DATES = {",
    `  startDate: "${data.startDate}",`,
    `  endDate: "${data.endDate}",`,
    `  hebrewRange: "${data.hebrewRange}",`,
    "  days: {",
    ...serializeDays(data.days),
    "  },",
    "};",
  ];
  return lines.join("\n") + "\n";
}

// CLI entry point
const [, , startArg, endArg, destArg] = process.argv;
if (startArg || endArg || destArg) {
  if (!startArg || !endArg || !destArg) {
    console.error("Usage: generate-calendar <start-date> <end-date> <dest>");
    process.exit(1);
  }
  try {
    validateDateRange(startArg, endArg);
    const dest = resolveDest(destArg);
    validateDest(dest);
    deployCalendar(startArg, endArg, dest);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}

const PROJECT_ROOT = join(__dirname, "..");

async function deployCalendar(startDate, endDate, dest) {
  mkdirSync(join(dest, "src"), { recursive: true });

  const data = await generateDates(startDate, endDate);
  writeFileSync(join(dest, "calendar-dates.js"), serializeDatesFile(data));

  copyFileSync(
    join(PROJECT_ROOT, "calendar.html"),
    join(dest, "calendar.html"),
  );
  copyFileSync(join(PROJECT_ROOT, "calendar.css"), join(dest, "calendar.css"));
  copyFileSync(
    join(PROJECT_ROOT, "src", "date-helpers.js"),
    join(dest, "src", "date-helpers.js"),
  );
  copyFileSync(
    join(PROJECT_ROOT, "src", "calendar.js"),
    join(dest, "src", "calendar.js"),
  );

  if (!existsSync(join(dest, "calendar-statuses.js"))) {
    copyFileSync(
      join(PROJECT_ROOT, "calendar-statuses.example.js"),
      join(dest, "calendar-statuses.js"),
    );
  }
}

function resolveDest(dest) {
  if (dest === "~") return os.homedir();
  if (dest.startsWith("~/")) return join(os.homedir(), dest.slice(2));
  return resolve(dest);
}

function validateDest(dest) {
  const parent = join(dest, "..");
  if (!existsSync(parent)) {
    throw new Error(`Parent directory does not exist: ${parent}`);
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    generateDates,
    serializeDatesFile,
    resolveDest,
    validateDest,
    deployCalendar,
  };
}
