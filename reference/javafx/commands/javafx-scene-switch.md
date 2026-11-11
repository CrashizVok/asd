# Scene switching

JavaFX command · Scene

Replaces the content of the current window without creating a new one. Build both scenes once and reuse them.

## Syntax

```java
stage.setScene(otherScene)
```

## Example

```java
Button back = new Button("Back");
back.setOnAction(event -> stage.setScene(loginScene));

Button enter = new Button("Enter");
enter.setOnAction(event -> {
    stage.setScene(mainScene);   // same window, new content
});
```

## Details

Swapping scenes loses nothing that is stored outside the scene, so keep shared state in fields or in a small model class. Rebuilding a scene on every switch resets its controls.

When only part of the screen changes, replace the centre of a `BorderPane` instead. The menu bar and the status line then stay attached and keep their handlers.
