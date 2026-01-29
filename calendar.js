// =============================================================================
// Components (render UI elements)
// =============================================================================

function renderTitle() {
  document.querySelector('.calendar-title').textContent = CALENDAR_DATA.title;
}

function renderStartDate() {
  const startTime = document.createElement('time');
  startTime.setAttribute('datetime', CALENDAR_DATA.startDate);
  startTime.textContent = formatLong(CALENDAR_DATA.startDate);
  return startTime;
}

function renderEndDate() {
  const endTime = document.createElement('time');
  endTime.setAttribute('datetime', CALENDAR_DATA.endDate);
  endTime.textContent = formatLongWithYear(CALENDAR_DATA.endDate);
  return endTime;
}

function renderGregorianRange() {
  const container = document.querySelector('.calendar-range-gregorian');
  container.appendChild(renderStartDate());
  container.appendChild(document.createTextNode(' – '));
  container.appendChild(renderEndDate());
}

function renderHebrewRange() {
  document.querySelector('.calendar-range-hebrew').textContent = CALENDAR_DATA.hebrewRange;
}

function renderHeader() {
  renderTitle();
  renderGregorianRange();
  renderHebrewRange();
}

function renderGrid() {
  // TODO: Generate date cells from startDate and endDate
}

// =============================================================================
// Initialization
// =============================================================================

function initCalendar() {
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
