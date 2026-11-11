# transition-timing-function

CSS command · Transitions

Shapes the speed curve of a transition. ease-out suits entrances, linear only continuous motion, steps sprite frames.

## Syntax

```css
transition-timing-function: cubic-bezier(0.2, 0.8, 0.2, 1);
```

## Example

```css
/* starts fast, settles slowly, no bounce */
.panel {
  transition: transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
.panel.open { transform: translateY(0); }
.clock { transition: transform 1s steps(60); }
```
