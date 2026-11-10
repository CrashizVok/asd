# CSS in React

React command · Patterns

Import a CSS file in the component or entry file. Use className, not class. Inline styles use an object with camelCase keys.

## Syntax

```jsx
import "./styles.css";
<div className="card" />
```

## Example

```jsx
import "./styles.css";

<div className="card" style={{ padding: 16, borderRadius: 12 }}>
  <h2>Hotel</h2>
</div>
```
