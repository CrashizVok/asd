# memo with compare

React command · Memoization

Custom comparison. Return true when the props count as equal, which skips the render.

## Syntax

```jsx
memo(Component, (prevProps, nextProps) => boolean)
```

## Example

```jsx
const Row = memo(
    function Row({ room, onSelect }) {
        return <li onClick={() => onSelect(room.id)}>{room.name}</li>;
    },
    (prev, next) => prev.room.id === next.room.id && prev.onSelect === next.onSelect
);
```

## Details

The return value is inverted compared with `shouldComponentUpdate`: `true` means equal, so no render. Keep the comparison cheap and make sure every prop the component reads is covered, or it will show stale data.
