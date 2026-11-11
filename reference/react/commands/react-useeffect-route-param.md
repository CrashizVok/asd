# effect on a route parameter

React command · Effects

The route parameter is the dependency. Without it, navigating between two ids keeps the data of the first one, because the component does not remount.

## Syntax

```jsx
useEffect(() => { load(id); }, [id])
```

## Example

```jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Data shape: bookings = [{ booking_id, start_date, end_date, adults }]
export default function HotelBookings() {
  const { id } = useParams(); // always a string
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    getBookingsByHotel(Number(id), controller.signal)
      .then(setBookings)
      .catch((error) => {
        if (error.name !== "AbortError") setBookings([]);
      });

    return () => controller.abort();
  }, [id]);

  return <List items={bookings} />;
}
```

## Details

A route like `/hotels/:id/bookings` keeps the same component mounted when the id changes, so `useState` keeps the old array. Only the effect can notice the new parameter.

A common wrong fix is a `key` prop on the route element, which forces a remount and drops all state. It works, but it is a blunt tool: every navigation loses scroll position and form input. The dependency array is the precise one.

`useParams` returns strings. Convert to a number when the API expects one, or the request goes out as `/api/hotels/7/bookings` in one place and `/api/hotels/"7"/bookings` in another.
