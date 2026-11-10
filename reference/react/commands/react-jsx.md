# JSX

React command · Basics

JSX looks like HTML inside JavaScript. It becomes React.createElement calls. Use className instead of class and htmlFor instead of for.

## Syntax

```jsx
const el = <h1>Hello</h1>;
```

## Example

```jsx
const name = "Anna";
const card = (
  <div className="card">
    <h2>{name}</h2>
    <p>Welcome.</p>
  </div>
);
```
