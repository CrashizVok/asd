# TableColumn cellValueFactory

JavaFX command · Table

Tells a column how to read a value from a row. The lambda runs for every visible cell, so keep it cheap.

## Syntax

```java
column.setCellValueFactory(cell -> new SimpleStringProperty(...))
```

## Example

```java
// File: Main.java
import javafx.beans.property.SimpleStringProperty;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;

public class Main {
    public static class Hotel {
        private final String name;
        private final int stars;

        public Hotel(String name, int stars) {
            this.name = name;
            this.stars = stars;
        }

        public String getName() { return name; }
        public int getStars() { return stars; }
    }

    public TableView<Hotel> build() {
        TableView<Hotel> table = new TableView<>();

        TableColumn<Hotel, String> nameColumn = new TableColumn<>("Name");
        // PropertyValueFactory reads getName(), the string is the property name
        nameColumn.setCellValueFactory(new javafx.scene.control.cell.PropertyValueFactory<>("name"));

        TableColumn<Hotel, String> starsColumn = new TableColumn<>("Stars");
        // A lambda is clearer and works without getters
        starsColumn.setCellValueFactory(cell ->
            new SimpleStringProperty(String.valueOf(cell.getValue().getStars())));

        table.getColumns().add(nameColumn);
        table.getColumns().add(starsColumn);
        return table;
    }
}
```
