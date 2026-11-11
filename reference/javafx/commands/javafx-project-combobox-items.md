# ComboBox items and value

JavaFX command · Form

A fixed choice list. getValue returns null until something is selected, even when the list has one item.

## Syntax

```java
box.getItems().setAll(values); Object v = box.getValue();
```

## Example

```java
// FXML: <ComboBox fx:id="starsBox" maxWidth="Infinity"/>
starsBox.getItems().setAll(1, 2, 3, 4, 5);

// Reading it during validation:
if (starsBox.getValue() == null) {
    problems.add("Pick a star rating.");
}
```

## Details

A ComboBox prevents invalid input, which is often less work than validating a free text field. The price is the null value and the need to fill the items before the user can pick.

To preselect a value use setValue, not getSelectionModel().select, when the value type is the same as the item type. setValue also works when the item is not in the list, so validate that path if the model can contain anything else.
