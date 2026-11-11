# textarea

React command · Forms

The value is an attribute, not child text. Children would become initial content and React warns.

## Syntax

```jsx
<textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
```

## Example

```jsx
const [notes, setNotes] = useState('');

<label htmlFor="notes">Notes</label>
<textarea
  id="notes"
  name="notes"
  rows={4}
  value={notes}
  onChange={(event) => setNotes(event.target.value)}
/>
```

## Details

In plain HTML the text sits between the tags. In JSX that reads as default content, so a controlled textarea must use `value` and `onChange` like every other text field.

`rows` sets the visible height, `maxLength` caps the input, and CSS `resize: vertical` stops a user from dragging the box wider than the layout.
