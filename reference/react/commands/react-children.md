# children

React command · Components

children is the content between the opening and closing tags. It can be text, elements, or components.

## Syntax

```jsx
<Card>content</Card>
```

## Example

```jsx
function Panel({ title, children }) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

<Panel title="Bookings"><p>No bookings yet.</p></Panel>
```
