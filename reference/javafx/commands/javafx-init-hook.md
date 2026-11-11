# init()

JavaFX command · Lifecycle

Runs once before start on the launcher thread. Use it for slow or risky work such as reading a file, and never create controls here.

## Syntax

```java
public void init() { ... }
```

## Example

```java
@Override
public void init() {
    // Runs off the FX thread: no Label, no Scene, no Stage.
    loadedRows = readBookings(Path.of("bookings.csv"));
}
```

## Details

An exception thrown in `init` prevents the window from appearing, and the stack trace shows up as an application startup failure. Wrap file access in `try` and store the error message for an `Alert` in `start`.

For exam tasks the method is optional. It becomes useful when the file is large and the window should appear only after the data is ready.
