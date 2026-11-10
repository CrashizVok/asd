# state with an object

React command · State

State updates are shallow. Spread the old object and change only the field you need.

## Syntax

```jsx
setUser({ ...user, name: "Anna" })
```

## Example

```jsx
const [user, setUser] = useState({ name: "Anna", city: "Budapest" });

function changeCity() {
  setUser((old) => ({ ...old, city: "Debrecen" }));
}
```
