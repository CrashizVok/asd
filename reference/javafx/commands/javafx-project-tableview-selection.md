# selectedItemProperty()

JavaFX command · TableView

Fires when the selected row changes, including when it becomes null after the list is cleared.

## Syntax

```java
table.getSelectionModel().selectedItemProperty().addListener((obs, old, row) -> {});
```

## Example

```java
table.getSelectionModel().selectedItemProperty().addListener(
        (observable, oldRow, newRow) -> {
            if (newRow == null) {
                clearForm();
            } else {
                showBooking(newRow);   // newRow is the row object, not its text
            }
        });
```

## Details

The listener must handle null. Removing the selected row, filtering it out, or calling clearSelection all produce a null event, and a listener that dereferences it crashes at the worst moment.

Clearing the form from inside the listener is safe as long as clearing the form does not change the selection. If it does, the listener runs again and the form flickers or resets while the user types.
