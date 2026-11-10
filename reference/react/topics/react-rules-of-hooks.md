# Rules of hooks

React topic · Exam Wiki

- Call hooks at the top level of a component or another hook.
- Do not call hooks inside a loop, a condition, or a nested function.
- The order must be the same on every render.
- `useState`, `useEffect`, `useContext`, `useRef`, `useMemo`, `useCallback` all follow this rule.
