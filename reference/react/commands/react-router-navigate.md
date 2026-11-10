# useNavigate

React command · Routing

Navigates from code, for example after a form submit or a search.

## Syntax

```jsx
const navigate = useNavigate();
navigate("/hotels/1");
```

## Example

```jsx
const navigate = useNavigate();

function handleSearch(event) {
  event.preventDefault();
  const word = input.trim();
  if (word.length < 3) return;
  navigate(`/search/${encodeURIComponent(word)}`);
}
```
