# Window close request

JavaFX command · Lifecycle

Runs when the user tries to close the window, before it hides. Calling event.consume() cancels the close.

## Syntax

```java
stage.setOnCloseRequest(event -> { ... })
```

## Example

```java
stage.setOnCloseRequest(event -> {
    if (hasUnsavedChanges() && !confirmDiscard()) {
        event.consume();   // stop the close
    }
});
```

## Details

This is the last moment where a question can be asked, because the window is still open. `stop()` runs too late for a dialog.

A confirmation with `Alert` returns an `Optional<ButtonType>`. Compare it to `ButtonType.OK` and consume the close event when the answer is no.
