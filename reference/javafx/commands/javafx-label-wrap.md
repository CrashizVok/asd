# Wrapping label

JavaFX command · Controls

Makes long label text wrap instead of clipping. Wrapping needs a width limit, otherwise the label grows as wide as its text.

## Syntax

```java
label.setWrapText(true); label.setMaxWidth(value);
```

## Example

```java
Label description = new Label(longText);
description.setWrapText(true);
description.setMaxWidth(360);   // without a limit the label keeps one long line
```

## Details

Inside an `HBox` the label also needs `HBox.setHgrow` or a fixed width, because the row does not shrink a child below its preferred width on its own.

For a whole block of text with several paragraphs, use a `TextArea` with `setEditable(false)` and `setWrapText(true)`.
