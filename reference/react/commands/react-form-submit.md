# form submit

React command · Forms

Call event.preventDefault() to stop the page reload. Read values from state or FormData.

## Syntax

```jsx
<form onSubmit={handleSubmit}>
```

## Example

```jsx
function BookingForm() {
  const [email, setEmail] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    console.log({ email });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <button type="submit">Save</button>
    </form>
  );
}
```
