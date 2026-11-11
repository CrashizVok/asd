# Stage.setScene() and show()

JavaFX command · Stage

Attaches the scene to the window and makes the window visible. Nothing is drawn before show() runs.

## Syntax

```java
stage.setScene(scene); stage.show();
```

## Example

```java
Scene scene = new Scene(root, 900, 600);
stage.setTitle("Bookings");
stage.setScene(scene);   // build the content
stage.show();            // make it visible
```

## Details

Order matters for sizing. Setting the scene first lets the stage compute its size from the scene; changing the root afterwards needs `stage.sizeToScene()` if the window should follow.

A stage without a scene throws no error on `show()` in older versions but shows an empty window. Always attach the scene.
