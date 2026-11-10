# form validation

React command · Patterns

Validate before sending. Show the error next to the field and disable the submit button when needed.

## Syntax

```jsx
if (!email.includes("@")) setError("Bad email");
```

## Example

```jsx
function validate(email) {
  if (!email.trim()) return "Email is required.";
  if (!email.includes("@")) return "Email looks wrong.";
  return "";
}

const error = validate(email);
<button disabled={Boolean(error)}>Save</button>
```
