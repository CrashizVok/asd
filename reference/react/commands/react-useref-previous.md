# previous value

React command · Patterns

Keeps the value from the previous render in a ref. The effect updates the ref after the render that used the new value.

## Syntax

```jsx
const previous = usePrevious(value);
```

## Example

```jsx
import { useEffect, useRef, useState } from "react";

function usePrevious(value) {
  const previousRef = useRef(undefined);

  useEffect(() => {
    previousRef.current = value;
  }, [value]);

  return previousRef.current;
}

function CityFilter() {
  const [city, setCity] = useState("Budapest");
  const previousCity = usePrevious(city);

  return (
    <section>
      <input value={city} onChange={(event) => setCity(event.target.value)} />
      <p>Now: {city}</p>
      <p>Before: {previousCity ?? "(none)"}</p>
    </section>
  );
}
```

## Details

On the first render the hook returns `undefined`, because no earlier value exists. Do not update the ref in the component body to get the value one render sooner: a render can run twice or be discarded, and the ref would then hold a value the user never saw.
