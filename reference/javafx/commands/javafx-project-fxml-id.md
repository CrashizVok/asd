# fx:id

JavaFX command · FXML

Gives a node a name so the loader can assign it to a controller field. Field name, field type and fx:id must all match.

## Syntax

```java
<TextField fx:id="emailField"/>
```

## Example

```java
<!-- bookings.fxml -->
<TextField fx:id="emailField"/>
<TableView fx:id="table"/>
```

## Details

On the Java side the field needs the annotation when it is private:

```java
@FXML private TextField emailField;
@FXML private TableView<Booking> table;
```

The compiler cannot check either link. A wrong name shows up as "No field named ... in controller" when the window opens, and a wrong type shows up as an injection error naming both classes.

fx:id is not the CSS id. Styling with #emailField only works after a call to setId("emailField").
