# try, catch, finally, throw

JavaScript command · Errors

Handles errors. throw raises one. finally runs whether or not an error happened.

## Syntax

```js
try { ... } catch (error) { ... } finally { ... }
```

## Example

```js
try {
  const data = JSON.parse(text);
  console.log(data);
} catch (error) {
  console.error("Bad JSON:", error.message);
} finally {
  console.log("done");
}
```
