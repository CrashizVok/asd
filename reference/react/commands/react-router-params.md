# useParams

React command · Routing

Reads dynamic segments from the route path. The parameter name must match the path.

## Syntax

```jsx
const { id } = useParams();
```

## Example

```jsx
<Route path="/hotels/:id" element={<Bookings />} />

function Bookings() {
  const { id } = useParams();
  useEffect(() => {
    loadBookings(id);
  }, [id]);
}
```
