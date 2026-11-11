# FileChooser.showOpenDialog()

JavaFX command · Files

Opens the system file dialog and returns the chosen File, or null when the user cancels. The owner window keeps the dialog on top.

## Syntax

```java
chooser.showOpenDialog(ownerWindow)
```

## Example

```java
FileChooser chooser = new FileChooser();
chooser.setTitle("Open bookings CSV");
chooser.getExtensionFilters().add(
        new FileChooser.ExtensionFilter("CSV files", "*.csv"));

File file = chooser.showOpenDialog(table.getScene().getWindow());
if (file == null) {
    return;   // Cancel returns null, not an exception
}

List<String> lines = Files.readAllLines(file.toPath(), StandardCharsets.UTF_8);
```

## Details

The extension filter is a convenience for the user and a hint for the system dialog; it does not stop anyone from typing another name, so the reader still needs to cope with a wrong file.

Reading a small CSV on the JavaFX thread is fine. A very large file freezes the window while it parses, which in an exam is a note in the README rather than a background task.
