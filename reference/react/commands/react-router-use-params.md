# useParams()

React command · Hooks

Returns the dynamic segments of the matched route as strings, or an empty object when the route has none.

## Syntax

```jsx
const { hotel_id } = useParams();
```

## Example

```jsx
import { useParams, Link } from 'react-router-dom';

function HotelDetail() {
    // '/hotels/7' gives { hotel_id: '7' }, always a string
    const { hotel_id } = useParams();
    const id = Number(hotel_id);

    if (!Number.isInteger(id)) return <p>Bad id.</p>;
    return <Link to={`/hotels/${id}/book`}>Book</Link>;
}
```

## Details

Two traps. The value is a string, so `hotel_id === 7` is false and a lookup by number quietly fails. And a changed param does not always remount the component, so a fetch effect must list it:

```jsx
useEffect(() => {
    fetch(`/api/hotels/${hotel_id}`).then(...);
}, [hotel_id]);
```

With the `element` API the component remounts on a path change; with the data router `Component` API it does not. The dependency array is correct either way.
