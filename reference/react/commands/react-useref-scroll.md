# scroll to an element

React command · DOM

Scrolls a node into view after it is committed. Use a marker ref at the end of a list for a chat style auto scroll.

## Syntax

```jsx
elementRef.current?.scrollIntoView(options)
```

## Example

```jsx
import { useEffect, useRef } from "react";

function MessageList({ messages }) {
  // Marker placed after the last message.
  const endRef = useRef(null);

  useEffect(() => {
    // Runs after the new message is in the DOM.
    endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="messages">
      {messages.map((message) => (
        <p key={message.id}>{message.text}</p>
      ))}
      <div ref={endRef} />
    </div>
  );
}
```

## Details

For a scroll container, `container.scrollTop = container.scrollHeight` is the alternative when you also need to read the old position and decide whether the user was at the bottom.

Use `useLayoutEffect` instead of `useEffect` when the jump must happen before the browser paints.
