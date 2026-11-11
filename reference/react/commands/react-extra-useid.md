# useId

React command · Hooks

Produces a stable id that matches between server and client render. Use it to link labels and inputs instead of hardcoded ids.

## Syntax

```jsx
const id = useId()
```

## Example

```jsx
import { useId } from "react";

function EmailField({ label }) {
  const id = useId();

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} type="email" name="customer_email" />
      {/* aria-describedby can point at a second generated id */}
      <p id={id + "-hint"}>We send the confirmation here.</p>
      <input aria-describedby={id + "-hint"} />
    </div>
  );
}
```
