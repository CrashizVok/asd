# TextField

JavaFX command · Controls

A single line text input. getText returns an empty string when the field is untouched, never null.

## Syntax

```java
new TextField(); field.getText()
```

## Example

```java
// File: Main.java
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.scene.layout.HBox;

public class Main {
    public HBox build() {
        TextField nameField = new TextField();
        nameField.setPromptText("Hotel name");
        Label result = new Label();

        Button save = new Button("Save");
        save.setOnAction(event -> {
            String name = nameField.getText().trim();

            if (name.isEmpty()) {
                result.setText("Name is required");
                return;
            }

            result.setText("Saved " + name);
            nameField.clear();
        });

        // Reacting to every keystroke instead of a button click
        nameField.textProperty().addListener((observable, oldValue, newValue) -> {
            result.setText(newValue.length() + " characters");
        });

        return new HBox(8, nameField, save, result);
    }
}
```
