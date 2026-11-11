# DatePicker

JavaFX command · Controls

Returns the chosen date as a LocalDate, or null when the field is empty. It does not validate ranges for you.

## Syntax

```java
datePicker.getValue()
```

## Example

```java
DatePicker start = new DatePicker(LocalDate.now());
DatePicker end = new DatePicker(LocalDate.now().plusDays(3));

Button check = new Button("Check");
check.setOnAction(event -> {
    LocalDate from = start.getValue();
    LocalDate to = end.getValue();
    if (from == null || to == null) {
        errorLabel.setText("Both dates are required.");
    } else if (to.isBefore(from)) {
        errorLabel.setText("The end date must not be earlier.");
    }
});
```

## Details

The text shown in the editor follows the locale, while `getValue()` is locale independent. Parse data files with `LocalDate.parse` and let the picker handle display.

`setEditable(false)` stops the user from typing a date in a format the parser does not expect.
