# loading, error, empty states

React command · Effects

Every fetch needs three states: loading, error, and empty. The exam checks them.

## Syntax

```jsx
if (loading) ... if (error) ... if (!items.length) ...
```

## Example

```jsx
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [items, setItems] = useState([]);

if (loading) return <p>Loading...</p>;
if (error) return <p className="error">{error}</p>;
if (!items.length) return <p>No bookings yet.</p>;
```
