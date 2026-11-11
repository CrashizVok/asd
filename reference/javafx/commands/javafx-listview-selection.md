# ListView selection listener

JavaFX command · Lists

Fires when the selected row changes, including when the list is cleared and the value becomes null. This is the correct hook for showing details.

## Syntax

```java
listView.getSelectionModel().selectedItemProperty().addListener(...)
```

## Example

```java
groups.getSelectionModel().selectedItemProperty().addListener(
        (observable, oldValue, group) -> {
            details.getItems().clear();
            if (group == null) {
                return;   // the list was cleared or the selection removed
            }
            details.getItems().setAll(findRows(group));
        });
```

## Details

Do not wire row clicks through a cell factory for selection. Cells are recycled while scrolling, and a cell that shows row 40 may later show row 3.

To preselect a row, call `getSelectionModel().select(index)` after the items are set. `selectFirst()` is a shortcut for the first row.
