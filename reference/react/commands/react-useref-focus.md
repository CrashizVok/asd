# focus after render

React command · DOM

Moves keyboard focus to a field after React inserts it. Guard against null because the node may already be gone.

## Syntax

```jsx
inputRef.current?.focus()
```

## Example

```jsx
import { useEffect, useRef, useState } from "react";

function LoginForm() {
  const emailRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Focus again whenever a new error appears.
    if (error) emailRef.current?.focus();
  }, [error]);

  function handleSubmit(event) {
    event.preventDefault();
    const email = event.target.customer_email.value;

    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }

    setError("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input ref={emailRef} name="customer_email" />
      {error && <p role="alert">{error}</p>}
      <button>Sign in</button>
    </form>
  );
}
```
