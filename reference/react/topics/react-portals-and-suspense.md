# Portals and Suspense

React topic · Exam Wiki

```jsx
import { createPortal } from "react-dom";
import { lazy, Suspense } from "react";

const HeavyPage = lazy(() => import("./HeavyPage.jsx"));

function Modal({ children }) {
    return createPortal(children, document.getElementById("modal-root"));
}

function App() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <HeavyPage />
        </Suspense>
    );
}
```

A portal renders a child into another DOM node, which is useful for modals and tooltips. `lazy` splits a component into a separate chunk; `Suspense` shows a fallback while it loads. The target node must exist in `index.html`.
