# Components and props

React topic · Exam Wiki

```jsx
function Badge({ text, tone = 'blue' }) {
    return <span className={`badge badge-${tone}`}>{text}</span>;
}

function App() {
    return <Badge text="New" tone="green" />;
}
```

Props are read only. A default value belongs in the destructuring pattern. Pass functions as props when a child needs to notify a parent:

```jsx
function Button({ onClick, children }) {
    return <button onClick={onClick}>{children}</button>;
}
```
