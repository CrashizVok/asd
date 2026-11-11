# fetch with AbortController

React command · Effects

Aborts the request when the effect is cleaned up. Stops the response from setting state after unmount and stops a slow response from overwriting a newer one.

## Syntax

```jsx
const controller = new AbortController(); fetch(url, { signal: controller.signal })
```

## Example

```jsx
import { useEffect, useState } from "react";

// Data shape: hotels = [{ hotel_id, name, city, stars }]
export default function Hotels({ city }) {
  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const response = await fetch(
          `/api/hotels?city=${encodeURIComponent(city)}`,
          { signal: controller.signal }
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        setHotels(await response.json());
      } catch (caught) {
        if (caught.name !== "AbortError") setError("Could not load hotels.");
      }
    }

    load();
    return () => controller.abort();
  }, [city]);

  return error ? <p className="error">{error}</p> : <List items={hotels} />;
}
```

## Details

`abort()` makes the pending `fetch` reject with a `DOMException` whose `name` is `AbortError`. That rejection is expected and must not be shown to the user, which is why the catch checks the name before setting an error message.

One controller per effect run. A controller created outside the effect is shared by every run and aborts requests it does not own.

Aborting does not remove the need for the `response.ok` check. A 404 resolves normally, with `ok` set to false, and calling `response.json()` on it usually gives an error object that your list rendering will choke on.
