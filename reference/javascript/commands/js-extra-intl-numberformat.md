# Intl.NumberFormat

JavaScript command · Intl

Formats numbers with the grouping, currency, and unit rules of a locale. Reuse the formatter instead of rebuilding it in a loop.

## Syntax

```js
new Intl.NumberFormat(locale, options).format(number)
```

## Example

```js
const price = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});
console.log(price.format(1250)); // "$1,250.00"

// Percent takes a fraction, so 0.25 is 25%
const percent = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 0
});
console.log(percent.format(0.25)); // "25%"

// Plain grouping without decimals
const count = new Intl.NumberFormat("de-DE");
console.log(count.format(1234567)); // "1.234.567"
```
