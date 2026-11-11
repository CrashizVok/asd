# role

HTML command · Accessibility attributes

Gives an element an ARIA role when no native element carries the meaning. Prefer a real element, then add a role only for custom widgets.

## Syntax

```html
role="status"
```

## Example

```html
<!-- native element first -->
<button>Save</button>

<!-- live region for a save confirmation -->
<p role="status">Booking saved.</p>

<!-- no element exists for a toolbar of links, so a role is needed -->
<div role="toolbar" aria-label="Booking actions">...</div>
```
