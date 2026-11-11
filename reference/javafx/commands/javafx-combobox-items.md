# ComboBox

JavaFX command · Controls

A drop-down list with one selected value. The value is null until the user or the code sets one.

## Syntax

```java
comboBox.getItems().addAll(values); comboBox.getValue()
```

## Example

```java
ComboBox<String> city = new ComboBox<>();
city.getItems().addAll("Budapest", "Debrecen", "Szeged");
city.setPromptText("Choose a city");

// Never assume a value: check for null before using it.
String selected = city.getValue();
if (selected == null) {
    errorLabel.setText("Pick a city.");
}
```

## Details

`setValue` selects an item and also accepts values that are not in the list, which is useful for a free-text combo after `setEditable(true)`.

For a long list, `setVisibleRowCount(8)` keeps the popup short. For typed filtering, make it editable and read `getEditor().getText()`.
