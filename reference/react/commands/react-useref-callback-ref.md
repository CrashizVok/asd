# callback ref

React command · Advanced

A function ref receives the node on attach and null on detach. Runs at commit time, so layout reads are safe there.

## Syntax

```jsx
ref={(node) => { /* store node */ }}
```

## Example

```jsx
import { useCallback, useState } from "react";

function MeasuredBox() {
  const [height, setHeight] = useState(0);

  // Stable identity, otherwise React detaches and reattaches each render.
  const measure = useCallback((node) => {
    if (!node) return;
    setHeight(node.getBoundingClientRect().height);
  }, []);

  return (
    <section>
      <div ref={measure} className="box">
        Content with an unknown height
      </div>
      <p>Height: {height} px</p>
    </section>
  );
}
```

## Details

An inline arrow is a new function on every render, so React calls the old ref with `null` and the new one with the node. That is fine for a measurement and wrong for a subscription.

On React 19 a callback ref may return a cleanup function. An assignment expression such as `ref={(node) => (map.current[id] = node)}` returns the node, which React treats as a cleanup. Use braces to return undefined.
