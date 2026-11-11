# @media (prefers-reduced-motion)

CSS command · Motion

Matches when the user asked the system to reduce motion. Use it to drop travel and loops while keeping the state change visible.

## Syntax

```css
@media (prefers-reduced-motion: reduce) { ... }
```

## Example

```css
@media (prefers-reduced-motion: reduce) {
  .card,
  .panel {
    transition-duration: 0.01ms;
    animation: none;
  }

  .card:hover {
    transform: none;           /* keep colour and border feedback */
  }

  .ticker__track {
    animation: none;           /* static strip instead of a loop */
  }

  .loader {
    animation: pulse-opacity 1.6s ease-in-out infinite;
  }
}
```

## Details

A near zero duration keeps `transitionend` listeners working while removing the motion. Setting `animation: none` also cancels the fill mode, so the final state has to exist outside the keyframes.

The preference reports a setting, not a capability. A spinner still needs to look busy, so swap a spin for an opacity pulse instead of freezing everything.
