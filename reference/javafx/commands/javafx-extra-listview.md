# ListView

JavaFX command · Controls

A scrollable list of items. Back it with an ObservableList so the view follows every change.

## Syntax

```java
new ListView<>(FXCollections.observableArrayList(...))
```

## Example

```java
// File: Main.java
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.scene.control.Label;
import javafx.scene.control.ListView;
import javafx.scene.layout.VBox;

public class Main {
    public VBox build() {
        ObservableList<String> hotels = FXCollections.observableArrayList(
            "Danube View", "City Loft", "Lake Garden");

        ListView<String> list = new ListView<>(hotels);
        list.setPrefHeight(160);

        Label selected = new Label("none");

        // selectedItemProperty is null until the user picks a row
        list.getSelectionModel().selectedItemProperty().addListener(
            (observable, oldValue, newValue) -> {
                selected.setText(newValue == null ? "none" : newValue);
            });

        // The view updates because the list is observable
        hotels.add("Bridge Inn");

        return new VBox(8, list, selected);
    }
}
```
