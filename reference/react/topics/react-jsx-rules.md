# JSX rules

React topic · Exam Wiki

```jsx
function Card() {
    const name = 'Danube View';
    return (
        <article className="card">
            <h2>{name}</h2>
            <p>{2 + 3}</p>
        </article>
    );
}
```

- Return one parent element, or a fragment `<>...</>`.
- Close every tag, including `<img />` and `<input />`.
- Use `className`, not `class`.
- Use `{expression}` for JavaScript.
- JavaScript comments inside JSX need `{/* ... */}`.
- A component name starts with a capital letter.
