# check response.ok

React command · Effects

fetch resolves on 404 and 500, so a missing ok check turns a server error into an empty list.

## Syntax

```jsx
if (!response.ok) throw new Error(`HTTP ${response.status}`)
```

## Example

```jsx
async function load() {
  const response = await fetch("/api/hotels");

  if (!response.ok) {
    // 404 and 500 land here. Without the check the error body is parsed as hotels.
    throw new Error(`HTTP ${response.status}`);
  }

  setHotels(await response.json());
}
```

## Details

Only a network failure rejects the promise. A 404, a 401 or a 500 all resolve, with `ok` false and a body that is usually an error object. Rendering that body as a list gives `undefined` rows and a blank screen instead of an error message.

The four states of a data component:

```jsx
if (loading) return <p>Loading...</p>;
if (error) return <p className="error">{error}</p>;
if (!hotels.length) return <p>No hotels.</p>;
return <List items={hotels} />;
```

Axios behaves the other way: it rejects on 4xx and 5xx, so its `catch` covers both cases and the `ok` check is unnecessary.
