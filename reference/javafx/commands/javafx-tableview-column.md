# TableView column

JavaFX command · Lists

Binds a column to one field of the row object. The factory is called for every visible cell, so it must stay cheap.

## Syntax

```java
column.setCellValueFactory(cell -> new ReadOnlyStringWrapper(value))
```

## Example

```java
TableView<Booking> table = new TableView<>();

TableColumn<Booking, String> city = new TableColumn<>("City");
city.setCellValueFactory(cell ->
        new ReadOnlyStringWrapper(cell.getValue().city()));

TableColumn<Booking, Integer> adults = new TableColumn<>("Adults");
adults.setCellValueFactory(cell ->
        new ReadOnlyIntegerWrapper(cell.getValue().adults()).asObject());

table.getColumns().addAll(city, adults);
table.setItems(FXCollections.observableArrayList(bookings));
```

## Details

`PropertyValueFactory("city")` needs a `getCity()` method. Java records have `city()`, so the explicit wrapper is the reliable option for records. `asObject()` is required on `ReadOnlyIntegerWrapper` when the column type is `Integer`.

Column widths: `setPrefWidth(180)` per column, and `table.setColumnResizePolicy(TableView.CONSTRAINED_RESIZE_POLICY_FLEX_LAST_COLUMN)` to fill the table width. The older `CONSTRAINED_RESIZE_POLICY` constant is deprecated in JavaFX 20 and later.
