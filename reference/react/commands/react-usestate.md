# useState

React command · State

Adds state to a function component. The setter replaces the value and triggers a re-render. Use the updater form when the next value depends on the old one.

## Syntax

```jsx
const [value, setValue] = useState(initial);
```

## Example

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount((old) => old + 1)}>
      Clicked {count} times
    </button>
  );
}
```
