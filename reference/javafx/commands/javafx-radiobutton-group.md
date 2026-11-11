# RadioButton with ToggleGroup

JavaFX command · Controls

Radio buttons in one ToggleGroup allow exactly one selection. Attach every button and select one before the window is shown.

## Syntax

```java
button.setToggleGroup(group); group.selectedToggleProperty().addListener(...)
```

## Example

```java
ToggleGroup mode = new ToggleGroup();
RadioButton byYear = new RadioButton("Years");
RadioButton byHotel = new RadioButton("Hotels");
byYear.setToggleGroup(mode);
byHotel.setToggleGroup(mode);
byYear.setSelected(true);

mode.selectedToggleProperty().addListener((observable, oldToggle, newToggle) -> {
    if (newToggle == null) {
        mode.selectToggle(oldToggle);   // keep one mode always selected
        return;
    }
    refreshList();
});
```

## Details

The `null` guard matters. Clicking the selected radio button can clear the group, and then `byYear.isSelected()` and `byHotel.isSelected()` are both false.

Reading the selection inside the handler with `if (byYear.isSelected())` is clearer than comparing toggle objects, and it survives a later redesign that adds a third mode.
