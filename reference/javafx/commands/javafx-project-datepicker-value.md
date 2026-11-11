# DatePicker.getValue()

JavaFX command · Form

Returns the picked LocalDate, or null while the picker is empty. Never assume a date is present.

## Syntax

```java
LocalDate date = picker.getValue();
```

## Example

```java
LocalDate start = startPicker.getValue();
LocalDate end = endPicker.getValue();

if (start == null || end == null) {
    problems.add("Both dates are required.");
} else if (!end.isAfter(start)) {
    problems.add("Departure must be after arrival.");
}
```

## Details

Setting a date from a model is one call: `startPicker.setValue(booking.startDate())`. Passing null clears the field again.

The editor text and the value can disagree while the user types. Read getValue rather than parsing the editor text, and let the picker handle the format.
