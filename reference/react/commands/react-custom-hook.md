# custom hook

React command · Hooks

A function whose name starts with use and calls other hooks. It shares logic, not state.

## Syntax

```jsx
function useThing() { ... return value; }
```

## Example

```jsx
function useHotels() {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    fetch("/api/hotels")
      .then((response) => response.json())
      .then(setHotels);
  }, []);

  return hotels;
}

const hotels = useHotels();
```
