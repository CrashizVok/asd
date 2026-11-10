# Custom hook

React topic · Exam Wiki

```jsx
function useHotels() {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let active = true;
        getHotels()
            .then(data => active && setHotels(data))
            .catch(() => active && setError('Could not load hotels.'))
            .finally(() => active && setLoading(false));
        return () => {
            active = false;
        };
    }, []);

    return { hotels, loading, error };
}
```

A custom hook is a function whose name starts with `use` and that calls other hooks. It shares logic, not state. Two components that call `useHotels` get two separate states.
