# radio group

React command · Forms

One state value for the group. Shared name, checked compared to that value, onChange stores the picked value.

## Syntax

```jsx
<input type="radio" name="room_type" value={type} checked={roomType === type} onChange={handle} />
```

## Example

```jsx
const [roomType, setRoomType] = useState('double');

{['single', 'double', 'suite'].map((type) => (
  <label key={type}>
    <input
      type="radio"
      name="room_type"
      value={type}
      checked={roomType === type}
      onChange={(event) => setRoomType(event.target.value)}
    />
    {type}
  </label>
))}
```

## Details

The shared `name` is what makes the browser treat the inputs as one group. Without it, clicking a second radio leaves the first one selected.

Radio choices drawn as cards keep the real input and hide it with CSS on the input, or use `appearance: none` plus a styled label. Replacing the input with clickable divs loses arrow key navigation and the group announcement for screen readers.

One value is pre-selected in the example. If the task wants no default, start the state as `''` and compare against that.
