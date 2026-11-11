# stop()

JavaFX command · Lifecycle

Runs after the last window closes or after Platform.exit(). Use it to flush data or stop threads, never to ask the user a question.

## Syntax

```java
public void stop() { ... }
```

## Example

```java
@Override
public void stop() {
    // Too late for a confirmation dialog: the window is already going away.
    saveWindowState();
}
```

## Details

For a save prompt use `stage.setOnCloseRequest` and call `event.consume()` when the user cancels. `stop` is for cleanup only.

If `Platform.setImplicitExit(false)` was called, `stop` runs only when `Platform.exit()` is called explicitly.
