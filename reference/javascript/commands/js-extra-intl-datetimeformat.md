# Intl.DateTimeFormat

JavaScript command · Intl

Formats a Date for a locale. Always pass a time zone when the output must be stable across machines.

## Syntax

```js
new Intl.DateTimeFormat(locale, options).format(date)
```

## Example

```js
const date = new Date(Date.UTC(2026, 10, 11, 14, 30));

const medium = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeZone: "UTC"
});
console.log(medium.format(date)); // "11 Nov 2026"

// dateStyle and timeStyle cannot be mixed with year, month, day fields
const short = new Intl.DateTimeFormat("en-US", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "UTC"
});
console.log(short.format(date)); // "11/11/26, 2:30 PM"

// formatToParts exposes each piece when you need one value
const parts = medium.formatToParts(date);
console.log(parts.find((part) => part.type === "year").value); // "2026"
```
