# batched updates

React command · State updates

React groups setter calls made in the same tick into a single render.

## Syntax

```jsx
setA(1); setB(2); // one render
```

## Example

```jsx
function SaveButton() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [savedAt, setSavedAt] = useState(null);

  function handleSave() {
    setSaving(true);
    setError(null);
    setSavedAt(null);
    // One render when the handler returns, not three.
  }

  async function handleSaveAsync() {
    setSaving(true); // renders here
    await save();
    setSaving(false); // renders again after the await
  }

  return <button onClick={handleSave}>{saving ? 'Saving' : 'Save'}</button>;
}
```

## Details

Batching means the intermediate states are never painted. It also means the state variables keep their old values until the handler returns, so reading `saving` right after `setSaving(true)` gives `false`.

React 18 batches in promises, timeouts and native listeners too. An `await` splits the batch, because by the time the promise resolves the handler has returned. That split is often what you want for a progress flag.
