# Conditional rendering

React topic · Exam Wiki

```jsx
{loading && <p>Loading...</p>}
{error && <p className="error">{error}</p>}
{!loading && !error && items.length === 0 && <p>No data.</p>}

{user ? <Dashboard user={user} /> : <Login />}
```

`&&` returns the left side when it is falsy. A `0` would render as `0`, so use `items.length > 0 && ...` when the left side can be a number.
