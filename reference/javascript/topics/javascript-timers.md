# Timers

JavaScript topic · Exam Wiki

```js
const timeout = setTimeout(() => {
    console.log("runs once");
}, 1000);

const interval = setInterval(() => {
    console.log("every second");
}, 1000);

clearTimeout(timeout);
clearInterval(interval);
```

`setTimeout` runs once after a delay; `setInterval` repeats. The delay is milliseconds, not seconds. Store the id so you can cancel it, especially in a React cleanup function.
