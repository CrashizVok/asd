# JavaFX FXML project

JavaFX topic · Exam Wiki

FXML splits a JavaFX window into two files: an XML description of the nodes and a controller class that holds the behaviour. An FXML build of the exam task needs a window with a table, a form, a file open action and validation. This page builds one complete booking desk and explains every wire between the XML and the Java.

## Simplest form

```java
// Data shape: ObservableList<Booking> -> TableView<Booking> -> one row per record.
// The FXML file names the controller and the ids; the controller holds the list.
// These three lines are the whole idea:

FXMLLoader loader = new FXMLLoader(getClass().getResource("/app/bookings.fxml"));
Parent root = loader.load();   // builds the nodes, creates the controller, injects the fields
scene.getStylesheets().add(getClass().getResource("/app/app.css").toExternalForm());
```

`loader.load()` does four things in order: it parses the XML, it creates the controller named in `fx:controller`, it assigns every node with an `fx:id` to the matching `@FXML` field, and it calls the controller's `initialize()` method. The `Parent` it returns is the root node from the XML, ready for a `Scene`.

The data never lives in the XML. A `TableView<Booking>` holds an `ObservableList<Booking>`, and each `Booking` is one row. The form writes a `Booking` into that list or replaces one already there.

## What it does

The finished app opens a CSV of hotel bookings, shows the rows in a table, filters them as you type in a search box, and fills a form from the selected row. New creates an empty form, Save validates and writes, Delete asks first. A status label reports how many rows are loaded and how many the filter shows, and file errors appear in an alert.

The window is a `BorderPane`: a menu bar and a toolbar on top, and in the centre an `HBox` with the table on the left and the form on the right. That is four layout containers for the whole app, which is enough. FXML is worth using here because the nesting is deep and hand written layout code hides the structure.

## Every part

### Project layout

```
booking-desk/
  pom.xml
  src/main/java/app/BookingApp.java          starts the app, loads FXML and CSS
  src/main/java/app/Booking.java            one row, an immutable record
  src/main/java/app/BookingFile.java        CSV to List<Booking>, no JavaFX imports
  src/main/java/app/BookingController.java  all UI behaviour
  src/main/resources/app/bookings.fxml      the window
  src/main/resources/app/app.css            the theme
  data/bookings-sample.csv                  test data, not on the classpath
```

Anything under `src/main/resources` is copied to the root of `target/classes`, so `app/bookings.fxml` becomes `/app/bookings.fxml` on the classpath. The leading slash in `getResource("/app/bookings.fxml")` means "from the classpath root". Drop the slash and the lookup starts beside the calling class instead, which breaks as soon as the caller moves to another package.

The parser class has no JavaFX imports. Keeping it separate means you can run it from a `main` method while the GUI still refuses to start, and it means the exam grader can read the file logic without scrolling past layout code.

### pom.xml

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>exam</groupId>
    <artifactId>booking-desk</artifactId>
    <version>1.0.0</version>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <maven.compiler.release>21</maven.compiler.release>
        <javafx.version>21.0.2</javafx.version>
    </properties>

    <dependencies>
        <!-- Controls are the widgets. -->
        <dependency>
            <groupId>org.openjfx</groupId>
            <artifactId>javafx-controls</artifactId>
            <version>${javafx.version}</version>
        </dependency>
        <!-- FXML is a separate artifact. Forgetting it fails at runtime, not at compile time. -->
        <dependency>
            <groupId>org.openjfx</groupId>
            <artifactId>javafx-fxml</artifactId>
            <version>${javafx.version}</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.openjfx</groupId>
                <artifactId>javafx-maven-plugin</artifactId>
                <version>0.0.8</version>
                <configuration>
                    <mainClass>app.BookingApp</mainClass>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

If the project has a `module-info.java`, FXML needs two extra lines or the loader fails with an access error:

```java
module app {
    requires javafx.controls;
    requires javafx.fxml;
    // The loader builds the controller by reflection, so the package must be open.
    opens app to javafx.fxml;
    exports app;
}
```

`mvn javafx:run` reads `mainClass`, puts the JavaFX modules on the module path and starts the app. A wrong `mainClass` produces "module not found" style errors that have nothing to do with your code.

### The FXML file

The root element carries the controller:

```xml
<BorderPane xmlns="http://javafx.com/javafx/21"
            xmlns:fx="http://javafx.com/fxml/1"
            fx:controller="app.BookingController">
```

`fx:controller` takes the fully qualified class name. A typo here is a `ClassNotFoundException` wrapped in a `LoadException`, and the message names the class you wrote, so read it before changing anything else.

`<?import ...?>` at the top lists every JavaFX class used in the file. Without an import, a tag like `<TableView>` is unknown and the parser reports the line number. Wildcard imports work too; explicit imports make the top of the file a list of what the window contains.

`fx:id` is the bridge to Java:

```xml
<TextField fx:id="emailField"/>
```

```java
@FXML
private TextField emailField;
```

The names must match exactly, including case. The type must match too, or the loader throws while injecting. `@FXML` is required for private and protected fields; public fields are injected without it, which is why students who copy a public field sometimes think the annotation is optional. Always write it.

`onAction="#onSave"` calls a method on the controller:

```xml
<Button text="Save" onAction="#onSave"/>
```

```java
@FXML
private void onSave() {
    // handle the click
}
```

The handler may take no arguments or one `ActionEvent`, must return `void`, and may be private. The loader looks the method up by name with reflection, so a rename in one file and not the other fails at startup, not at compile time. Menu items use `onAction` the same way.

Property elements set objects that are not simple strings. Padding is the common case:

```xml
<HBox spacing="10">
    <padding>
        <Insets top="10" right="12" bottom="10" left="12"/>
    </padding>
</HBox>
```

Layout constraints are attributes with a dot:

```xml
<TextField fx:id="cityField" GridPane.rowIndex="4" GridPane.columnIndex="1"/>
<TableView fx:id="table" HBox.hgrow="ALWAYS"/>
```

`HBox.hgrow="ALWAYS"` on the table is what makes it take the leftover width when the window grows. Without it the table keeps its preferred width and the form floats in the middle of an empty strip. `VBox.vgrow="ALWAYS"` does the same for vertical growth inside a `VBox`.

### The controller

`FXMLLoader` creates the controller with its no-argument constructor. That has two consequences: a controller with only a constructor that takes arguments cannot be loaded, and data must arrive after construction.

```java
FXMLLoader loader = new FXMLLoader(getClass().getResource("/app/bookings.fxml"));
Parent root = loader.load();
BookingController controller = loader.getController();
controller.setDeskName("Front desk");   // any setter you add to the controller
```

`initialize()` runs after every `@FXML` field is injected and before the scene is shown. It is the first point where the injected nodes are non-null. Annotate it with `@FXML`:

```java
@FXML
private void initialize() {
    // safe: fields are injected by now
}
```

Do not touch injected fields in the constructor. They are still null there, and the resulting `NullPointerException` points at a line that looks correct.

### The table

The table needs three things: columns, a cell value factory per column, and an observable list of items.

A column with no cell value factory stays empty. FXML can declare the column but cannot express the lambda that reads a value out of a row, so the factory goes in `initialize()`:

```java
guestColumn.setCellValueFactory(cell -> new ReadOnlyStringWrapper(cell.getValue().guestName()));
startColumn.setCellValueFactory(cell -> new ReadOnlyObjectWrapper<>(cell.getValue().startDate()));
```

`cell.getValue()` is the row object, not the cell text. The factory must return an `ObservableValue`, which is why the wrappers exist. For a `String` use `ReadOnlyStringWrapper`; for anything else, including `LocalDate`, `Integer` and `Long`, `ReadOnlyObjectWrapper` works and keeps sorting by the natural order of the value.

`PropertyValueFactory` is the older shortcut and it requires a JavaBean getter, meaning `getStartDate()` or `startDateProperty()`. It does not understand record accessors such as `startDate()`. Point it at a record and you get empty columns with no exception, which is the worst kind of bug to debug under exam pressure. Use the lambda.

Items:

```java
private final ObservableList<Booking> bookings = FXCollections.observableArrayList();
...
table.setItems(bookings);
```

`new ObservableList<>()` does not exist and `getItems()` is null until you call `setItems`. Add and remove through the same list object; replacing the list with a plain `ArrayList` breaks the table's updates because a plain list does not notify anyone.

Column widths: by default a `TableView` keeps the declared widths and leaves empty space at the right edge. The constrained policies stretch the columns to fill:

```java
table.setColumnResizePolicy(TableView.CONSTRAINED_RESIZE_POLICY_FLEX_LAST_COLUMN);
```

That constant exists from JavaFX 20. With a constrained policy the `prefWidth` values become proportions, not fixed pixels, so a 60 pixel Stars column and a 150 pixel Hotel column still keep their ratio. On an older JavaFX use `TableView.CONSTRAINED_RESIZE_POLICY`, which is deprecated in 20 but works.

Sorting is built in: clicking a header sorts if the column value is `Comparable`. Once a `FilteredList` sits between the data and the table, wrap it in a `SortedList` and bind the comparators, otherwise the header arrows move but the rows do not:

```java
filtered = new FilteredList<>(bookings, booking -> true);
SortedList<Booking> sorted = new SortedList<>(filtered);
sorted.comparatorProperty().bind(table.comparatorProperty());
table.setItems(sorted);
```

### The form

One form serves both add and edit. The controller keeps a reference to the booking currently shown:

```java
private Booking editing;   // null means the form is adding a new row
```

Selecting a table row fills the fields and sets `editing`. New clears the selection and the fields, so `editing` becomes null and the next Save adds instead of replacing. Save builds a new `Booking`; because the record is immutable there is no half updated row in the table:

```java
if (editing == null) {
    bookings.add(saved);
} else {
    bookings.set(bookings.indexOf(editing), saved);
}
```

`indexOf` is safe on a record because records compare by value. Two identical bookings would compare equal, which only matters if the same guest, hotel and dates appear twice.

After saving, point the form at the saved row and select it in the table, so a second Save updates instead of adding a duplicate. The form keeps that row even when an active search filter hides it from the table.

### Validation

Collect every problem, then show them once. Stopping at the first error makes the user resubmit four times and is the most common reason a form feels broken.

```java
private List<String> validate() {
    List<String> problems = new ArrayList<>();
    if (isBlank(firstNameField.getText())) problems.add("First name is required.");
    ...
    return problems;
}
```

Validate on Save, not on every keystroke. Live validation that turns red while the user is still typing the first character teaches people to ignore red.

Trim before checking. A field with one space is empty to a human and non-empty to `isEmpty()`, so use `isBlank()`.

Numbers from `TextField` need a parser that returns failure instead of throwing:

```java
private static Integer parseCount(String value) {
    if (value == null) return null;
    try {
        return Integer.valueOf(value.trim());
    } catch (NumberFormatException ex) {
        return null;
    }
}
```

An empty children field usually means zero, so substitute `"0"` before parsing. An empty adults field is an error, not zero.

Dates: `DatePicker.getValue()` returns `null` until a date is picked. A comparison such as `end.isAfter(start)` throws on null, so check both for null first and add a problem for each missing one. Then check the order.

The error label needs both flags to disappear from the layout:

```java
errorLabel.setVisible(false);
errorLabel.setManaged(false);
```

`visible` hides it; `managed` removes the space it occupied. Setting only `visible` leaves a gap in the form.

### Alerts

```java
Alert alert = new Alert(Alert.AlertType.WARNING);
alert.setTitle("Check the form");
alert.setHeaderText("The booking was not saved.");
alert.setContentText(String.join("\n", problems));
alert.initOwner(window());
alert.showAndWait();
```

`showAndWait` blocks until the user closes the dialog, which is what you want for a decision. `show()` returns immediately and the rest of the method runs against a form the user has not answered about yet.

`initOwner` ties the dialog to the main window: without it the alert can open behind the window and the user sees a frozen app.

For a yes or no question, pass the buttons and read the result:

```java
Alert confirm = new Alert(Alert.AlertType.CONFIRMATION,
        "Delete the booking for " + selected.guestName() + "?",
        ButtonType.OK, ButtonType.CANCEL);
confirm.setHeaderText(null);   // no header, the question is the content
Optional<ButtonType> answer = confirm.showAndWait();
if (answer.isPresent() && answer.get() == ButtonType.OK) {
    bookings.remove(selected);
}
```

A result is only guaranteed once a button was pressed, so compare against the button you asked for instead of testing whether `CANCEL` is missing. Closing the dialog from the window frame can leave it empty.

### Files

`FileChooser` needs an owner window, an extension filter, and a null check:

```java
FileChooser chooser = new FileChooser();
chooser.setTitle("Open bookings CSV");
chooser.getExtensionFilters().add(new FileChooser.ExtensionFilter("CSV files", "*.csv"));
File file = chooser.showOpenDialog(window());
if (file == null) {
    return;   // the user pressed Cancel
}
```

Cancel returns null. A missing null check turns Cancel into a `NullPointerException` on `file.toPath()`.

Read with `Files.readAllLines(path, StandardCharsets.UTF_8)`. The charset matters: the default is UTF-8 on modern JDKs but naming it stops the surprise on a machine set to something else.

Excel exports begin with a byte order mark, which sticks to the first header name and turns `customer_email` into `\uFEFFcustomer_email`. Strip it:

```java
if (lines.get(0).startsWith("\uFEFF")) {
    lines.set(0, lines.get(0).substring(1));
}
```

Detect the header instead of assuming it. If the first line contains the field name `customer_email`, it is a header and the data starts on line 2; otherwise the file has no header and the columns follow the exam order. Map names to indexes once, then read cells by name. That survives a file with the columns in a different order.

Skip a broken row and count it. One row with a malformed date must not cost the other two hundred:

```java
try {
    rows.add(parse(cells));
} catch (RuntimeException ex) {
    skipped++;
}
```

Report the skipped count in the status label or in the alert after loading. Silent skipping looks like a parsing bug; a number explains it.

Dates arrive as `2026-05-04` or as `2026-05-04T00:00:00`. `LocalDate.parse` accepts the first and rejects the second, so cut a long value to ten characters first. If the file uses `2026.05.04.`, parse with `DateTimeFormatter.ofPattern("yyyy.MM.dd.")` instead, and do it in the same helper so every call site stays unchanged.

### CSS

Stylesheets attach to the scene, not the root:

```java
URL css = BookingApp.class.getResource("/app/app.css");
if (css != null) {
    scene.getStylesheets().add(css.toExternalForm());
}
```

An FXML file can also carry `stylesheets="@app.css"` on the root. Both work; the scene version makes the null case visible.

JavaFX CSS uses the `-fx-` prefix on every property. `background-color` is silently ignored, `-fx-background-color` applies. A selector that matches nothing also fails silently, so when a style does not show up, check the spelling of the style class in both files.

A style class is added with `styleClass` in FXML or `getStyleClass().add("form")` in code. A style class starts with a dot in CSS; an id starts with `#` and comes from `setId`, not from `fx:id`. That distinction trips people who try to style `#emailField` and find nothing happens, because `fx:id` does not set the CSS id.

Selected rows need one extra level of selector, because the text is drawn by cells, not by the row:

```css
.table-row-cell:filled:selected {
    -fx-background-color: #dbe8ff;
}

.table-row-cell:filled:selected .table-cell {
    -fx-text-fill: #16223a;
}
```

## Examples

### Example 1: the smallest FXML window

Two files. The XML holds a label with an id, the controller changes its text in `initialize()`, and the application loads both.

```xml
<?xml version="1.0" encoding="UTF-8"?>

<?import javafx.scene.control.Label?>
<?import javafx.scene.layout.VBox?>

<VBox xmlns="http://javafx.com/javafx/21"
      xmlns:fx="http://javafx.com/fxml/1"
      fx:controller="app.HelloController"
      alignment="CENTER" spacing="10">
    <Label text="Bookings" style="-fx-font-size: 20px;"/>
    <Label fx:id="statusLabel" text="No file loaded"/>
</VBox>
```

```java
package app;

import javafx.fxml.FXML;
import javafx.scene.control.Label;

public class HelloController {

    // Injected before initialize() runs.
    @FXML
    private Label statusLabel;

    @FXML
    private void initialize() {
        statusLabel.setText("Ready");
    }
}
```

```java
package app;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;

import java.net.URL;

public class HelloApp extends Application {

    @Override
    public void start(Stage stage) throws Exception {
        URL fxml = HelloApp.class.getResource("/app/hello.fxml");
        if (fxml == null) {
            throw new IllegalStateException("hello.fxml is not on the classpath");
        }

        Parent root = new FXMLLoader(fxml).load();
        stage.setTitle("Hello");
        stage.setScene(new Scene(root, 360, 160));
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
```

Run it with `mvn javafx:run` after setting `<mainClass>app.HelloApp</mainClass>`. The label reads Ready, which proves the injection and the `initialize()` order. If the label is empty, the controller class name in `fx:controller` is wrong.

### Example 2: a table bound to a list

The table is the part with the most wires: items, columns, factories, selection. This example keeps the record and the list small so the wiring is visible.

```xml
<?xml version="1.0" encoding="UTF-8"?>

<?import javafx.scene.control.TableColumn?>
<?import javafx.scene.control.TableView?>
<?import javafx.scene.layout.VBox?>

<VBox xmlns="http://javafx.com/javafx/21"
      xmlns:fx="http://javafx.com/fxml/1"
      fx:controller="app.TableController" spacing="10" prefWidth="560" prefHeight="300">
    <TableView fx:id="table" VBox.vgrow="ALWAYS">
        <columns>
            <TableColumn fx:id="guestColumn" text="Guest" prefWidth="180"/>
            <TableColumn fx:id="cityColumn" text="City" prefWidth="140"/>
            <TableColumn fx:id="nightsColumn" text="Nights" prefWidth="80"/>
        </columns>
    </TableView>
</VBox>
```

```java
package app;

import javafx.beans.property.ReadOnlyObjectWrapper;
import javafx.beans.property.ReadOnlyStringWrapper;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class TableController {

    // The model can be a nested record when the example is short.
    public record Row(String guest, String city, LocalDate from, LocalDate to) {
        long nights() {
            return ChronoUnit.DAYS.between(from, to);
        }
    }

    @FXML private TableView<Row> table;
    @FXML private TableColumn<Row, String> guestColumn;
    @FXML private TableColumn<Row, String> cityColumn;
    @FXML private TableColumn<Row, Number> nightsColumn;

    private final ObservableList<Row> rows = FXCollections.observableArrayList(
            new Row("Nagy Anna", "Budapest", LocalDate.of(2026, 5, 4), LocalDate.of(2026, 5, 8)),
            new Row("Kis Bela", "Szeged", LocalDate.of(2026, 6, 1), LocalDate.of(2026, 6, 3)));

    @FXML
    private void initialize() {
        guestColumn.setCellValueFactory(cell -> new ReadOnlyStringWrapper(cell.getValue().guest()));
        cityColumn.setCellValueFactory(cell -> new ReadOnlyStringWrapper(cell.getValue().city()));
        nightsColumn.setCellValueFactory(cell -> new ReadOnlyObjectWrapper<>(cell.getValue().nights()));

        // A lambda per column is required: PropertyValueFactory cannot see record accessors.
        table.setItems(rows);
        table.setColumnResizePolicy(TableView.CONSTRAINED_RESIZE_POLICY_FLEX_LAST_COLUMN);

        // Selection reads the row object, not the text of the cell.
        table.getSelectionModel().selectedItemProperty().addListener(
                (observable, oldRow, newRow) -> {
                    if (newRow != null) {
                        System.out.println(newRow.guest() + ", " + newRow.nights() + " nights");
                    }
                });
    }
}
```

The Nights column sorts numerically because its value is a `Number`. Had it been a formatted string such as `"4 nights"`, clicking the header would sort it as text and put 10 before 4.

### Example 3: the booking desk, full source

Seven files. The order below is also the order to build them in: model first, parser second, controller third, FXML last, because the FXML refers to ids that must already exist in the controller.

`src/main/java/app/Booking.java`

```java
package app;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Locale;

/**
 * One booking, one table row.
 *
 * A record keeps the update path simple: the form builds a new instance and the
 * list replaces the old one, so no row is ever half edited. The component names
 * follow the exam CSV header.
 */
public record Booking(
        int id,
        String customerEmail,
        String firstName,
        String lastName,
        int hotelId,
        String hotelName,
        String city,
        int stars,
        LocalDate startDate,
        LocalDate endDate,
        int adults,
        int children) {

    /** What the table and the alerts show. Falls back to the email when there is no name. */
    public String guestName() {
        String name = (firstName + " " + lastName).trim();
        return name.isEmpty() ? customerEmail : name;
    }

    public long nights() {
        return ChronoUnit.DAYS.between(startDate, endDate);
    }

    public int guests() {
        return adults + children;
    }

    /** Case insensitive search over the columns a desk clerk would type. */
    public boolean matches(String query) {
        String text = (guestName() + " " + hotelName + " " + city + " " + customerEmail)
                .toLowerCase(Locale.ROOT);
        return text.contains(query);
    }
}
```

`src/main/java/app/BookingFile.java`

```java
package app;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * CSV in, List<Booking> out. No JavaFX here, so it can be tested from a main
 * method before the window ever starts.
 */
public final class BookingFile {

    /** rows holds the usable bookings, skipped counts lines that failed to parse. */
    public record Result(List<Booking> rows, int skipped) {}

    /** Used when the file has no header row. Matches the exam CSV order. */
    private static final List<String> DEFAULT_HEADER = List.of(
            "customer_email", "first_name", "last_name", "phone", "birthday",
            "customer_image", "hotel_id", "hotel_city", "hotel_name",
            "hotel_description", "hotel_stars", "hotel_owner_email",
            "hotel_image", "start_date", "end_date", "adults", "children",
            "boylovers");

    private BookingFile() {
        // Static helper class.
    }

    public static Result read(Path path) throws IOException {
        List<String> lines = Files.readAllLines(path, StandardCharsets.UTF_8);
        if (lines.isEmpty()) {
            return new Result(List.of(), 0);
        }

        // Excel writes a byte order mark; it would glue itself to the first column name.
        if (lines.get(0).startsWith("\uFEFF")) {
            lines.set(0, lines.get(0).substring(1));
        }

        // Decide where the data starts by looking for a known header name.
        List<String> header = DEFAULT_HEADER;
        int firstDataLine = 0;
        List<String> firstCells = split(lines.get(0));
        if (firstCells.contains("customer_email")) {
            header = firstCells;
            firstDataLine = 1;
        }

        // Name to position once, then read cells by name. Column order stops mattering.
        Map<String, Integer> column = new HashMap<>();
        for (int i = 0; i < header.size(); i++) {
            column.put(header.get(i).trim(), i);
        }

        List<Booking> rows = new ArrayList<>();
        int skipped = 0;

        for (int i = firstDataLine; i < lines.size(); i++) {
            if (lines.get(i).isBlank()) {
                continue;
            }
            try {
                List<String> cells = split(lines.get(i));
                rows.add(new Booking(
                        rows.size() + 1,                               // id, replaced on load
                        cell(cells, column, "customer_email"),
                        cell(cells, column, "first_name"),
                        cell(cells, column, "last_name"),
                        number(cell(cells, column, "hotel_id")),
                        cell(cells, column, "hotel_name"),
                        cell(cells, column, "hotel_city"),
                        number(cell(cells, column, "hotel_stars")),
                        date(cell(cells, column, "start_date")),
                        date(cell(cells, column, "end_date")),
                        number(cell(cells, column, "adults")),
                        number(cell(cells, column, "children"))));
            } catch (RuntimeException ex) {
                // One broken row must not hide the other two hundred.
                skipped++;
            }
        }

        return new Result(rows, skipped);
    }

    /**
     * Plain comma split. A comma inside quotes would shift the columns after it,
     * which exam files do not contain.
     */
    private static List<String> split(String line) {
        return List.of(line.split(",", -1));
    }

    /** A missing column and a short row both read as empty, so an older file never crashes. */
    private static String cell(List<String> cells, Map<String, Integer> column, String name) {
        Integer index = column.get(name);
        return index == null || index >= cells.size() ? "" : cells.get(index).trim();
    }

    private static int number(String value) {
        if (value.isBlank()) {
            return 0;
        }
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException ex) {
            return 0;   // a non numeric star count shows up as 0 stars in the table
        }
    }

    /** ISO dates only. A longer value is cut to the date part. Throws on a malformed date. */
    private static LocalDate date(String value) {
        String text = value.trim();
        if (text.length() > 10) {
            text = text.substring(0, 10);
        }
        return LocalDate.parse(text);
    }
}
```

`src/main/java/app/BookingController.java`

```java
package app;

import javafx.application.Platform;
import javafx.beans.property.ReadOnlyObjectWrapper;
import javafx.beans.property.ReadOnlyStringWrapper;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.collections.transformation.FilteredList;
import javafx.collections.transformation.SortedList;
import javafx.fxml.FXML;
import javafx.scene.control.Alert;
import javafx.scene.control.ButtonType;
import javafx.scene.control.ComboBox;
import javafx.scene.control.DatePicker;
import javafx.scene.control.Label;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.TextField;
import javafx.stage.FileChooser;
import javafx.stage.Window;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

/**
 * All behaviour for bookings.fxml.
 *
 * The field names after @FXML must match the fx:id values in the XML. The
 * method names after onAction must match the handlers there too. Neither link is
 * checked by the compiler, so a typo appears at startup as a LoadException.
 */
public class BookingController {

    // Injected nodes. The table comes first, then the form, then the labels.
    @FXML private TableView<Booking> table;
    @FXML private TableColumn<Booking, String> guestColumn;
    @FXML private TableColumn<Booking, String> hotelColumn;
    @FXML private TableColumn<Booking, String> cityColumn;
    @FXML private TableColumn<Booking, Number> starsColumn;
    @FXML private TableColumn<Booking, LocalDate> startColumn;
    @FXML private TableColumn<Booking, LocalDate> endColumn;
    @FXML private TableColumn<Booking, Number> nightsColumn;
    @FXML private TableColumn<Booking, Number> guestsColumn;

    @FXML private TextField searchField;
    @FXML private TextField firstNameField;
    @FXML private TextField lastNameField;
    @FXML private TextField emailField;
    @FXML private TextField hotelField;
    @FXML private TextField cityField;
    @FXML private ComboBox<Integer> starsBox;
    @FXML private DatePicker startPicker;
    @FXML private DatePicker endPicker;
    @FXML private TextField adultsField;
    @FXML private TextField childrenField;
    @FXML private Label errorLabel;
    @FXML private Label statusLabel;

    /** Master data. Never replaced, only mutated, so the filter and the table stay attached. */
    private final ObservableList<Booking> bookings = FXCollections.observableArrayList();
    private FilteredList<Booking> filtered;
    private Booking editing;      // the row shown in the form, null while adding
    private int nextId = 1;
    private String loadedFile = "";

    @FXML
    private void initialize() {
        // A column without a cell value factory stays empty.
        guestColumn.setCellValueFactory(cell -> new ReadOnlyStringWrapper(cell.getValue().guestName()));
        hotelColumn.setCellValueFactory(cell -> new ReadOnlyStringWrapper(cell.getValue().hotelName()));
        cityColumn.setCellValueFactory(cell -> new ReadOnlyStringWrapper(cell.getValue().city()));
        starsColumn.setCellValueFactory(cell -> new ReadOnlyObjectWrapper<>(cell.getValue().stars()));
        startColumn.setCellValueFactory(cell -> new ReadOnlyObjectWrapper<>(cell.getValue().startDate()));
        endColumn.setCellValueFactory(cell -> new ReadOnlyObjectWrapper<>(cell.getValue().endDate()));
        nightsColumn.setCellValueFactory(cell -> new ReadOnlyObjectWrapper<>(cell.getValue().nights()));
        guestsColumn.setCellValueFactory(cell -> new ReadOnlyObjectWrapper<>(cell.getValue().guests()));

        // The star rating cannot be typed, so a bad value is impossible by construction.
        starsBox.getItems().setAll(1, 2, 3, 4, 5);

        // Constrained widths: columns share the window instead of leaving a gap.
        table.setColumnResizePolicy(TableView.CONSTRAINED_RESIZE_POLICY_FLEX_LAST_COLUMN);

        // Filter, then sort, then show. The bind keeps header clicks working.
        filtered = new FilteredList<>(bookings, booking -> true);
        SortedList<Booking> sorted = new SortedList<>(filtered);
        sorted.comparatorProperty().bind(table.comparatorProperty());
        table.setItems(sorted);

        table.getSelectionModel().selectedItemProperty().addListener(
                (observable, oldRow, newRow) -> showBooking(newRow));
        searchField.textProperty().addListener(
                (observable, oldText, newText) -> applyFilter());

        clearForm();
        updateStatus();
    }

    // ---------------------------------------------------------------- table and form

    /** Fills the form from a row, or empties it when the selection is cleared. */
    private void showBooking(Booking booking) {
        editing = booking;
        clearErrors();

        if (booking == null) {
            clearForm();
            return;
        }

        firstNameField.setText(booking.firstName());
        lastNameField.setText(booking.lastName());
        emailField.setText(booking.customerEmail());
        hotelField.setText(booking.hotelName());
        cityField.setText(booking.city());
        starsBox.setValue(booking.stars());
        startPicker.setValue(booking.startDate());
        endPicker.setValue(booking.endDate());
        adultsField.setText(String.valueOf(booking.adults()));
        childrenField.setText(String.valueOf(booking.children()));
    }

    /** Empties the fields without touching the selection, so listeners do not loop. */
    private void clearForm() {
        editing = null;
        firstNameField.clear();
        lastNameField.clear();
        emailField.clear();
        hotelField.clear();
        cityField.clear();
        starsBox.setValue(null);
        startPicker.setValue(null);
        endPicker.setValue(null);
        adultsField.setText("1");
        childrenField.setText("0");
        clearErrors();
    }

    private void applyFilter() {
        String query = searchField.getText() == null
                ? ""
                : searchField.getText().trim().toLowerCase(Locale.ROOT);
        filtered.setPredicate(booking -> query.isEmpty() || booking.matches(query));
        updateStatus();
    }

    private void updateStatus() {
        int shown = filtered == null ? bookings.size() : filtered.size();
        String file = loadedFile.isEmpty() ? "no file" : loadedFile;
        statusLabel.setText(bookings.size() + " bookings, " + shown + " shown, " + file);
    }

    // ---------------------------------------------------------------- validation

    /** Returns every problem at once, so the user fixes the form in one pass. */
    private List<String> validate() {
        List<String> problems = new ArrayList<>();

        if (isBlank(firstNameField.getText())) {
            problems.add("First name is required.");
        }
        if (isBlank(lastNameField.getText())) {
            problems.add("Last name is required.");
        }

        String email = emailField.getText().trim();
        if (!email.matches("[^@\\s]+@[^@\\s]+\\.[^@\\s]+")) {
            problems.add("Email must look like name@example.com.");
        }

        if (isBlank(hotelField.getText())) {
            problems.add("Hotel name is required.");
        }
        if (isBlank(cityField.getText())) {
            problems.add("City is required.");
        }
        if (starsBox.getValue() == null) {
            problems.add("Pick a star rating.");
        }

        LocalDate start = startPicker.getValue();
        LocalDate end = endPicker.getValue();
        if (start == null) {
            problems.add("Arrival date is required.");
        }
        if (end == null) {
            problems.add("Departure date is required.");
        }
        if (start != null && end != null && !end.isAfter(start)) {
            problems.add("Departure must be after arrival.");
        }

        Integer adults = parseCount(adultsField.getText());
        if (adults == null || adults < 1 || adults > 20) {
            problems.add("Adults must be a whole number from 1 to 20.");
        }
        Integer children = parseCount(isBlank(childrenField.getText()) ? "0" : childrenField.getText());
        if (children == null || children < 0 || children > 10) {
            problems.add("Children must be a whole number from 0 to 10.");
        }

        return problems;
    }

    private Booking readForm() {
        return new Booking(
                editing == null ? nextId++ : editing.id(),
                emailField.getText().trim(),
                firstNameField.getText().trim(),
                lastNameField.getText().trim(),
                editing == null ? 0 : editing.hotelId(),
                hotelField.getText().trim(),
                cityField.getText().trim(),
                starsBox.getValue(),
                startPicker.getValue(),
                endPicker.getValue(),
                Integer.parseInt(adultsField.getText().trim()),
                isBlank(childrenField.getText()) ? 0 : Integer.parseInt(childrenField.getText().trim()));
    }

    // ---------------------------------------------------------------- actions

    @FXML
    private void onSave() {
        List<String> problems = validate();
        if (!problems.isEmpty()) {
            showProblems(problems);
            return;
        }

        Booking saved = readForm();
        if (editing == null) {
            bookings.add(saved);
        } else {
            int index = bookings.indexOf(editing);
            if (index >= 0) {
                bookings.set(index, saved);
            } else {
                bookings.add(saved);
            }
        }

        // Keep the saved row in the form even when the filter hides it.
        editing = saved;
        table.getSelectionModel().select(saved);
        clearErrors();
        updateStatus();
    }

    @FXML
    private void onNew() {
        table.getSelectionModel().clearSelection();
        clearForm();
        firstNameField.requestFocus();
    }

    @FXML
    private void onDelete() {
        Booking selected = table.getSelectionModel().getSelectedItem();
        if (selected == null) {
            showAlert(Alert.AlertType.INFORMATION, "Nothing to delete",
                    "No row is selected.", "Click a row in the table first.");
            return;
        }

        Alert confirm = new Alert(Alert.AlertType.CONFIRMATION,
                "Delete the booking for " + selected.guestName() + "?",
                ButtonType.OK, ButtonType.CANCEL);
        confirm.setTitle("Delete booking");
        confirm.setHeaderText(null);
        confirm.initOwner(window());

        Optional<ButtonType> answer = confirm.showAndWait();
        if (answer.isPresent() && answer.get() == ButtonType.OK) {
            bookings.remove(selected);
            table.getSelectionModel().clearSelection();
            clearForm();
            updateStatus();
        }
    }

    @FXML
    private void onOpenFile() {
        FileChooser chooser = new FileChooser();
        chooser.setTitle("Open bookings CSV");
        chooser.getExtensionFilters().add(new FileChooser.ExtensionFilter("CSV files", "*.csv"));

        File file = chooser.showOpenDialog(window());
        if (file == null) {
            return;   // Cancel
        }

        try {
            BookingFile.Result result = BookingFile.read(file.toPath());
            bookings.setAll(result.rows());
            nextId = bookings.size() + 1;
            loadedFile = file.getName();
            table.getSelectionModel().clearSelection();
            clearForm();
            updateStatus();

            if (result.rows().isEmpty()) {
                showAlert(Alert.AlertType.WARNING, "No usable rows",
                        "The file has no bookings the app can read.",
                        "Check the header names and the date format. "
                                + result.skipped() + " line(s) were skipped.");
            }
        } catch (IOException ex) {
            showAlert(Alert.AlertType.ERROR, "Cannot read file",
                    "The file could not be read.", ex.getMessage());
        }
    }

    @FXML
    private void onAbout() {
        showAlert(Alert.AlertType.INFORMATION, "About", "Booking desk",
                "JavaFX FXML example.\nRows live in memory. Open a CSV to replace them.");
    }

    @FXML
    private void onExit() {
        Platform.exit();
    }

    // ---------------------------------------------------------------- helpers

    private void showProblems(List<String> problems) {
        String text = String.join("\n", problems);

        // Inline message next to the fields, and one dialog so it cannot be missed.
        errorLabel.setText(text);
        errorLabel.setVisible(true);
        errorLabel.setManaged(true);

        Alert alert = new Alert(Alert.AlertType.WARNING);
        alert.setTitle("Check the form");
        alert.setHeaderText("The booking was not saved.");
        alert.setContentText(text);
        alert.initOwner(window());
        alert.showAndWait();
    }

    private void clearErrors() {
        errorLabel.setText("");
        errorLabel.setVisible(false);
        errorLabel.setManaged(false);
    }

    private void showAlert(Alert.AlertType type, String title, String header, String content) {
        Alert alert = new Alert(type);
        alert.setTitle(title);
        alert.setHeaderText(header);
        alert.setContentText(content);
        alert.initOwner(window());
        alert.showAndWait();
    }

    /** The owner for dialogs. Null before the scene exists, which Alert tolerates. */
    private Window window() {
        return table.getScene() == null ? null : table.getScene().getWindow();
    }

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private static Integer parseCount(String value) {
        if (value == null) {
            return null;
        }
        try {
            return Integer.valueOf(value.trim());
        } catch (NumberFormatException ex) {
            return null;
        }
    }
}
```

`src/main/resources/app/bookings.fxml`

```xml
<?xml version="1.0" encoding="UTF-8"?>

<?import javafx.geometry.Insets?>
<?import javafx.scene.control.Button?>
<?import javafx.scene.control.ComboBox?>
<?import javafx.scene.control.DatePicker?>
<?import javafx.scene.control.Label?>
<?import javafx.scene.control.Menu?>
<?import javafx.scene.control.MenuBar?>
<?import javafx.scene.control.MenuItem?>
<?import javafx.scene.control.SeparatorMenuItem?>
<?import javafx.scene.control.TableColumn?>
<?import javafx.scene.control.TableView?>
<?import javafx.scene.control.TextField?>
<?import javafx.scene.layout.BorderPane?>
<?import javafx.scene.layout.ColumnConstraints?>
<?import javafx.scene.layout.GridPane?>
<?import javafx.scene.layout.HBox?>
<?import javafx.scene.layout.Region?>
<?import javafx.scene.layout.VBox?>

<BorderPane xmlns="http://javafx.com/javafx/21"
            xmlns:fx="http://javafx.com/fxml/1"
            fx:controller="app.BookingController"
            prefWidth="1040" prefHeight="640">

    <!-- Top: menu bar and search row. -->
    <top>
        <VBox>
            <MenuBar>
                <Menu text="File">
                    <MenuItem text="Open CSV..." accelerator="Shortcut+O" onAction="#onOpenFile"/>
                    <SeparatorMenuItem/>
                    <MenuItem text="Exit" onAction="#onExit"/>
                </Menu>
                <Menu text="Help">
                    <MenuItem text="About" onAction="#onAbout"/>
                </Menu>
            </MenuBar>

            <HBox alignment="CENTER_LEFT" spacing="10" styleClass="toolbar">
                <padding>
                    <Insets top="10" right="12" bottom="10" left="12"/>
                </padding>
                <Label text="Search"/>
                <TextField fx:id="searchField" promptText="name, hotel or city" prefWidth="260"/>
                <Region HBox.hgrow="ALWAYS"/>
                <Label fx:id="statusLabel" text="No data loaded"/>
            </HBox>
        </VBox>
    </top>

    <!-- Centre: table on the left, form on the right. -->
    <center>
        <HBox spacing="14">
            <padding>
                <Insets top="12" right="12" bottom="12" left="12"/>
            </padding>

            <TableView fx:id="table" HBox.hgrow="ALWAYS">
                <placeholder>
                    <Label text="Open a CSV file to fill the table"/>
                </placeholder>
                <columns>
                    <TableColumn fx:id="guestColumn" text="Guest" prefWidth="150"/>
                    <TableColumn fx:id="hotelColumn" text="Hotel" prefWidth="150"/>
                    <TableColumn fx:id="cityColumn" text="City" prefWidth="110"/>
                    <TableColumn fx:id="starsColumn" text="Stars" prefWidth="60"/>
                    <TableColumn fx:id="startColumn" text="Arrival" prefWidth="105"/>
                    <TableColumn fx:id="endColumn" text="Departure" prefWidth="105"/>
                    <TableColumn fx:id="nightsColumn" text="Nights" prefWidth="70"/>
                    <TableColumn fx:id="guestsColumn" text="Guests" prefWidth="70"/>
                </columns>
            </TableView>

            <VBox minWidth="330" prefWidth="330" spacing="10" styleClass="form">
                <padding>
                    <Insets top="12" right="12" bottom="12" left="12"/>
                </padding>

                <Label text="Booking details" styleClass="form-title"/>

                <GridPane hgap="8" vgap="8">
                    <columnConstraints>
                        <ColumnConstraints minWidth="84" prefWidth="84"/>
                        <ColumnConstraints hgrow="ALWAYS"/>
                    </columnConstraints>

                    <Label text="First name" GridPane.rowIndex="0" GridPane.columnIndex="0"/>
                    <TextField fx:id="firstNameField" maxWidth="Infinity"
                               GridPane.rowIndex="0" GridPane.columnIndex="1"/>

                    <Label text="Last name" GridPane.rowIndex="1" GridPane.columnIndex="0"/>
                    <TextField fx:id="lastNameField" maxWidth="Infinity"
                               GridPane.rowIndex="1" GridPane.columnIndex="1"/>

                    <Label text="Email" GridPane.rowIndex="2" GridPane.columnIndex="0"/>
                    <TextField fx:id="emailField" maxWidth="Infinity"
                               GridPane.rowIndex="2" GridPane.columnIndex="1"/>

                    <Label text="Hotel" GridPane.rowIndex="3" GridPane.columnIndex="0"/>
                    <TextField fx:id="hotelField" maxWidth="Infinity"
                               GridPane.rowIndex="3" GridPane.columnIndex="1"/>

                    <Label text="City" GridPane.rowIndex="4" GridPane.columnIndex="0"/>
                    <TextField fx:id="cityField" maxWidth="Infinity"
                               GridPane.rowIndex="4" GridPane.columnIndex="1"/>

                    <Label text="Stars" GridPane.rowIndex="5" GridPane.columnIndex="0"/>
                    <ComboBox fx:id="starsBox" maxWidth="Infinity"
                              GridPane.rowIndex="5" GridPane.columnIndex="1"/>

                    <Label text="Arrival" GridPane.rowIndex="6" GridPane.columnIndex="0"/>
                    <DatePicker fx:id="startPicker" maxWidth="Infinity"
                                GridPane.rowIndex="6" GridPane.columnIndex="1"/>

                    <Label text="Departure" GridPane.rowIndex="7" GridPane.columnIndex="0"/>
                    <DatePicker fx:id="endPicker" maxWidth="Infinity"
                                GridPane.rowIndex="7" GridPane.columnIndex="1"/>

                    <Label text="Adults" GridPane.rowIndex="8" GridPane.columnIndex="0"/>
                    <TextField fx:id="adultsField" text="1" maxWidth="Infinity"
                               GridPane.rowIndex="8" GridPane.columnIndex="1"/>

                    <Label text="Children" GridPane.rowIndex="9" GridPane.columnIndex="0"/>
                    <TextField fx:id="childrenField" text="0" maxWidth="Infinity"
                               GridPane.rowIndex="9" GridPane.columnIndex="1"/>
                </GridPane>

                <Label fx:id="errorLabel" managed="false" visible="false"
                       wrapText="true" styleClass="error"/>

                <HBox spacing="8">
                    <Button text="New" onAction="#onNew"
                            maxWidth="Infinity" HBox.hgrow="ALWAYS"/>
                    <Button text="Save" onAction="#onSave" styleClass="primary"
                            maxWidth="Infinity" HBox.hgrow="ALWAYS"/>
                    <Button text="Delete" onAction="#onDelete"
                            maxWidth="Infinity" HBox.hgrow="ALWAYS"/>
                </HBox>

                <Region VBox.vgrow="ALWAYS"/>

                <Label text="Rows are kept in memory only." wrapText="true" styleClass="hint"/>
            </VBox>
        </HBox>
    </center>
</BorderPane>
```

`src/main/resources/app/app.css`

```css
/* Every JavaFX property keeps the -fx- prefix. A missing prefix is ignored. */

.root {
    -fx-font-family: "Segoe UI", "DejaVu Sans", sans-serif;
    -fx-font-size: 13px;
    -fx-background-color: #f4f6f9;
}

.toolbar {
    -fx-background-color: #ffffff;
    -fx-border-color: #dde3ea;
    -fx-border-width: 0 0 1 0;
}

.form {
    -fx-background-color: #ffffff;
    -fx-background-radius: 10;
    -fx-border-color: #dde3ea;
    -fx-border-radius: 10;
    -fx-border-width: 1;
}

.form-title {
    -fx-font-size: 15px;
    -fx-font-weight: bold;
    -fx-text-fill: #16223a;
}

.hint {
    -fx-font-size: 11px;
    -fx-text-fill: #77839a;
}

.error {
    -fx-font-size: 12px;
    -fx-text-fill: #b42318;
}

.table-view {
    -fx-background-color: #ffffff;
    -fx-background-radius: 10;
    -fx-border-color: #dde3ea;
    -fx-border-radius: 10;
}

.table-view .column-header-background {
    -fx-background-color: #eef2f7;
}

.table-view .column-header .label {
    -fx-font-weight: bold;
    -fx-text-fill: #3b4a63;
}

/* The row paints the background, the cells paint the text. */
.table-row-cell:filled:selected {
    -fx-background-color: #dbe8ff;
}

.table-row-cell:filled:selected .table-cell {
    -fx-text-fill: #16223a;
}

.table-row-cell:filled:hover {
    -fx-background-color: #f0f5ff;
}

.button {
    -fx-background-color: #e8edf5;
    -fx-background-radius: 6;
    -fx-text-fill: #16223a;
    -fx-padding: 7 14 7 14;
}

.button:hover {
    -fx-background-color: #d9e2ef;
}

.button.primary {
    -fx-background-color: #2563eb;
    -fx-text-fill: #ffffff;
}

.button.primary:hover {
    -fx-background-color: #1d4ed8;
}
```

`src/main/java/app/BookingApp.java`

```java
package app;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;

import java.net.URL;

public class BookingApp extends Application {

    @Override
    public void start(Stage stage) throws Exception {
        URL fxml = BookingApp.class.getResource("/app/bookings.fxml");
        if (fxml == null) {
            throw new IllegalStateException("bookings.fxml is not on the classpath");
        }

        // Loads the XML, builds the controller, injects the ids, calls initialize().
        Parent root = new FXMLLoader(fxml).load();

        Scene scene = new Scene(root, 1040, 640);
        URL css = BookingApp.class.getResource("/app/app.css");
        if (css != null) {
            scene.getStylesheets().add(css.toExternalForm());
        }

        stage.setTitle("Booking desk");
        stage.setMinWidth(900);
        stage.setMinHeight(560);
        stage.setScene(scene);
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
```

`data/bookings-sample.csv`, two clean rows and one broken row for the skip counter:

```text
customer_email,first_name,last_name,hotel_id,hotel_city,hotel_name,hotel_stars,start_date,end_date,adults,children
anna.nagy@example.com,Anna,Nagy,101,Budapest,River Hotel,4,2026-05-04,2026-05-08,2,0
bela.kis@example.com,Bela,Kis,102,Szeged,Sun Court,3,2026-06-01,2026-06-03,1,1
csilla.toth@example.com,Csilla,Toth,101,Budapest,River Hotel,4,not-a-date,2026-07-02,1,0
```

The third row lands in `skipped`, and the status line still reports three bookings because the broken row is not a booking at all. A file where every row fails opens with the warning alert instead of an empty window with no explanation.

### Example 4: testing the loader without a window

The parser takes a `Path` and returns a `Result`, so it runs before any JavaFX class loads. This is the first thing to try when the table stays empty.

```java
package app;

import java.nio.file.Path;

public class LoaderSmokeTest {

    public static void main(String[] args) throws Exception {
        Path file = Path.of("data/bookings-sample.csv");
        BookingFile.Result result = BookingFile.read(file);

        System.out.println("usable rows: " + result.rows().size());
        System.out.println("skipped rows: " + result.skipped());

        for (Booking booking : result.rows()) {
            System.out.printf("%s | %s | %s | %d stars | %d nights%n",
                    booking.guestName(),
                    booking.hotelName(),
                    booking.city(),
                    booking.stars(),
                    booking.nights());
        }
    }
}
```

If this prints the rows, the GUI problem is in the FXML wiring or the table items. If it prints nothing, the file path or the header detection is wrong, and no amount of FXML editing will help. Keep the two failure areas separate.

## Common mistakes

1. The controller field is null on the first click. A private field without `@FXML` is not injected, and the loader does not warn.

2. A `LoadException` at startup that names a field the controller does not have. The `fx:id` in the XML and the field name in the controller differ, or the field has the wrong type.

3. A startup error about the controller constructor. The controller has only a constructor that takes parameters. Remove it and pass data through a setter after `loader.getController()`.

4. The table shows column headers and no rows. Either `setItems` was never called, or the cell value factories were never set, or `PropertyValueFactory` is looking for a getter that a record does not have.

5. Header click does nothing once a `FilteredList` was added. The table needs a `SortedList` between the filter and `setItems`, with `comparatorProperty()` bound.

6. `NullPointerException` on `startPicker.getValue().isAfter(...)`. The picker is empty until the user chooses a date, and an empty picker means a missing value, not today.

7. The alert opens behind the main window. `initOwner(window())` was omitted, or the owner was read before the scene was set.

8. Cancel in the file chooser throws. `showOpenDialog` returns null on cancel and the code calls `toPath()` on it anyway.

9. A CSS file loads but nothing changes. The properties lack the `-fx-` prefix, or the `styleClass` in the XML does not match the selector, or the stylesheet was added to the root instead of the scene.

10. The error label leaves a hole in the form when empty. Only `visible` was toggled; `managed` must go with it.

11. Validation stops at the first problem, and the user resubmits five times. Collect all problems in a list and show them together.

12. Rows vanish after loading a file whose dates look like `2026.05.04.`. `LocalDate.parse` only accepts ISO text, so those rows land in the skipped count and need an explicit `DateTimeFormatter` in the date helper.

13. Every row is skipped after a load. The file starts with a header the detector did not recognise, so the header line was parsed as data and the rest of the columns shifted. Print the first split line and compare it with the header names.

14. The form clears itself while the user is typing. A selection listener was wired to an action that rebuilds the item list, which resets the selection and fires the listener again.

## Exam checklist

1. `mvn javafx:run` opens the window and the console has no stack trace.

2. `fx:controller` names a class that exists, in the right package, with a no-argument constructor.

3. Every `fx:id` in the FXML has a matching `@FXML` field of the same type and name.

4. Every `onAction` names a controller method that exists and returns `void`.

5. The table has items from an `ObservableList<Booking>`, and each column has a cell value factory.

6. Selecting a row fills the form; New clears it; Save writes a new row or replaces the selected one.

7. Delete asks for confirmation and removes the row only on OK.

8. Validation covers empty name, email without `@`, missing hotel or city, unpicked dates, departure not after arrival, and a non-numeric guest count.

9. A failed validation shows every problem once and does not save.

10. Opening a file uses a `FileChooser` with a CSV filter, survives Cancel, and reports a read error in an alert.

11. The header is detected rather than assumed, and a broken row is skipped and counted.

12. The stylesheet is on the scene, loaded through `getResource`, and the form and the table both look styled.

13. The window can be resized without overlapping controls: the table grows, the form keeps its width, the menu stays on top.

14. The parser class `BookingFile` has no JavaFX imports, so it can be run from a plain `main` method.

