# await with try/catch

JavaScript command · Errors

Turns a rejected promise into a caught exception. finally runs on both paths and is the place to reset loading state.

## Syntax

```js
try { const value = await p; } catch (error) { ... }
```

## Example

```js
async function loadPage() {
  try {
    const hotels = await loadHotels();
    render(hotels);
  } catch (error) {
    renderError(error.message);
  } finally {
    hideSpinner();
  }
}
```
