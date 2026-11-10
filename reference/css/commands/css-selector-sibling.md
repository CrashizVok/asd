# adjacent and general sibling

CSS command · Selectors

+ selects the next sibling, ~ selects all following siblings.

## Syntax

```css
h2 + p { margin-top: 0; }
h2 ~ p { color: #555; }
```

## Example

```css
h2 + p {
  margin-top: 0;
}

label + input {
  margin-left: 8px;
}
```
