# ComboBox

JavaFX command · Controls

A drop down list with one selected value. It can be editable, which turns it into a combo of list and text field.

## Syntax

```java
new ComboBox<>(); box.getItems().addAll(...)
```

## Example

```java
// File: Main.java
import javafx.scene.control.ComboBox;
import javafx.scene.control.Label;
import javafx.scene.layout.VBox;

public class Main {
    public VBox build() {
        ComboBox<String> cityBox = new ComboBox<>();
        cityBox.getItems().addAll("Budapest", "Eger", "Gyor", "Pecs");
        cityBox.setValue("Budapest"); // preselect a value

        Label selected = new Label(cityBox.getValue());

        // The listener fires on user choice and on setValue
        cityBox.valueProperty().addListener((observable, oldValue, newValue) -> {
            selected.setText(newValue == null ? "none" : newValue);
        });

        // An editable box lets the user type a new city
        cityBox.setEditable(true);

        return new VBox(8, cityBox, selected);
    }
}
```
