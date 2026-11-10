# useEffect

React command · Effects

Runs side effects after render. The dependency array controls when it runs. Return a cleanup function for timers, subscriptions, or requests.

## Syntax

```jsx
useEffect(() => { ... }, [deps]);
```

## Example

```jsx
import { useEffect, useState } from "react";

function Hotels() {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    let active = true;
    fetch("/api/hotels")
      .then((response) => response.json())
      .then((data) => {
        if (active) setHotels(data);
      });

    return () => {
      active = false;
    };
  }, []);

  return <List items={hotels} />;
}
```
