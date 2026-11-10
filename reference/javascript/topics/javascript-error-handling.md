# Error handling

JavaScript topic · Exam Wiki

```js
try {
  const data = JSON.parse(text);
  save(data);
} catch (err) {
  console.error("Bad JSON:", err.message);
} finally {
  spinner.hidden = true;
}
```
`finally` always runs. Rethrow when the caller must know: `throw new Error("context", { cause: err })`. Custom errors extend `Error`.
