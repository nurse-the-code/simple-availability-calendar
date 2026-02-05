// In the browser, date-helpers.js is loaded via script tag (globals).
// In Node/Vitest, we need to require it explicitly.
if (typeof require !== "undefined") {
  var { isSaturday, isFriday } = require("./date-helpers.js");
}

// =============================================================================
// Helpers
// =============================================================================

const VALID_STATUSES = ["available", "partial", "unavailable"];

const LEGEND_LABELS = {
  available: "Available",
  partial: "Limited availability",
  unavailable: "Unavailable",
  "no-data": "Ask Malachi",
};

const LEGEND_ORDER = ["available", "partial", "unavailable", "no-data"];

function availabilityClass(day) {
  if (VALID_STATUSES.includes(day.status)) return day.status;
  return "no-data";
}

function collectStatuses(days) {
  return new Set(Object.values(days).map(availabilityClass));
}

// =============================================================================
// Data merging
// =============================================================================

function mergeCalendarData(dates, statuses) {
  const days = {};
  for (const dateStr of Object.keys(dates.days)) {
    days[dateStr] = {};
    if (statuses.days[dateStr]?.status) {
      days[dateStr].status = statuses.days[dateStr].status;
    }
    if (statuses.days[dateStr]?.notes) {
      days[dateStr].notes = statuses.days[dateStr].notes;
    }

    if (isSaturday(dateStr)) {
      days[dateStr].status = "unavailable";
    } else if (isFriday(dateStr) && days[dateStr].status === "available") {
      days[dateStr].status = "partial";
    }
  }
  return {
    title: statuses.title || "Malachi's Availability Calendar",
    startDate: dates.startDate,
    endDate: dates.endDate,
    days,
  };
}

if (typeof document !== "undefined") {
  var CALENDAR_DATA = mergeCalendarData(
    CALENDAR_DATES,
    typeof CALENDAR_STATUSES !== "undefined" ? CALENDAR_STATUSES : { days: {} },
  );
}

// =============================================================================
// Components (render UI elements)
// =============================================================================

function renderTitle() {
  document.querySelector(".calendar-title").textContent = CALENDAR_DATA.title;
}

function renderStartDate() {
  const startTime = document.createElement("time");
  startTime.setAttribute("datetime", CALENDAR_DATA.startDate);
  startTime.textContent = formatLong(CALENDAR_DATA.startDate);
  return startTime;
}

function renderEndDate() {
  const endTime = document.createElement("time");
  endTime.setAttribute("datetime", CALENDAR_DATA.endDate);
  endTime.textContent = formatLongWithYear(CALENDAR_DATA.endDate);
  return endTime;
}

function renderGregorianRange() {
  const container = document.querySelector(".calendar-range-gregorian");
  container.appendChild(renderStartDate());
  container.appendChild(document.createTextNode(" – "));
  container.appendChild(renderEndDate());
}

function renderHebrewRange() {
  document.querySelector(".calendar-range-hebrew").textContent =
    CALENDAR_DATA.hebrewRange;
}

function renderLegend() {
  const legend = document.querySelector(".calendar-legend");
  const statuses = collectStatuses(CALENDAR_DATA.days);
  for (const status of LEGEND_ORDER) {
    if (!statuses.has(status)) continue;
    const item = document.createElement("div");
    item.className = "legend-item";
    const color = document.createElement("span");
    color.className = "legend-color " + status;
    item.appendChild(color);
    item.appendChild(document.createTextNode(" " + LEGEND_LABELS[status]));
    legend.appendChild(item);
  }
}

function renderHeader() {
  renderTitle();
  renderGregorianRange();
  renderHebrewRange();
  renderLegend();
}

function renderDay(dateStr) {
  const cell = document.createElement("div");
  cell.className = "day " + availabilityClass(CALENDAR_DATA.days[dateStr]);
  cell.dataset.date = dateStr;
  cell.textContent = formatShort(dateStr);
  return cell;
}

function renderGrid() {
  const grid = document.querySelector(".calendar-grid");
  for (const dateStr of Object.keys(CALENDAR_DATA.days)) {
    grid.appendChild(renderDay(dateStr));
  }
}

// =============================================================================
// Tooltips
// =============================================================================

function buildTooltipContent(dateStr) {
  const day = CALENDAR_DATA.days[dateStr];

  const container = document.createElement("div");
  container.className = "tooltip-content";

  const dateEl = document.createElement("div");
  dateEl.className = "tooltip-date";
  dateEl.textContent = formatFullDate(dateStr);
  container.appendChild(dateEl);

  if (day.notes) {
    const notesEl = document.createElement("div");
    notesEl.className = "tooltip-notes";
    notesEl.textContent = day.notes;
    container.appendChild(notesEl);
  }

  return container;
}

function initTooltips() {
  const grid = document.querySelector(".calendar-grid");
  const tooltip = document.createElement("div");
  tooltip.className = "tooltip";
  tooltip.hidden = true;
  document.body.appendChild(tooltip);

  grid.addEventListener(
    "mouseenter",
    (e) => {
      const cell = e.target.closest(".day[data-date]");
      if (!cell) return;

      const dateStr = cell.dataset.date;

      tooltip.innerHTML = "";
      tooltip.appendChild(buildTooltipContent(dateStr));

      const rect = cell.getBoundingClientRect();
      tooltip.style.left = rect.left + rect.width / 2 + "px";
      tooltip.style.top = rect.bottom + 8 + "px";
      tooltip.hidden = false;
    },
    true,
  );

  grid.addEventListener(
    "mouseleave",
    (e) => {
      const cell = e.target.closest(".day[data-date]");
      if (!cell) return;
      tooltip.hidden = true;
    },
    true,
  );
}

// =============================================================================
// Initialization
// =============================================================================

function initCalendar() {
  renderHeader();
  renderGrid();
  initTooltips();
}

if (typeof document !== "undefined") {
  initCalendar();
}

if (typeof module !== "undefined") {
  module.exports = { mergeCalendarData, availabilityClass, collectStatuses };
}
