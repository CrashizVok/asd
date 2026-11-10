# Forms

React topic · Exam Wiki

```jsx
function Search() {
    const [word, setWord] = useState('');

    function handleSubmit(event) {
        event.preventDefault();
        const trimmed = word.trim();
        if (trimmed.length < 3) {
            return;
        }
        console.log(trimmed);
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                value={word}
                onChange={event => setWord(event.target.value)}
                placeholder="Search"
            />
            <button type="submit">Search</button>
        </form>
    );
}
```

A controlled input has `value` and `onChange`. An uncontrolled input uses `defaultValue` and a ref. The exam usually wants controlled.
