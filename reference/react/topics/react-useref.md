# useRef

React topic · Exam Wiki

```jsx
import { useEffect, useRef } from "react";

function SearchBox() {
    const inputRef = useRef(null);
    const renders = useRef(0);

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    renders.current += 1;

    return <input ref={inputRef} placeholder="Search" />;
}
```

`useRef` returns an object with a `current` field. Changing `current` does not re-render. Use it for a DOM node or a value that must survive renders, such as a timer id.
