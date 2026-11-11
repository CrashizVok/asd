# GridPane constraints

JavaFX command · FXML

Places a node in a form grid. The second column usually grows, and the inputs need maxWidth set to Infinity to fill their cell.

## Syntax

```java
GridPane.rowIndex="1" GridPane.columnIndex="0"
```

## Example

```java
<GridPane hgap="8" vgap="8">
    <columnConstraints>
        <ColumnConstraints minWidth="84" prefWidth="84"/>
        <ColumnConstraints hgrow="ALWAYS"/>
    </columnConstraints>

    <Label text="Email" GridPane.rowIndex="2" GridPane.columnIndex="0"/>
    <TextField fx:id="emailField" maxWidth="Infinity"
               GridPane.rowIndex="2" GridPane.columnIndex="1"/>
</GridPane>
```

## Details

Without a growing column the form keeps its preferred width and leaves the extra space to the right. Without maxWidth="Infinity" the TextField keeps its own preferred width inside a wide cell, which looks like a layout bug but is the control obeying its maximum size.

Leaving a row empty is allowed; the row simply gets the height of the nodes in it.
