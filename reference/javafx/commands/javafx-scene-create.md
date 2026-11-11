# new Scene()

JavaFX command · Scene

Wraps the root node into a scene with an initial content size. The scene holds the root, the size, the fill colour and the stylesheets.

## Syntax

```java
new Scene(root, width, height)
```

## Example

```java
BorderPane root = new BorderPane();
root.setCenter(new Label("Content"));

// 900 by 600 is the content area, not the outer window size.
Scene scene = new Scene(root, 900, 600);
stage.setScene(scene);
```

## Details

The constructor without a width and height uses the preferred size of the root, which is often too small or too large by accident. Pass both numbers when the task names a size.

A node already attached to another scene must be removed from its parent first, because one node has one parent.
