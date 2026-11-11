# FXML controller with @FXML

JavaFX command · FXML

Connects an FXML file to a Java class. fx:id fields are injected and onAction="#method" calls the annotated method.

## Syntax

```java
@FXML private void onSave() { ... }
```

## Example

```java
// File: HotelController.java
import javafx.fxml.FXML;
import javafx.scene.control.Label;
import javafx.scene.control.TableView;
import javafx.scene.control.TextField;

public class HotelController {

    // The field name must equal the fx:id in the FXML file
    @FXML private TextField nameField;
    @FXML private TableView<Hotel> hotelTable;
    @FXML private Label statusLabel;

    // initialize runs after every @FXML field is injected
    @FXML
    private void initialize() {
        statusLabel.setText("Ready");
    }

    // onAction="#onSave" in the FXML calls this method
    @FXML
    private void onSave() {
        String name = nameField.getText().trim();

        if (name.isEmpty()) {
            statusLabel.setText("Name is required");
            return;
        }

        hotelTable.getItems().add(new Hotel(name, 4));
        statusLabel.setText("Saved " + name);
        nameField.clear();
    }
}

// File: hotel-view.fxml (excerpt)
// <VBox xmlns:fx="http://javafx.com/fxml"
//       fx:controller="HotelController">
//   <TextField fx:id="nameField"/>
//   <Button text="Save" onAction="#onSave"/>
//   <TableView fx:id="hotelTable"/>
//   <Label fx:id="statusLabel"/>
// </VBox>
```

## Details

## How the wiring works

The loader reads `fx:controller`, creates that class, and matches every `fx:id` attribute to a field of the same name. A typo in either file leaves the field null and the first click throws a NullPointerException.

## Check before running

- The controller class is public and has a public no argument constructor.
- Every `@FXML` field is private, matching the attribute name exactly.
- `onAction="#onSave"` matches a method, and the method takes no arguments or one ActionEvent.
- `initialize` is optional but must be annotated when used with FXML.
