# useSearchParams

React command · Routing

Reads and writes the query string, such as ?page=2. Useful for filters and pagination.

## Syntax

```jsx
const [params, setParams] = useSearchParams();
```

## Example

```jsx
const [params, setParams] = useSearchParams();
const page = Number(params.get("page")) || 1;

function next() {
  setParams({ page: String(page + 1) });
}
```
