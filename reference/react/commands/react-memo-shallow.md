# React.memo

React command · Memoization

Skips a re-render when every prop is equal by Object.is. One level deep only.

## Syntax

```jsx
const Row = memo(RowBase);
```

## Example

```jsx
import { memo } from 'react';

const RoomRow = memo(function RoomRow({ room, onSelect }) {
    return (
        <li>
            {room.name}
            <button onClick={() => onSelect(room.id)}>Open</button>
        </li>
    );
});

// Parent must pass stable props or this does nothing:
// <RoomRow room={room} onSelect={selectRoom} />
```

## Details

A new object, array, or arrow function from the parent fails the comparison, so `memo` is common and often useless. It also does not block re-renders caused by the component's own state, or by a context it reads.
