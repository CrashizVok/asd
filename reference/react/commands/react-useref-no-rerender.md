# ref write does not render

React command · Refs

A ref assignment is a plain property write. React does not track it, so the screen only updates when something else renders.

## Syntax

```jsx
ref.current = nextValue;
```

## Example

```jsx
import { useRef, useState } from "react";

function ClickCounter() {
  const clicksRef = useRef(0);
  const [renders, setRenders] = useState(0);

  return (
    <section>
      <button
        onClick={() => {
          clicksRef.current += 1;
          console.log(clicksRef.current); // updates immediately
        }}
      >
        Log a click
      </button>

      <button onClick={() => setRenders((value) => value + 1)}>
        Render
      </button>

      {/* This number looks stale until another render happens. */}
      <p>Clicks in ref: {clicksRef.current}</p>
      <p>Renders: {renders}</p>
    </section>
  );
}
```

## Details

If the number must change on screen at the moment of the click, it belongs in state. A ref is for values the user does not see, or for values that another render will display later.
