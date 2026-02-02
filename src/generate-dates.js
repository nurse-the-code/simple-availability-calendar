const {
  parseDate,
  formatYMD,
  padToSunday,
  padToSaturday,
  validateDateRange,
} = require("./date-helpers.js");
const { writeFileSync } = require("fs");
const { join } = require("path");

/**
 * Generate a padded date range with an entry for each day.
 * @param {string} startDate - "YYYY-MM-DD"
 * @param {string} endDate - "YYYY-MM-DD"
 * @returns {{ startDate: string, endDate: string, days: Object.<string, {}> }}
 */
function generateDates(startDate, endDate) {
  const start = padToSunday(parseDate(startDate));
  const end = padToSaturday(parseDate(endDate));

  const days = {};
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days[formatYMD(d)] = {};
  }

  return { startDate: formatYMD(start), endDate: formatYMD(end), days };
}

/**
 * Write calendar-dates.js from a start/end date range.
 * @param {string} startDate - "YYYY-MM-DD"
 * @param {string} endDate - "YYYY-MM-DD"
 */
function serializeDatesFile(data) {
  const lines = [
    "const CALENDAR_DATES = {",
    `  startDate: "${data.startDate}",`,
    `  endDate: "${data.endDate}",`,
    "  days: {",
    ...Object.keys(data.days).map((date) => `    "${date}": {},`),
    "  },",
    "};",
  ];
  return lines.join("\n") + "\n";
}

function writeDatesFile(startDate, endDate) {
  const data = generateDates(startDate, endDate);
  const content = serializeDatesFile(data);
  const projectRoot = join(__dirname, "..");
  writeFileSync(join(projectRoot, "calendar-dates.js"), content);
}

// CLI entry point
const [, , startArg, endArg] = process.argv;
if (startArg || endArg) {
  try {
    validateDateRange(startArg, endArg);
    writeDatesFile(startArg, endArg);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { generateDates, serializeDatesFile, writeDatesFile };
}
