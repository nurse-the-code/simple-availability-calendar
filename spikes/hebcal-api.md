# @hebcal/core API Exploration

## Overview

Researched `@hebcal/core` v6 for converting Gregorian dates to Hebrew dates.

## Key Findings

### ESM-Only

v6 dropped CommonJS support. Must use dynamic `import()` from CJS files:

```js
const { HDate, Locale } = await import("@hebcal/core");
```

### HDate API

```js
const hd = new HDate(new Date(2026, 1, 1)); // Feb 1, 2026

hd.getDate(); // 14          (day of Hebrew month)
hd.getMonthName(); // "Sh'vat"    (always English transliteration)
hd.getFullYear(); // 5786        (Hebrew year)
hd.toString(); // "14 Sh'vat 5786"
hd.render("en"); // "14th of Sh'vat, 5786"
```

### Ashkenazi Transliteration

Minimal — only one month differs:

| English | Ashkenazi |
| ------- | --------- |
| Tevet   | Teves     |

All other months are identical in both locales.

```js
hd.render("ashkenazi"); // "14th of Sh'vat, 5786" (ordinal format)
Locale.gettext("Tevet", "ashkenazi"); // "Teves"
Locale.gettext("Sh'vat", "ashkenazi"); // "Sh'vat" (unchanged)
```

Available locales: `'en'`, `'ashkenazi'`, `'he'`, `'he-x-nonikud'`

### Chosen Format

Build from parts for clean output with Ashkenazi support:

```js
`${hd.getDate()} ${Locale.gettext(hd.getMonthName(), "ashkenazi")} ${hd.getFullYear()}`;
// → "14 Sh'vat 5786"
```

## CLI Reference (hebcal)

```
$ hebcal -d -g -h 2 2026
2026-02-01 14th of Sh'vat, 5786
2026-02-17 30th of Sh'vat, 5786
2026-02-18 1st of Adar, 5786
2026-02-28 11th of Adar, 5786

$ hebcal -d -g -h 4 2026 | head -4
2026-04-01 14th of Nisan, 5786
2026-04-04 17th of Nisan, 5786
```

## Reference Dates for Tests

| Gregorian  | Hebrew         |
| ---------- | -------------- |
| 2026-02-01 | 14 Sh'vat 5786 |
| 2026-02-17 | 30 Sh'vat 5786 |
| 2026-02-18 | 1 Adar 5786    |
| 2026-02-28 | 11 Adar 5786   |
| 2026-04-04 | 17 Nisan 5786  |
