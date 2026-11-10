# Encode a search word

React topic · Exam Wiki

```jsx
const word = 'Budapest center';
navigate(`/search/${encodeURIComponent(word)}`);
```

`useParams` decodes the value automatically. Without `encodeURIComponent`, a slash or a question mark breaks the route.
