document.addEventListener('DOMContentLoaded', initCalendar);

function initCalendar() {
  const data = CALENDAR_DATA;
  const startDate = parseDate(data.startDate);
  const endDate = parseDate(data.endDate);

  populateHeader(data, startDate, endDate);
  renderGrid(startDate, endDate, data.days);
}

function populateHeader(data, startDate, endDate) {
  if (data.title) {
    document.querySelector('.calendar-title').textContent = data.title;
  }
  if (data.hebrewRange) {
    document.querySelector('.calendar-range-hebrew').textContent = data.hebrewRange;
  }
  document.querySelector('.calendar-range-gregorian').textContent =
    formatDateRange(startDate, endDate);
}

function renderGrid(startDate, endDate, days) {
  const grid = document.querySelector('.calendar-grid');
  const dayLabels = [...grid.querySelectorAll('.day-label')];

  grid.innerHTML = '';
  dayLabels.forEach(label => grid.appendChild(label));

  for (const date of eachDay(startDate, endDate)) {
    const dayData = days[toDateKey(date)];
    const status = dayData?.status ?? 'no-data';

    const cell = document.createElement('div');
    cell.className = `day ${status}`;
    cell.textContent = formatShortDate(date);
    grid.appendChild(cell);
  }
}

// Date utilities

function parseDate(str) {
  return new Date(str + 'T00:00:00');
}

function toDateKey(date) {
  return date.toLocaleDateString('sv-SE'); // Returns YYYY-MM-DD
}

function formatShortDate(date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDateRange(start, end) {
  const sameYear = start.getFullYear() === end.getFullYear();
  const sameMonth = sameYear && start.getMonth() === end.getMonth();

  if (sameMonth) {
    const month = start.toLocaleDateString('en-US', { month: 'long' });
    return `${month} ${start.getDate()} – ${end.getDate()}, ${start.getFullYear()}`;
  }

  const opts = { month: 'long', day: 'numeric' };
  const startStr = start.toLocaleDateString('en-US', opts);
  const endStr = end.toLocaleDateString('en-US', opts);

  if (sameYear) {
    return `${startStr} – ${endStr}, ${start.getFullYear()}`;
  }
  return `${startStr}, ${start.getFullYear()} – ${endStr}, ${end.getFullYear()}`;
}

function* eachDay(start, end) {
  const current = new Date(start);
  while (current <= end) {
    yield new Date(current);
    current.setDate(current.getDate() + 1);
  }
}
