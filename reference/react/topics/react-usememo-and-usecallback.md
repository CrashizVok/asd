# useMemo and useCallback

React topic · Exam Wiki

```jsx
import { useCallback, useMemo } from "react";

function RoomList({ rooms, onPick }) {
    const sorted = useMemo(
        () => [...rooms].sort((a, b) => a.price - b.price),
        [rooms]
    );

    const handlePick = useCallback((id) => onPick(id), [onPick]);

    return sorted.map((room) => (
        <button key={room.id} onClick={() => handlePick(room.id)}>
            {room.name}
        </button>
    ));
}
```

`useMemo` caches a calculated value; `useCallback` caches a function. Both only help when the result is passed to a memoized child or used in a dependency array. Do not wrap every value; the dependency check has a cost.
