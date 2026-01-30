import { parseDate, formatYMD, padToSunday, padToSaturday } from './date-helpers.js';

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
function writeDatesFile(startDate, endDate) {}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { generateDates, writeDatesFile };
}
