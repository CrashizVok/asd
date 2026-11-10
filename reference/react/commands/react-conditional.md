# conditional rendering

React command · Rendering

Use && for a simple show/hide and a ternary when there are two alternatives. Do not put a number on the left of && because 0 renders.

## Syntax

```jsx
{loading && <p>Loading...</p>}
{error ? <Error /> : <List />}
```

## Example

```jsx
function Results({ loading, error, items }) {
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!items.length) return <p>No results.</p>;

  return <List items={items} />;
}
```
