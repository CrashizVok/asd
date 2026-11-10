# Events

React topic · Exam Wiki

```jsx
function Form() {
    function handleSubmit(event) {
        event.preventDefault();
        console.log('sent');
    }

    return (
        <form onSubmit={handleSubmit}>
            <button type="submit">Send</button>
        </form>
    );
}
```

`event.preventDefault()` stops the browser from reloading the page on a form submit. Use an arrow function when you need to pass an argument:

```jsx
<button onClick={() => remove(item.id)}>Delete</button>
```

Do not call the function while rendering: `onClick={remove(item.id)}` runs immediately. Wrap it.
