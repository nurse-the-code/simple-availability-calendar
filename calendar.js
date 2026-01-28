function initCalendar() {
  function renderHeader() {
    document.querySelector('.calendar-title').textContent = CALENDAR_DATA.title;
    document.querySelector('.calendar-range-hebrew').textContent = CALENDAR_DATA.hebrewRange;
    // TODO: Generate Gregorian range from startDate and endDate
  }

  function renderGrid() {
    // TODO: Generate date cells from startDate and endDate
  }

  renderHeader();
  renderGrid();
}

if (typeof document !== 'undefined') {
  initCalendar();
}

// =============================================================================
// Date Formatters
// =============================================================================

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

// Export for testing (Node.js/Vitest environment)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { formatShort, formatLong, formatLongWithYear };
}
