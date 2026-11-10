# controlled input

React command · Forms

React state is the single source of truth. value plus onChange keeps the input and state in sync.

## Syntax

```jsx
<input value={value} onChange={e => setValue(e.target.value)} />
```

## Example

```jsx
function Search() {
  const [word, setWord] = useState("");

  return (
    <input
      value={word}
      onChange={(event) => setWord(event.target.value)}
      placeholder="Search"
    />
  );
}
```
