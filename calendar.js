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

initCalendar();

// =============================================================================
// Date Formatters
// =============================================================================

export function formatShort(dateStr) {
  // TODO: "2026-01-25" → "Jan 25"
}

export function formatLong(dateStr) {
  // TODO: "2026-01-25" → "January 25"
}

export function formatLongWithYear(dateStr) {
  // TODO: "2026-01-25" → "January 25, 2026"
}
