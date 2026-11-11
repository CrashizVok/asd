# FileChooser open dialog

JavaFX command · Files

Opens the native file dialog and returns the chosen File, or null when the user cancels. The null check is part of the pattern, not an optional extra.

## Syntax

```java
fileChooser.showOpenDialog(owner)
```

## Example

```java
FileChooser chooser = new FileChooser();
chooser.setTitle("Open bookings CSV");
chooser.getExtensionFilters().add(
        new FileChooser.ExtensionFilter("CSV files", "*.csv"));

File file = chooser.showOpenDialog(stage);
if (file == null) {
    return;   // Cancel is not an error.
}
List<Booking> rows = readBookings(file);
```

## Details

`showSaveDialog` returns a target file that may not exist yet, so write to `file.toPath()` rather than reading it.

Reading goes through `Files.readAllLines(file.toPath(), StandardCharsets.UTF_8)` or `Files.newBufferedReader`. Keep the parsing in a method that accepts a `File` or `Path`, so it can be tested from `main` without opening a window.

Wrap the read in `try` and show the message in an `Alert` with `AlertType.ERROR`. A raw stack trace in the console is not a user-facing error path.
