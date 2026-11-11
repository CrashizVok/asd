# ref forwarding

React command · Advanced

Passes a parent ref through a function component to a DOM node. React 19 also accepts ref as a normal prop.

## Syntax

```jsx
const Child = forwardRef(function Child(props, ref) { ... });
```

## Example

```jsx
import { forwardRef, useRef } from "react";

// React 18 shape. On React 19 this also works and stays portable.
const TextField = forwardRef(function TextField({ label, ...rest }, ref) {
  return (
    <label>
      {label}
      <input ref={ref} {...rest} />
    </label>
  );
});

TextField.displayName = "TextField";

function Form() {
  const emailRef = useRef(null);

  return (
    <form>
      <TextField ref={emailRef} label="Email" name="customer_email" />
      <button type="button" onClick={() => emailRef.current?.focus()}>
        Focus email
      </button>
    </form>
  );
}
```

## Details

On React 19 the wrapper is optional:

```jsx
function TextField({ label, ref, ...rest }) {
  return <label>{label}<input ref={ref} {...rest} /></label>;
}
```

Without either form, the parent ref stays `null` and React warns. Set `displayName` so DevTools and warnings name the component.
