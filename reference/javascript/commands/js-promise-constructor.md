# new Promise()

JavaScript command · Promises

Creates a promise. The executor runs immediately and synchronously. A throw inside it rejects the promise.

## Syntax

```js
new Promise((resolve, reject) => { ... })
```

## Example

```js
function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

wait(300).then(() => console.log("done"));
```

## Details

A promise settles once. Calling `resolve` after `reject` or the reverse does nothing. Do not wrap a function that already returns a promise; return it unchanged.
