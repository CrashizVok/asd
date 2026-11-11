# TableView.setColumnResizePolicy()

JavaFX command · TableView

Makes the columns share the available width instead of leaving empty space on the right. The constant exists from JavaFX 20.

## Syntax

```java
table.setColumnResizePolicy(TableView.CONSTRAINED_RESIZE_POLICY_FLEX_LAST_COLUMN);
```

## Example

```java
// Columns fill the table width; prefWidth values become proportions.
table.setColumnResizePolicy(TableView.CONSTRAINED_RESIZE_POLICY_FLEX_LAST_COLUMN);

// JavaFX 17 to 19 only has this one, deprecated in 20 but still working:
// table.setColumnResizePolicy(TableView.CONSTRAINED_RESIZE_POLICY);
```

## Details

Under a constrained policy the declared prefWidth is a hint for the ratio, so a 60 pixel column next to a 150 pixel column keeps roughly that proportion as the window grows.

The unconstrained default keeps pixel widths and leaves a grey strip after the last column. That strip is not a bug, it is the table background showing through.
