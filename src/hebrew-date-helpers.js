const { parseDate } = require("./date-helpers.js");

let _hebcal;
async function getHebcal() {
  if (!_hebcal) _hebcal = await import("@hebcal/core");
  return _hebcal;
}

async function formatHebrewDate(dateStr) {
  const { HDate, Locale } = await getHebcal();
  const hd = new HDate(parseDate(dateStr));
  const month = Locale.gettext(hd.getMonthName(), "ashkenazi");
  return `${hd.getDate()} ${month} ${hd.getFullYear()}`;
}

function formatHebrewRange(startHebrew, endHebrew) {
  return `${startHebrew} – ${endHebrew}`;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { formatHebrewDate, formatHebrewRange };
}
