# overflow-wrap

CSS command · Typography

Allows a long word or URL to break when it would otherwise overflow. break-word is the older value with a similar visual effect.

## Syntax

```css
overflow-wrap: anywhere;
```

## Example

```css
.message {
  /* long tokens may break, normal words do not */
  overflow-wrap: anywhere;
}
.url {
  word-break: break-all; /* breaks anywhere, even mid word */
}
```
