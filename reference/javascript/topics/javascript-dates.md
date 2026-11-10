# Dates

JavaScript topic · Exam Wiki

```js
const d = new Date("2026-11-10T14:00:00");
d.getFullYear();
d.getMonth();      // 0 based, January is 0
d.getDate();       // day of month
d.toISOString();   // "2026-11-10T13:00:00.000Z"
Date.now();        // milliseconds since 1970
```
Month is zero based, which causes most date bugs. Compare with `getTime()`. `new Date("2026-11-10")` is UTC midnight; `new Date(2026, 10, 10)` is local.
