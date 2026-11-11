# useImperativeHandle

React command · Advanced

Exposes a small custom API from a child instead of the raw DOM node. Use it when a parent must call an action, not read the internals.

## Syntax

```jsx
useImperativeHandle(ref, () => ({ focus }), deps)
```

## Example

```jsx
import { forwardRef, useImperativeHandle, useRef } from "react";

const FancyInput = forwardRef(function FancyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current?.focus();
    },
    clear() {
      if (inputRef.current) inputRef.current.value = "";
    },
  }), []);

  return <input ref={inputRef} {...props} />;
});

function Toolbar() {
  const fancyRef = useRef(null);

  return (
    <section>
      <FancyInput ref={fancyRef} placeholder="Hotel name" />
      <button onClick={() => fancyRef.current?.focus()}>Focus</button>
      <button onClick={() => fancyRef.current?.clear()}>Clear</button>
    </section>
  );
}
```

## Details

The array works like the dependencies of `useMemo`. If a method reads a prop, list that prop so the parent receives an updated handle.

Keep the API small. A handle with many getters means the parent should receive props or lifted state instead.
