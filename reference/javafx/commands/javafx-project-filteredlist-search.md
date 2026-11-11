# FilteredList and SortedList

JavaFX command · TableView

Shows a subset of a list without copying it. Wrap the filter in a SortedList so header clicks still sort the visible rows.

## Syntax

```java
new FilteredList<>(master, predicate)
```

## Example

```java
private final ObservableList<Booking> bookings = FXCollections.observableArrayList();
private FilteredList<Booking> filtered;

@FXML
private void initialize() {
    filtered = new FilteredList<>(bookings, booking -> true);
    SortedList<Booking> sorted = new SortedList<>(filtered);
    sorted.comparatorProperty().bind(table.comparatorProperty());
    table.setItems(sorted);

    searchField.textProperty().addListener((obs, old, text) -> {
        String query = text.trim().toLowerCase(Locale.ROOT);
        filtered.setPredicate(b -> query.isEmpty() || b.matches(query));
    });
}
```

## Details

The master list keeps every row. Filtering only changes what the table displays, so clearing the search restores the rows without reloading the file.

A predicate must accept every row when the query is empty. Returning false for an empty query makes the table look empty after the user deletes the search text.
