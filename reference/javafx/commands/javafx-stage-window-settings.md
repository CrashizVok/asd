# Stage window settings

JavaFX command · Stage

Sets the title bar text, the smallest size the user may drag to, and whether the window can be resized. The minimum size protects a fixed layout from clipping.

## Syntax

```java
stage.setTitle(text); stage.setMinWidth(value); stage.setResizable(boolean);
```

## Example

```java
stage.setTitle("BookingBrowser");
stage.setMinWidth(720);    // below this the fixed list starts to clip
stage.setMinHeight(420);
stage.setResizable(true);
stage.setScene(scene);
stage.show();
```

## Details

A window cannot be made smaller than the sum of the minimum sizes of its content plus padding and spacing. If the stage refuses to shrink even though `setMinWidth` is small, look at the children's `minWidth` values.

Icons are set with `stage.getIcons().add(new Image(...))`. The exam rarely asks for one; a missing image path throws at startup, so skip it unless required.
