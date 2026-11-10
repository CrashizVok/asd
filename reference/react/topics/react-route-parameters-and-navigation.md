# Route parameters and navigation

React topic · Exam Wiki

```jsx
import { Link, useNavigate, useParams } from 'react-router-dom';

function Bookings() {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <>
            <Link to="/">Back</Link>
            <button onClick={() => navigate(`/hotels/${id}`)}>Open</button>
        </>
    );
}
```

`useParams` returns strings. Convert with `Number(id)` when the API needs a number.

The effect must depend on the route parameter:

```jsx
useEffect(() => {
    getBookingsByHotel(id);
}, [id]);
```

Without `[id]`, navigating from hotel 1 to hotel 2 keeps the old data.
