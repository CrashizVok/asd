# Lists and keys

React topic · Exam Wiki

```jsx
<ul>
    {hotels.map(hotel => (
        <li key={hotel.id}>{hotel.name}</li>
    ))}
</ul>
```

The key must be stable and unique among siblings. Use a database id. Use the array index only when the list never reorders and never changes length.
