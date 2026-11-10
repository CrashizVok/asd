# Fetch with loading and error states

React topic · Exam Wiki

```jsx
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    getHotels()
        .then(result => {
            if (active) {
                setData(result);
            }
        })
        .catch(() => {
            if (active) {
                setError('Could not load data.');
            }
        })
        .finally(() => {
            if (active) {
                setLoading(false);
            }
        });

    return () => {
        active = false;
    };
}, []);
```

Always render all three states. A blank screen during a slow request looks like a broken app.
