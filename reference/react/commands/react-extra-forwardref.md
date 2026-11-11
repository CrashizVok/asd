# forwardRef

React command · Components

Passes a ref through a function component to a DOM node. React 19 accepts ref as a normal prop, older versions need this wrapper.

## Syntax

```jsx
const Input = forwardRef((props, ref) => ...)
```

## Example

```jsx
import { forwardRef, useRef } from "react";

// Without forwardRef the ref would stay on the component, not the input
const TextInput = forwardRef(function TextInput(props, ref) {
  return <input ref={ref} {...props} />;
});

export default function Form() {
  const emailRef = useRef(null);

  function focusEmail() {
    emailRef.current.focus();
  }

  return (
    <form>
      <TextInput ref={emailRef} name="customer_email" />
      <button type="button" onClick={focusEmail}>Focus email</button>
    </form>
  );
}
```
