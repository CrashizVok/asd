# Platform.exit()

JavaFX command · Lifecycle

Closes the toolkit and ends the application, running stop() on the way out. Use it for an Exit menu item and for cancelling a close request after a prompt.

## Syntax

```java
Platform.exit()
```

## Example

```java
MenuItem exit = new MenuItem("Exit");
exit.setOnAction(event -> Platform.exit());

// Alternative for a Cancel branch after the user confirmed closing:
// stage.close() closes one window; Platform.exit() ends the application.
```

## Details

`System.exit(0)` also kills the process, but it skips `stop()` and can leave threads running. `Platform.exit()` is the supported path.

With `Platform.setImplicitExit(false)` the application keeps running after the last window closes, and then `Platform.exit()` is the only clean way to end it.
