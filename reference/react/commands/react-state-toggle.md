# toggle boolean state

React command · State updates

Flips a boolean through the updater form so rapid clicks each see the last value.

## Syntax

```jsx
setOpen(open => !open)
```

## Example

```jsx
const [open, setOpen] = useState(false);

// Wrong for two clicks in one tick: both handlers read the same `open`,
// so the panel opens and stays open.
// onDoubleClick={() => { setOpen(!open); setOpen(!open); }}

// Right: each updater receives the result of the previous one.
<button onClick={() => setOpen(value => !value)}>
  {open ? 'Hide' : 'Show'} details
</button>
```

## Details

For a single click `setOpen(!open)` is correct and shorter. The updater form earns its place when the same handler runs more than once before a render, or when the handler was created in an older render and captured an older `open`.

Keep the boolean itself in state, not a string like `"open"` and `"closed"`. The toggle logic then lives in one expression, and the JSX condition is a plain `open && ...`.
