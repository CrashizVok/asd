# ListView items

JavaFX command · Lists

Replaces the whole content of the list. Use clear() plus addAll() when appending, and setAll() when the old rows must disappear.

## Syntax

```java
listView.getItems().setAll(values)
```

## Example

```java
ListView<String> years = new ListView<>();
years.setPlaceholder(new Label("No data loaded"));

// setAll replaces, so no stale rows survive a reload.
years.getItems().setAll("2023", "2024", "2025");
```

## Details

Backing the list with an `ObservableList` keeps it in sync with the data:

```java
ObservableList<Booking> bookings = FXCollections.observableArrayList();
bookings.addAll(loadBookings(file));   // the list redraws itself
```

`setItems` swaps the backing list. Calling it twice is fine, but a listener attached to the old list stops seeing changes.
