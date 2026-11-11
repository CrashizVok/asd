# Spinner with an integer range

JavaFX command · Controls

A numeric field with arrows and a bounded range. getValue returns an Integer, so no parsing is needed.

## Syntax

```java
new Spinner<>(new SpinnerValueFactory.IntegerSpinnerValueFactory(min, max, initial))
```

## Example

```java
Spinner<Integer> adults = new Spinner<>(
        new SpinnerValueFactory.IntegerSpinnerValueFactory(1, 10, 2));
adults.setEditable(true);   // typed text commits on Enter or focus loss

int count = adults.getValue();
```

## Details

A bare `new Spinner<>(1, 10, 2)` also compiles in recent JavaFX versions, but the value factory form shows the intended range and works on every supported version.

With `setEditable(true)`, text that is outside the range is rejected and the previous value returns. If the user typed a value and clicked Save directly, the focus loss commits it before the handler runs.
