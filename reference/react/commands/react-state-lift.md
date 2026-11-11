# lift state up

React command · State patterns

Moves shared state to the closest common parent and passes the value down with a change handler.

## Syntax

```jsx
<Parent value={value} onChange={setValue} />
```

## Example

```jsx
function SearchPage() {
  // One owner for the query, shared by the input and the result list.
  const [query, setQuery] = useState('');
  const visible = hotels.filter(h => h.city.toLowerCase().includes(query.toLowerCase()));

  return (
    <>
      <SearchBox value={query} onChange={setQuery} />
      <HotelList hotels={visible} />
    </>
  );
}

function SearchBox({ value, onChange }) {
  return <input value={value} onChange={e => onChange(e.target.value)} />;
}
```

## Details

Two components cannot each own the same fact. Move it to their nearest common parent, pass the value down as a prop, and pass a function down so children can report what happened. Data flows one way and there is one place to debug.

Do not lift by default. State used by one component belongs there. Lifting to the top of the tree turns a keystroke into a render of everything below.
