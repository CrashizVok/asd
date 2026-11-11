# hyphens

CSS command · Typography

Lets the browser break words with a hyphen at line ends. It needs a lang attribute on the element or an ancestor to choose a dictionary.

## Syntax

```css
hyphens: auto;
```

## Example

```css
.hyphenated {
  /* uses the dictionary that matches the lang attribute */
  hyphens: auto;
  max-width: 30ch;
}
```
