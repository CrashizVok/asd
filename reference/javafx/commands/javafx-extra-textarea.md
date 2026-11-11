# TextArea

JavaFX command · Controls

A multi line text box. appendText adds to the end and keeps the caret at the bottom, which suits log output.

## Syntax

```java
new TextArea(); area.appendText(text)
```

## Example

```java
// File: Main.java
import javafx.scene.control.Button;
import javafx.scene.control.TextArea;
import javafx.scene.layout.VBox;

public class Main {
    public VBox build() {
        TextArea notes = new TextArea();
        notes.setPromptText("Notes about the booking");
        notes.setPrefRowCount(6);
        notes.setWrapText(true);

        Button addNote = new Button("Add note");
        addNote.setOnAction(event -> {
            // appendText does not replace the existing content
            notes.appendText("Checked in at 14:00" + System.lineSeparator());
        });

        // getText returns everything, including line breaks
        Button count = new Button("Count lines");
        count.setOnAction(event -> {
            long lines = notes.getText().lines().count();
            System.out.println(lines);
        });

        return new VBox(8, notes, addNote, count);
    }
}
```
