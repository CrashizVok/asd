# <details> and <summary>

HTML command · Semantics

A native disclosure widget. Summary is the always visible label and the click target; the rest is shown when the element is open.

## Syntax

```html
<details>
  <summary>Question</summary>
  <p>Answer</p>
</details>
```

## Example

```html
<section aria-labelledby="faq">
  <h2 id="faq">Questions</h2>

  <details>
    <summary>Can I change the dates?</summary>
    <p>Yes, up to 48 hours before check-in, from the booking page.</p>
  </details>

  <!-- Starts open. "open" is a boolean attribute, no value needed. -->
  <details open>
    <summary>Is breakfast included?</summary>
    <p>Yes, from 6:30 to 10:00.</p>
  </details>
</section>
```

## Details

Summary must be the first child of details. The browser handles focus and the Enter and Space keys, and it announces expanded or collapsed. No JavaScript is needed, and nothing breaks when scripts fail.

Closed content is removed from the accessibility tree, so do not hide essential text there. The name attribute on several details elements builds an exclusive accordion, where opening one closes the others. Do not build a navigation menu out of details; it is announced as a disclosure, not a menu.
