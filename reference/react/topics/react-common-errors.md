# Common errors

React topic · Exam Wiki

| Error | Cause | Fix |
|---|---|---|
| `Objects are not valid as a React child` | Rendering an object or an array of objects | Render a string or map to elements |
| `Each child in a list should have a unique key` | Missing key | Add `key={item.id}` |
| `Too many re-renders` | State set during render | Move the call into an event or an effect |
| `Cannot read properties of undefined` | Data is not loaded yet | Guard with `data?.name` or an early return |
| `useEffect` runs forever | Dependency changes every render | Use a stable dependency or an empty array |
| `useParams` is empty | Component is outside the route | Put it inside the route element |
| Page is blank after refresh | Server has no SPA fallback | Rewrite to `index.html` |
| CORS error | Direct call to another origin | Use the Vite proxy or enable CORS |
