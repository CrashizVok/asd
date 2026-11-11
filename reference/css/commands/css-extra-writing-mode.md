# writing-mode

CSS command · Typography

Changes the flow from horizontal to vertical. It flips the meaning of the inline and block axes for every logical property.

## Syntax

```css
writing-mode: vertical-rl;
```

## Example

```css
.side-label {
  /* text runs top to bottom, lines stack right to left */
  writing-mode: vertical-rl;
  text-orientation: mixed;
}
```
