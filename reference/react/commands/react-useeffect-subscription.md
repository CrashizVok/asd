# subscribe and unsubscribe

React command · Effects

Adds a listener or store subscription after mount and removes it on unmount and before every re-run. The handler must be the same reference in both calls.

## Syntax

```jsx
useEffect(() => { target.addEventListener(type, handler); return () => target.removeEventListener(type, handler); }, [deps])
```

## Example

```jsx
import { useEffect, useState } from "react";

// Data shape: online: boolean
function useOnline() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    function update() {
      setOnline(navigator.onLine);
    }

    window.addEventListener("online", update);
    window.addEventListener("offline", update);

    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  return online;
}
```

## Details

Declaring the handler inside the effect keeps it out of the dependency array and gives both `add` and `remove` the same reference. A handler declared in the component body is a new function every render, so `[update]` resubscribes on every render.

When the handler reads a component value, that value goes in the array:

```jsx
useEffect(() => {
  function onMessage(event) {
    append(event.data, roomId);
  }

  socket.on("message", onMessage);
  return () => socket.off("message", onMessage);
}, [roomId]);
```

Without `[roomId]` the first room id is captured forever. The user switches rooms, the socket stays in the old one, and the bug looks like a server problem.
