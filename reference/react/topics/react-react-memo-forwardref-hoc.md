# React.memo, forwardRef, HOC

React topic · Exam Wiki

```jsx
import { forwardRef, memo } from "react";

const Input = forwardRef(function Input(props, ref) {
    return <input ref={ref} {...props} />;
});

const Row = memo(function Row({ room }) {
    return <li>{room.name}</li>;
});

function withTitle(Component) {
    return function Wrapped(props) {
        return (
            <>
                <h2>Rooms</h2>
                <Component {...props} />
            </>
        );
    };
}
```

`memo` skips a re-render when props are equal. `forwardRef` passes a ref through to a DOM node. A higher order component takes a component and returns a new one. Use these only when a profiler shows a problem.
