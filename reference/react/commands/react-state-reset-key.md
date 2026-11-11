# reset state with key

React command · State patterns

Remounts a component when the record changes, so its internal state starts from the initial value.

## Syntax

```jsx
<Editor key={record.id} record={record} />
```

## Example

```jsx
function Page({ customer }) {
  // A new customer_email means a new key, so the editor never shows the
  // previous draft.
  return <CustomerEditor key={customer.customer_email} customer={customer} />;
}

function CustomerEditor({ customer }) {
  const [draft, setDraft] = useState(customer.first_name);
  return (
    <input value={draft} onChange={e => setDraft(e.target.value)} />
  );
}
```

## Details

Changing `key` makes React unmount the old instance and mount a new one. The `useState(customer.first_name)` initial value runs again with the new prop. No effect, no comparison, no stale draft.

This beats the alternative of copying the prop into state and syncing it in `useEffect`, which renders once with the old value and can overwrite edits. Use a value that is stable and unique per record, not an index.
