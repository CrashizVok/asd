# nested state update

React command · State updates

Copies each level of a nested object that lies on the path to the changed field.

## Syntax

```jsx
setState(s => ({ ...s, address: { ...s.address, city } }))
```

## Example

```jsx
// Data shape: { customer_email, address: { city, street } }
const [customer, setCustomer] = useState({
  customer_email: 'anna@example.com',
  address: { city: 'Eger', street: 'Fo utca 3' },
});

function setCity(city) {
  setCustomer(current => ({
    ...current,
    address: { ...current.address, city },
  }));
}
```

## Details

Only the path from the root to the changed field needs a fresh object. Copying the whole tree with `JSON.parse(JSON.stringify(x))` loses `undefined`, turns dates into strings and costs time proportional to the data.

Past two levels the spreads hide intent. At that point either flatten the state (`city`, `street` as separate fields) or move it to `useReducer`, where the update gets a name.
