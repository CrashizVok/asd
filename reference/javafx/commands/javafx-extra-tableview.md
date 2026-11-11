# TableView

JavaFX command · Table

A table bound to a list of row objects. Columns decide what is shown, the items hold the data.

## Syntax

```java
new TableView<>(); table.getItems().addAll(...)
```

## Example

```java
// File: Main.java
import javafx.collections.FXCollections;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.cell.PropertyValueFactory;

public class Main {
    public record Hotel(int hotel_id, String name, int stars) {}

    public TableView<Hotel> build() {
        TableView<Hotel> table = new TableView<>();

        TableColumn<Hotel, Integer> idColumn = new TableColumn<>("ID");
        idColumn.setCellValueFactory(cell -> new javafx.beans.property.SimpleIntegerProperty(
            cell.getValue().hotel_id()).asObject());

        TableColumn<Hotel, String> nameColumn = new TableColumn<>("Name");
        nameColumn.setCellValueFactory(cell -> new javafx.beans.property.SimpleStringProperty(
            cell.getValue().name()));

        table.getColumns().add(idColumn);
        table.getColumns().add(nameColumn);

        table.setItems(FXCollections.observableArrayList(
            new Hotel(1, "Danube View", 4),
            new Hotel(2, "City Loft", 5)));

        return table;
    }
}
```
