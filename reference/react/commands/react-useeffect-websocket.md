# WebSocket in an effect

React command · Effects

Opens the socket after mount, closes it in the cleanup, and depends on the room or url so a change reconnects to the right place.

## Syntax

```jsx
const socket = new WebSocket(url); return () => socket.close();
```

## Example

```jsx
import { useEffect, useState } from "react";

// Data shape: messages = [{ id, text }]
export default function Room({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("connecting");

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:4000/rooms/${roomId}`);

    socket.addEventListener("open", () => setStatus("open"));
    socket.addEventListener("message", (event) => {
      const next = JSON.parse(event.data);
      setMessages((current) => [...current, next]);
    });
    socket.addEventListener("close", () => setStatus("closed"));

    // Closes the socket for this run only. The next run opens a fresh one.
    return () => socket.close();
  }, [roomId]);

  return (
    <>
      <p>{status}</p>
      {messages.map((message) => <p key={message.id}>{message.text}</p>)}
    </>
  );
}
```

## Details

A socket left open keeps the server connection and the component state alive. Ten room changes leave ten sockets and ten copies of every message.

The `close` event fires during cleanup too. Guard the status update if a closed socket would flash the UI on the way out:

```jsx
return () => {
  socket.onclose = null; // stop the handler before closing
  socket.close();
};
```

Reconnect logic does not belong in the render. If you need retries, put a `setTimeout` inside the effect and clear it in the cleanup, or use a small custom hook that owns the whole lifecycle.
