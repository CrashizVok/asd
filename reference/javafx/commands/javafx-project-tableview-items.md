# TableView.setItems()

JavaFX command · TableView

Supplies the rows. The list must be observable, and the table only updates when that same list object changes.

## Syntax

```java
table.setItems(observableList);
```

## Example

```java
private final ObservableList<Booking> bookings = FXCollections.observableArrayList();

@FXML
private void initialize() {
    table.setItems(bookings);   // getItems() is null before this call
}
```

## Details

Adding through an ArrayList that was passed to setItems shows nothing, because a plain list does not notify the table. Keep the observable list in a field and mutate it in place with add, set, remove or setAll.

Replacing the list object with a new ObservableList also works if you call setItems again, but then every binding to the old list is stale.
