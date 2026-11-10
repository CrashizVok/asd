# JavaFX cheat sheet

The exam JavaFX task is a window with a menu, a file chooser, two lists, and a mode switch. Build it in that order. A running window with an empty list scores more than a perfect layout that never starts.

## Minimal application

```java
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.layout.StackPane;
import javafx.stage.Stage;

public class App extends Application {

    @Override
    public void start(Stage stage) {
        StackPane root = new StackPane(new Label("Hello"));
        Scene scene = new Scene(root, 600, 400);
        stage.setTitle("App");
        stage.setScene(scene);
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
```

Run with Maven:

```bash
mvn javafx:run
```

Or add the JavaFX SDK to the project libraries in IntelliJ. The modules you normally need are `javafx.controls` and `javafx.fxml` when you use FXML.

## Layouts

| Layout | Use |
|---|---|
| `VBox` | Stack children vertically |
| `HBox` | Place children side by side |
| `BorderPane` | Top menu, center content, bottom status |
| `GridPane` | Form rows and columns |
| `StackPane` | Center a dialog or overlay |
| `FlowPane` | Wrap cards when the window is narrow |

```java
VBox root = new VBox(10);
root.setPadding(new Insets(12));

HBox row = new HBox(10);
row.setAlignment(Pos.CENTER_LEFT);

BorderPane border = new BorderPane();
border.setTop(menuBar);
border.setCenter(row);
```

Growth is controlled by the parent:

```java
VBox.setVgrow(list, Priority.ALWAYS);
HBox.setHgrow(list, Priority.ALWAYS);
```

Without `setVgrow` or `setHgrow`, a resizable control stays at its preferred size even when the window grows.

## Sizing

```java
list.setPrefSize(200, 350);      // starting size
list.setMinSize(200, 200);       // do not shrink below this
list.setMaxSize(Double.MAX_VALUE, Double.MAX_VALUE); // allow growth
```

For a list that grows only vertically, set a fixed width and let the height grow:

```java
list.setPrefWidth(200);
list.setMinWidth(200);
list.setMaxWidth(200);
list.setPrefHeight(350);
list.setMaxHeight(Double.MAX_VALUE);
```

For a list that grows both ways:

```java
list.setPrefSize(400, 350);
list.setMaxSize(Double.MAX_VALUE, Double.MAX_VALUE);
```

Keep a gap between the two lists with `HBox` spacing or `HBox.setMargin`. Do not rely on the list border alone.

## Buttons and events

```java
Button save = new Button("Save");
save.setOnAction(event -> {
    System.out.println("Saved");
});

TextField name = new TextField();
name.setPromptText("Guest name");

CheckBox extra = new CheckBox("Extra bed");
boolean wantsExtra = extra.isSelected();
```

Use a lambda when the handler is short. Use a named method when the same action is reused by a menu item and a button.

## Radio buttons and ToggleGroup

```java
RadioButton years = new RadioButton("Years");
RadioButton hotels = new RadioButton("Hotels");

ToggleGroup mode = new ToggleGroup();
years.setToggleGroup(mode);
hotels.setToggleGroup(mode);
years.setSelected(true);

mode.selectedToggleProperty().addListener((observable, oldToggle, newToggle) -> {
    if (newToggle == null) {
        return;
    }
    if (years.isSelected()) {
        showYears();
    } else {
        showHotels();
    }
});
```

The `newToggle == null` guard matters: clicking the selected radio button can clear the group in some setups. Without the guard, the mode handler runs with no selection.

## ListView

```java
ListView<String> list = new ListView<>();
ObservableList<String> items = FXCollections.observableArrayList();
list.setItems(items);

items.addAll("2023", "2024", "2025");

list.getSelectionModel().selectedItemProperty().addListener(
    (observable, oldValue, newValue) -> {
        if (newValue != null) {
            System.out.println("Selected: " + newValue);
        }
    }
);
```

Clear before refilling when the mode changes:

```java
items.clear();
```

If you keep adding without clearing, the old rows stay and the exam screenshot will not match.

Replace the whole list when the data changes:

```java
list.setItems(FXCollections.observableArrayList(newItems));
```

## Menu bar and shortcuts

```java
MenuItem open = new MenuItem("Open");
open.setAccelerator(KeyCombination.keyCombination("Shortcut+O"));
open.setOnAction(event -> openFile());

MenuItem exit = new MenuItem("Exit");
exit.setOnAction(event -> Platform.exit());

Menu file = new Menu("File");
file.getItems().addAll(open, new SeparatorMenuItem(), exit);

MenuItem about = new MenuItem("About");
about.setOnAction(event -> showAbout());

Menu help = new Menu("Help");
help.getItems().add(about);

MenuBar menuBar = new MenuBar(file, help);
```

`Shortcut` maps to Ctrl on Windows and Linux, Command on macOS. Use `Ctrl+O` only when the task explicitly says Ctrl.

## FileChooser

```java
FileChooser chooser = new FileChooser();
chooser.setTitle("Open bookings CSV");
chooser.getExtensionFilters().add(
    new FileChooser.ExtensionFilter("CSV files", "*.csv")
);

File file = chooser.showOpenDialog(stage);
if (file == null) {
    return; // user pressed Cancel
}
```

Always check for `null`. Cancel is not an error.

Read the file with `Files.readAllLines(file.toPath())` or `Files.newBufferedReader`. Keep the parsing method outside the JavaFX code so you can test it from a plain `main`.

## Alerts

```java
Alert alert = new Alert(Alert.AlertType.INFORMATION);
alert.setTitle("About");
alert.setHeaderText("Bookings viewer");
alert.setContentText("Exam sample application.");
alert.showAndWait();
```

For an error:

```java
Alert error = new Alert(Alert.AlertType.ERROR);
error.setTitle("Error");
error.setHeaderText("Could not read the file");
error.setContentText(exception.getMessage());
error.showAndWait();
```

`show()` opens and returns immediately. `showAndWait()` blocks until the user closes the dialog. Use `showAndWait` for About and errors.

## TableView

A `TableView` needs a model class with JavaFX properties or cell value factories.

```java
TableView<Booking> table = new TableView<>();

TableColumn<Booking, String> guest = new TableColumn<>("Guest");
guest.setCellValueFactory(cell ->
    new ReadOnlyStringWrapper(cell.getValue().customerEmail())
);

TableColumn<Booking, Number> adults = new TableColumn<>("Adults");
adults.setCellValueFactory(cell ->
    new ReadOnlyIntegerWrapper(cell.getValue().adults())
);

table.getColumns().addAll(guest, adults);
table.setItems(FXCollections.observableArrayList(bookings));
```

For a record, use `ReadOnlyStringWrapper` and `ReadOnlyIntegerWrapper`. `PropertyValueFactory` expects getters such as `getCustomerEmail()`, which records do not have.

Set column widths when the exam gives them:

```java
guest.setPrefWidth(220);
table.setColumnResizePolicy(TableView.CONSTRAINED_RESIZE_POLICY);
```

## ComboBox, DatePicker, Spinner

```java
ComboBox<String> city = new ComboBox<>();
city.getItems().addAll("Budapest", "Debrecen", "Szeged");
city.setValue("Budapest");

DatePicker date = new DatePicker(LocalDate.now());

Spinner<Integer> guests = new Spinner<>(1, 10, 2);
guests.setEditable(true);
```

Read values with `city.getValue()`, `date.getValue()`, and `guests.getValue()`.

## Properties and binding

```java
Label preview = new Label();
TextField input = new TextField();

preview.textProperty().bind(input.textProperty());

Button save = new Button("Save");
save.disableProperty().bind(input.textProperty().isEmpty());
```

Binding keeps two values in sync. Use `bindBidirectional` when both sides may change. Unbind before setting a bound property by hand, otherwise JavaFX throws `A bound value cannot be set`.

## CSS

```java
scene.getStylesheets().add(
    getClass().getResource("app.css").toExternalForm()
);
```

```css
.root {
    -fx-font-family: "Segoe UI", Arial, sans-serif;
    -fx-background-color: #f8fafc;
}

.list-view {
    -fx-background-color: white;
    -fx-border-color: #cbd5e1;
    -fx-border-radius: 6;
}

.list-cell:selected {
    -fx-background-color: #1d4ed8;
    -fx-text-fill: white;
}
```

`getResource("app.css")` looks beside the class file. If the CSS is in `src/main/resources`, use the path from the resource root, for example `getResource("/app.css")`. A `null` resource throws a `NullPointerException` in `toExternalForm`.

## FXML

```java
FXMLLoader loader = new FXMLLoader(getClass().getResource("app.fxml"));
Parent root = loader.load();
```

```xml
<VBox xmlns:fx="http://javafx.com/fxml" fx:controller="AppController">
    <Button text="Save" onAction="#handleSave"/>
</VBox>
```

```java
public class AppController {
    @FXML
    private void handleSave() {
        System.out.println("Saved");
    }
}
```

The `fx:id` value must match the field name, and the `onAction` value must match the method name exactly. FXML errors usually name the missing field or method.

## Scene switching

```java
Parent root = FXMLLoader.load(getClass().getResource("second.fxml"));
stage.setScene(new Scene(root, 800, 600));
```

Keep one `Stage` and replace the scene. Do not call `launch` again.

## Common errors

| Error | Cause | Fix |
|---|---|---|
| `Exception in Application start method` | An exception inside `start` | Read the `Caused by` line |
| `NullPointerException` on `getResource` | CSS or FXML path is wrong | Check the resource root and the leading slash |
| `IllegalStateException: Not on FX application thread` | UI changed from a background thread | Wrap in `Platform.runLater` |
| `NoClassDefFoundError: javafx/...` | JavaFX is not on the module path | Add the SDK or use `mvn javafx:run` |
| List does not grow | Missing `setVgrow` or `setHgrow` | Set the grow priority on the child |
| Two lists touch | No spacing or margin | `HBox` spacing or `HBox.setMargin` |
| Old rows stay after a mode switch | Missing `items.clear()` | Clear the list before refilling |
| Radio group has no selection | User clicked the selected button | Guard `newToggle == null` |

## Exam checklist

1. Start the window and set the title.
2. Add the menu bar and the Exit item.
3. Add the file chooser and load the CSV.
4. Add the two lists with the required sizes.
5. Add the radio buttons and the mode switch.
6. Clear the right list when the mode changes.
7. Add About and the error alert.
8. Add CSS only after the behavior works.
