# CheckBox

JavaFX command · Controls

Returns the current state of the box. Check boxes are independent; a group of them needs no ToggleGroup.

## Syntax

```java
checkBox.isSelected()
```

## Example

```java
CheckBox extraBed = new CheckBox("Extra bed");
extraBed.setSelected(false);

Button save = new Button("Save");
save.setOnAction(event -> {
    String note = extraBed.isSelected() ? "extra bed" : "no extra bed";
    System.out.println(note);
});
```

## Details

`selectedProperty()` is observable when a label or another control must react immediately:

```java
summary.textProperty().bind(
    Bindings.when(extraBed.selectedProperty())
            .then("Extra bed requested")
            .otherwise("No extra bed"));
```
