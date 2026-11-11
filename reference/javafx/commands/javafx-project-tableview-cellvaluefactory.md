# TableColumn.setCellValueFactory()

JavaFX command · TableView

Tells a column how to read one value out of a row. Without a factory the column stays empty.

## Syntax

```java
column.setCellValueFactory(cell -> new ReadOnlyObjectWrapper<>(cell.getValue().field()));
```

## Example

```java
// Strings use ReadOnlyStringWrapper; anything else uses ReadOnlyObjectWrapper.
guestColumn.setCellValueFactory(
        cell -> new ReadOnlyStringWrapper(cell.getValue().guestName()));
startColumn.setCellValueFactory(
        cell -> new ReadOnlyObjectWrapper<>(cell.getValue().startDate()));
nightsColumn.setCellValueFactory(
        cell -> new ReadOnlyObjectWrapper<>(cell.getValue().nights()));
```

## Details

cell.getValue() is the row object, not the cell text. The wrapper makes the value observable so the cell redraws when the row changes.

PropertyValueFactory is the older shortcut and requires a JavaBean getter such as getStartDate() or startDateProperty(). Record accessors are named startDate(), so PropertyValueFactory finds nothing and the column renders blank without an error.
