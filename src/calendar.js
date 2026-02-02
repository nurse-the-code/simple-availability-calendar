// =============================================================================
// Data merging
// =============================================================================

function mergeCalendarData(dates, statuses) {
  const days = {};
  for (const dateStr of Object.keys(dates.days)) {
    days[dateStr] = {};
  }
  return {
    title: statuses.title || "Malachi's Availability Calendar",
    startDate: dates.startDate,
    endDate: dates.endDate,
    days,
  };
}

if (typeof document !== 'undefined') {
  var CALENDAR_DATA = mergeCalendarData(
    CALENDAR_DATES,
    typeof CALENDAR_STATUSES !== 'undefined' ? CALENDAR_STATUSES : { days: {} },
  );
}

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

function renderDay(dateStr) {
  const cell = document.createElement('div');
  cell.className = 'day no-data';
  cell.textContent = formatShort(dateStr);
  return cell;
}

function renderGrid() {
  const grid = document.querySelector('.calendar-grid');
  for (const dateStr of Object.keys(CALENDAR_DATA.days)) {
    grid.appendChild(renderDay(dateStr));
  }
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

if (typeof module !== 'undefined') {
  module.exports = { mergeCalendarData };
}

