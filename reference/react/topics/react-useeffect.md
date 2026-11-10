# useEffect

React topic · Exam Wiki

```jsx
import { useEffect, useState } from 'react';

function Hotels() {
    const [hotels, setHotels] = useState([]);

    useEffect(() => {
        let active = true;

        fetch('/api/hotels')
            .then(response => response.json())
            .then(data => {
                if (active) {
                    setHotels(data);
                }
            });

        return () => {
            active = false;
        };
    }, []);

    return <ul>{hotels.map(h => <li key={h.id}>{h.name}</li>)}</ul>;
}
```

The dependency array controls when the effect runs:

| Array | When |
|---|---|
| `[]` | Once after the first render |
| `[id]` | After the first render and whenever `id` changes |
| no array | After every render, usually a bug |

React StrictMode runs effects twice in development. The cleanup function and the `active` flag keep the second run from setting state after the first one is gone. This is normal, not a production bug.

Do not use an effect for a value you can calculate during render. Derive it instead.
