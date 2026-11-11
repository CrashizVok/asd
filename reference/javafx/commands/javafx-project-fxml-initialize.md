# @FXML initialize()

JavaFX command · Controller

Runs after every fx:id field is injected and before the scene is shown. This is the only safe place to touch the injected nodes.

## Syntax

```java
@FXML private void initialize() {}
```

## Example

```java
@FXML
private void initialize() {
    // Fields are injected by now; they are still null in the constructor.
    guestColumn.setCellValueFactory(
            cell -> new ReadOnlyStringWrapper(cell.getValue().guestName()));
    table.setItems(bookings);
    updateStatus();
}
```

## Details

The name and signature are fixed: no arguments, no return value. The loader calls it by name even without the annotation, but adding @FXML documents the link and keeps the method private.

Data that the controller needs from the caller cannot arrive through the constructor, because the loader builds the controller itself. Add a setter and call it after load, then run the dependent setup from that setter.
