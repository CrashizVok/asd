# expressions in JSX

React command · Basics

Curly braces run a JavaScript expression inside JSX. Statements such as if cannot go inside the braces.

## Syntax

```jsx
{expression}
```

## Example

```jsx
const stars = 4;

<p>
  {stars} out of 5
  {stars >= 4 ? " (great)" : ""}
</p>
```
