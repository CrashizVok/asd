# Alert.showAndWait()

JavaFX command · Dialogs

Shows a modal dialog and returns the button the user pressed as an Optional. Always attach the owner window.

## Syntax

```java
new Alert(type, content, buttons).showAndWait()
```

## Example

```java
Alert confirm = new Alert(Alert.AlertType.CONFIRMATION,
        "Delete the booking for " + booking.guestName() + "?",
        ButtonType.OK, ButtonType.CANCEL);
confirm.setTitle("Delete booking");
confirm.setHeaderText(null);
confirm.initOwner(table.getScene().getWindow());

Optional<ButtonType> answer = confirm.showAndWait();
if (answer.isPresent() && answer.get() == ButtonType.OK) {
    bookings.remove(booking);
}
```

## Details

The four types are INFORMATION, WARNING, ERROR and CONFIRMATION. The type only sets the icon and the default buttons; the text is yours.

A result is only guaranteed once a button was pressed, so compare against the button you asked for. Closing the dialog from the window frame can leave the result empty. Without initOwner the dialog can open behind the main window, where the user sees a frozen app.
