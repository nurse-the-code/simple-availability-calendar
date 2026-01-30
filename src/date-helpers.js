function formatShort(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatLong(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}

function formatLongWithYear(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function parseDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatYMD(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function padToSunday(date) {
  const d = new Date(date);
  // getDay() returns the day of the week as a 0-indexed number
  // (0 = Sunday, 6 = Saturday)
  d.setDate(d.getDate() - d.getDay());
  return d;
}

function padToSaturday(date) {
  const d = new Date(date);
  // getDay() returns the day of the week as a 0-indexed number
  // (0 = Sunday, 6 = Saturday)
  const day = d.getDay();
  if (day !== 6) {
    d.setDate(d.getDate() + (6 - day));
  }
  return d;
}

// Export for testing (Node.js/Vitest environment)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { formatShort, formatLong, formatLongWithYear, parseDate, formatYMD, padToSunday, padToSaturday };
}
