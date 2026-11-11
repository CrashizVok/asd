# Custom hook: useFetch

React command · Hooks

A custom hook is a function that calls other hooks and returns state. This one fetches JSON and cancels stale requests.

## Syntax

```jsx
function useFetch(url) { ... return { data, error, loading }; }
```

## Example

```jsx
import { useEffect, useState } from "react";

function useFetch(url) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("HTTP " + response.status);
        return response.json();
      })
      .then(setData)
      .catch((caught) => {
        if (caught.name !== "AbortError") setError(caught);
      })
      .finally(() => setLoading(false));

    // Cleanup aborts the request when url changes or the component unmounts
    return () => controller.abort();
  }, [url]);

  return { data, error, loading };
}

export default function HotelList() {
  const { data, error, loading } = useFetch("/api/hotels");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;
  return <ul>{data.map((hotel) => <li key={hotel.hotel_id}>{hotel.name}</li>)}</ul>;
}
```
