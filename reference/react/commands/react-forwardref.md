# forwardRef

React command · Patterns

Passes a ref through a component to a DOM node. React 19 also accepts ref as a normal prop.

## Syntax

```jsx
const Input = forwardRef((props, ref) => <input ref={ref} />);
```

## Example

```jsx
const Input = forwardRef(function Input(props, ref) {
  return <input ref={ref} {...props} />;
});

const ref = useRef(null);
<Input ref={ref} />
```
