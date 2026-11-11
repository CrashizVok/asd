# Inline style

JavaFX command · CSS

Applies CSS directly to one node. It beats the stylesheet, which makes it useful for a computed colour and dangerous for layout rules.

## Syntax

```java
node.setStyle("-fx-property: value;")
```

## Example

```java
if (row.stars() >= 4) {
    rowLabel.setStyle("-fx-text-fill: #166534; -fx-font-weight: bold;");
} else {
    // An empty string removes the inline rules, the stylesheet wins again.
    rowLabel.setStyle("");
}
```

## Details

Inline style has the highest priority short of a stylesheet `!important`. A value set here will not be overridden by a later theme change, so keep it for colours and weights that depend on data.

Only `-fx-` properties exist. `color`, `background`, `margin` and `padding` are silently ignored, which looks like the style did nothing.
