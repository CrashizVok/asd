---
id: javafx-basics
lang: JavaFX
title: JavaFX basics
---

# JavaFX basics

## Simplest form

```java
// Data shape: one Application subclass, one Stage, one Scene, one root Node.
// Smallest launchable JavaFX program. Nothing else is required.
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.stage.Stage;

public class HelloApp extends Application {

    @Override
    public void start(Stage stage) {
        stage.setScene(new Scene(new Label("Hello"), 400, 300));
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
```

The class extends `Application`, the toolkit calls `start`, and `start` builds a `Scene` around one root node. `stage.show()` puts the window on screen. Nothing appears before that call, even when the scene is fully built.

## What runs when

The order matters, and most beginner bugs come from putting work in the wrong step.

1. The JVM calls your `main`. You call `launch(args)`.
2. JavaFX creates one instance of your class with the no-argument constructor. Fields initialised at declaration exist from here.
3. `init()` runs on the JavaFX-Launcher thread, not on the UI thread. It is the place for reading a file or opening a database. You may not create controls here.
4. `start(Stage)` runs on the FX Application Thread. The stage is created for you and is empty. Build the scene, attach it, call `show()`.
5. The toolkit runs an event loop. Mouse clicks, key presses, property changes and layout passes are handled one at a time on the FX thread.
6. `stop()` runs when the last window closes or when someone calls `Platform.exit()`.

`launch` can be called once per JVM. A second call throws `IllegalStateException`. If you need another window later, create a new `Stage` and call `show()` on it, do not launch again.

## The four objects

### Application

`Application` is the entry point contract. You override `start`. `init` and `stop` are optional. The class also gives you `getParameters()` for command line arguments and `getHostServices()` for opening a browser, which the exam almost never needs.

Keep the class small. Put the layout in methods and the data handling in plain classes, so a CSV parser can be tested from `main` without a display.

### Stage

A `Stage` is an operating system window. The one passed to `start` is the primary stage. It owns the title bar, the size, the close button and the modality.

```java
stage.setTitle("Bookings");
stage.setWidth(900);
stage.setHeight(600);
stage.setMinWidth(640);          // the user cannot drag it narrower
stage.setResizable(true);
stage.show();
```

The stage has no size of its own until it has a scene. `new Scene(root, 900, 600)` sets the content size; the window then measures itself around that plus decorations. If you change the root after showing, call `stage.sizeToScene()` when you want the window to shrink or grow to the new preferred size.

A second window is a second `Stage`. Give it an owner and a modality when it should block the main window:

```java
Stage dialog = new Stage();
dialog.initOwner(primaryStage);
dialog.initModality(Modality.WINDOW_MODAL);
dialog.setScene(new Scene(new Label("Details"), 320, 200));
dialog.show();
```

`WINDOW_MODAL` blocks the owner only. `APPLICATION_MODAL` blocks every window of the application. Modal windows are useful for an edit form, but for one message use `Alert` instead of building a stage by hand.

### Scene

The `Scene` is the content of one window: a root node, a width, a height, a fill colour and the list of stylesheets. One stage holds one scene at a time; `stage.setScene(other)` swaps it.

```java
Scene scene = new Scene(root, 900, 600);
scene.getStylesheets().add(getClass().getResource("/app.css").toExternalForm());
stage.setScene(scene);
```

The scene listens for keyboard and mouse events that no control consumed. That is why `scene.setOnKeyPressed` works for a global shortcut such as Delete on a selected row.

You can read the current window back with `scene.getWindow()`. It is `null` until the scene is attached to a showing stage, so do not rely on it inside a constructor.

### The root node and the scene graph

Everything visible is a `Node`: controls, shapes, images, layout panes. Nodes form a tree. The root is the only child of the scene. A node can have one parent only; adding it to a second parent throws `IllegalArgumentException`, so remove it from the old parent first.

`Parent` subclasses (`VBox`, `BorderPane`, `GridPane` and the rest) hold children. `Control` subclasses (`Button`, `ListView`, `TableView`) are leaves you configure, not containers you fill by hand.

The scene graph is also the styling target. CSS selectors match node types, style classes and ids, and the same class can match a control and its inner skin parts.

## Controls you will use

A control is configured with setters and read with getters. The value properties are observable, which is what makes listeners and binding work.

- `Label` shows text. `setWrapText(true)` plus a width limit makes long text wrap instead of clipping.
- `Button` fires `setOnAction`. `setDefaultButton(true)` makes Enter press it.
- `TextField` holds one line. `getText()` reads it, `setPromptText` shows grey hint text, `textProperty()` is observable.
- `TextArea` holds many lines, scrolls by default, and needs `setWrapText(true)` to wrap long lines instead.
- `CheckBox` is `isSelected()`. Independent boxes need no group.
- `RadioButton` needs a `ToggleGroup`, otherwise several can be selected at once. Set one as selected explicitly so the screen never starts with no mode.
- `ComboBox<T>` holds items and a value. `getValue()` can be `null` when nothing is chosen, and the exam data often has no default.
- `DatePicker` returns `LocalDate`, `null` when empty.
- `Spinner<Integer>` is normally built with a `SpinnerValueFactory`, for example `new SpinnerValueFactory.IntegerSpinnerValueFactory(1, 10, 2)`. `setEditable(true)` lets the user type, and typed text is only committed on Enter or focus loss.
- `ListView<T>` shows a flat list and calls a cell factory for display. `getSelectionModel().getSelectedItem()` is enough for most tasks.
- `TableView<S>` shows rows of objects in typed columns. It needs a cell value factory per column.
- `MenuBar`, `Menu`, `MenuItem` build the menu. A `MenuItem` is not a node in the layout; it lives inside a menu.

## Events

An event handler is a `FunctionalInterface` you pass as a lambda. Action events are the common case:

```java
Button save = new Button("Save");
save.setOnAction(event -> saveBooking());
```

Use `setOnAction` when one handler per control is enough; it replaces any handler set earlier. Use `addEventHandler` when several independent listeners must run, for example a logger and a validator:

```java
save.addEventHandler(ActionEvent.ACTION, event -> log("clicked"));
save.addEventHandler(ActionEvent.ACTION, event -> validate());
```

Mouse and key events bubble from the target up through the parents. A handler can stop that with `event.consume()`, which is why a button inside a clickable row does not also trigger the row action. Do not consume blindly: a consumed key event never reaches the scene shortcut.

For rows, use the selection model rather than cell clicks, because cells are recycled while scrolling:

```java
list.getSelectionModel().selectedItemProperty().addListener(
    (observable, oldValue, selected) -> showDetails(selected));
```

Property listeners fire on the FX thread when the property changes, including changes made by binding. Keep them short. A listener that opens a blocking dialog inside a loop freezes the window.

Long work belongs on a background thread, and the result must come back through `Platform.runLater`:

```java
new Thread(() -> {
    try {
        List<Booking> loaded = readBookings(path);        // no UI calls here
        Platform.runLater(() -> list.getItems().setAll(loaded));   // FX thread
    } catch (IOException error) {
        Platform.runLater(() -> status.setText("Read failed: " + error.getMessage()));
    }
}).start();
```

Touching a control from any other thread throws `IllegalStateException: Not on FX application thread`. `Task` and `Service` wrap this pattern with progress and success callbacks, but the plain thread plus `Platform.runLater` pair is enough for the exam.

## Scene lifecycle and window events

The scene is created, attached, shown, possibly replaced, and eventually detached. You can hook each step.

```java
stage.setOnShowing(event -> status.setText("Opening"));
stage.setOnShown(event -> status.setText("Ready"));
stage.setOnCloseRequest(event -> {
    if (hasUnsavedChanges()) {
        event.consume();          // stop the close, ask first
        confirmExit();
    }
});
```

`setOnCloseRequest` fires after the user clicks the window close button, before the window hides. Calling `consume()` cancels the close. This is the place for a save prompt, not `stop`, because `stop` runs too late to ask anything.

Replacing the scene keeps the same stage and the same window position:

```java
stage.setScene(new Scene(buildDetailPane(), 900, 600));
```

Rebuilding the root inside one scene is usually better than swapping scenes, because menu handlers and shared state stay attached. Swapping scenes is fine for a login screen that leads to a main screen.

`Platform.exit()` ends the toolkit and triggers `stop`. `Platform.setImplicitExit(false)` keeps the JVM alive when the last window closes, which is what a tray application wants; then you must call `Platform.exit()` yourself or the process never ends. Leave the default in exam code.

## CSS

JavaFX CSS uses the same selector ideas as web CSS with `-fx-` property names. It is not browser CSS: `color`, `background` and `margin` do not exist.

```java
scene.getStylesheets().add(getClass().getResource("/app.css").toExternalForm());
label.getStyleClass().add("total");
label.setId("grand-total");
```

```css
.root {
    -fx-font-size: 13px;
    -fx-background-color: #f3f5f8;
}

.total {
    -fx-font-weight: bold;
    -fx-text-fill: #1f2937;
}

#grand-total {
    -fx-font-size: 18px;
}

.button:hover {
    -fx-background-color: #dbeafe;
}
```

Three selector kinds are enough for the exam: a type selector (`Button`), a style class (`.total`), and an id (`#grand-total`). Every control also carries its lowercase type as a style class, which is why the theme can target `.button` and `.list-cell`. Pseudo classes add state: `:hover`, `:focused`, `:selected`, `:disabled`, `:empty`.

Inline style wins over the stylesheet:

```java
label.setStyle("-fx-text-fill: #b91c1c;");
```

Two path rules cause most CSS failures. `getClass().getResource("app.css")` looks in the package of the class. `getClass().getResource("/app.css")` looks at the classpath root, which is where `src/main/resources/app.css` lands. A wrong path returns `null`, and `null.toExternalForm()` throws `NullPointerException` before the window appears. Check the result, or keep a fallback to a file path while developing.

## Examples

### Example 1: a form that validates and reports

```java
import javafx.application.Application;
import javafx.geometry.Insets;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.CheckBox;
import javafx.scene.control.ComboBox;
import javafx.scene.control.DatePicker;
import javafx.scene.control.Label;
import javafx.scene.control.Spinner;
import javafx.scene.control.SpinnerValueFactory;
import javafx.scene.control.TextField;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

import java.time.LocalDate;

public class BookingFormApp extends Application {

    @Override
    public void start(Stage stage) {
        TextField email = new TextField();
        email.setPromptText("customer_email");

        DatePicker start = new DatePicker(LocalDate.now());
        DatePicker end = new DatePicker(LocalDate.now().plusDays(3));

        Spinner<Integer> adults = new Spinner<>(
                new SpinnerValueFactory.IntegerSpinnerValueFactory(1, 10, 2));
        adults.setEditable(true);

        ComboBox<String> city = new ComboBox<>();
        city.getItems().addAll("Budapest", "Debrecen", "Szeged");
        city.setPromptText("Choose a city");

        CheckBox extraBed = new CheckBox("Extra bed");

        GridPane grid = new GridPane();
        grid.setHgap(10);
        grid.setVgap(8);
        grid.setPadding(new Insets(12));

        // Column 0 is the caption, column 1 is the input.
        grid.addRow(0, new Label("Email:"), email);
        grid.addRow(1, new Label("Start:"), start);
        grid.addRow(2, new Label("End:"), end);
        grid.addRow(3, new Label("Adults:"), adults);
        grid.addRow(4, new Label("City:"), city);
        grid.add(extraBed, 1, 5);

        Label message = new Label();
        message.setWrapText(true);

        Button submit = new Button("Submit");
        submit.setDefaultButton(true);

        // The button reads every control at click time.
        // Reading at construction time would capture defaults only.
        submit.setOnAction(event -> {
            if (email.getText().isBlank()) {
                message.setText("Email is required.");
                return;
            }
            if (city.getValue() == null) {
                message.setText("Pick a city.");
                return;
            }
            if (end.getValue().isBefore(start.getValue())) {
                message.setText("The end date must be after the start date.");
                return;
            }
            message.setText("Saved " + email.getText().trim()
                    + ", " + city.getValue()
                    + ", " + adults.getValue() + " adults"
                    + (extraBed.isSelected() ? ", extra bed" : ""));
        });

        VBox root = new VBox(10, grid, submit, message);
        root.setPadding(new Insets(0, 12, 12, 12));

        stage.setTitle("New booking");
        stage.setScene(new Scene(root, 420, 340));
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
```

The validation stays in the handler on purpose. A form that shows an error before the user typed anything is hostile, and an exam screenshot of an untouched window should be clean.

### Example 2: ListView wires to TableView

```java
ObservableList<Booking> bookings = FXCollections.observableArrayList(
        // Booking(customerEmail, firstName, lastName, hotelId, city, hotelName,
        //         stars, startDate, endDate, adults, children)
        new Booking("anna@example.com", "Anna", "Kovacs", 101, "Budapest",
                "Hotel Alfa", 4,
                LocalDate.of(2025, 3, 1), LocalDate.of(2025, 3, 4), 2, 0),
        new Booking("bela@example.com", "Bela", "Nagy", 102, "Szeged",
                "Hotel Beta", 3,
                LocalDate.of(2025, 4, 10), LocalDate.of(2025, 4, 12), 1, 1),
        new Booking("cili@example.com", "Cili", "Toth", 101, "Budapest",
                "Hotel Alfa", 4,
                LocalDate.of(2025, 3, 8), LocalDate.of(2025, 3, 9), 2, 0)
);

ListView<String> emails = new ListView<>();
emails.getItems().setAll(
        bookings.stream().map(Booking::customerEmail).distinct().sorted().toList());

TableView<Booking> table = new TableView<>();
table.setItems(bookings);
table.setPlaceholder(new Label("No bookings for this guest"));

TableColumn<Booking, String> cityColumn = new TableColumn<>("City");
cityColumn.setCellValueFactory(cell ->
        new ReadOnlyStringWrapper(cell.getValue().city()));

TableColumn<Booking, Integer> nightsColumn = new TableColumn<>("Nights");
nightsColumn.setCellValueFactory(cell ->
        new ReadOnlyIntegerWrapper(cell.getValue().nights()).asObject());

TableColumn<Booking, LocalDate> startColumn = new TableColumn<>("Start");
startColumn.setCellValueFactory(cell ->
        new ReadOnlyObjectWrapper<>(cell.getValue().startDate()));

table.getColumns().addAll(cityColumn, nightsColumn, startColumn);

// Filter the table instead of rebuilding it.
emails.getSelectionModel().selectedItemProperty().addListener(
        (observable, oldValue, email) -> {
            if (email == null) {
                table.getItems().setAll(bookings);
                return;
            }
            table.getItems().setAll(bookings.stream()
                    .filter(b -> b.customerEmail().equals(email))
                    .toList());
        });
```

`Booking` is a record, so `PropertyValueFactory("city")` finds no `getCity()` and the column stays empty. The explicit `ReadOnly...Wrapper` is the reliable choice for records. `asObject()` is needed when the column type is `Integer`; `ReadOnlyIntegerWrapper` alone implements `ObservableValue<Number>`, which does not match a column declared as `TableColumn<Booking, Integer>`.

### Example 3: swap the whole screen in one stage

```java
public class LoginApp extends Application {

    private Stage stage;
    private Scene loginScene;
    private Scene mainScene;

    @Override
    public void start(Stage stage) {
        this.stage = stage;

        TextField user = new TextField();
        Button enter = new Button("Enter");
        VBox loginRoot = new VBox(8, new Label("User:"), user, enter);

        loginScene = new Scene(loginRoot, 360, 220);

        Label welcome = new Label();
        Button back = new Button("Back to login");
        back.setOnAction(event -> stage.setScene(loginScene));
        VBox mainRoot = new VBox(8, welcome, back);
        mainScene = new Scene(mainRoot, 720, 480);

        enter.setOnAction(event -> {
            // A real app would check a password here.
            welcome.setText("Signed in as " + user.getText().trim());
            stage.setScene(mainScene);
        });

        stage.setTitle("Sign in");
        stage.setScene(loginScene);
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
```

Both scenes are built once and reused. Rebuilding the main screen on every return would lose its state, and calling `launch` again would throw. Keep the stage field so menu items and buttons that live in either scene can reach it.

### Example 4: a complete commented application

This is the shape of the exam task. Read it from top to bottom once; the comments point at the lifecycle steps that matter.

```java
import javafx.application.Application;
import javafx.application.Platform;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.ListView;
import javafx.scene.control.Menu;
import javafx.scene.control.MenuBar;
import javafx.scene.control.MenuItem;
import javafx.scene.control.RadioButton;
import javafx.scene.control.SeparatorMenuItem;
import javafx.scene.control.ToggleGroup;
import javafx.scene.input.KeyCombination;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Priority;
import javafx.scene.layout.VBox;
import javafx.stage.FileChooser;
import javafx.stage.Stage;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/**
 * BookingBrowser: one stage, one scene, a menu, a file chooser and two lists.
 *
 * The left list groups the loaded rows by year or by hotel. Selecting a group
 * fills the right list. Everything lives in one class so the flow is visible,
 * which is what an exam usually needs.
 */
public class BookingBrowser extends Application {

    /** One input row. A record keeps the parsing code short. */
    public record Booking(
            String customerEmail,
            String firstName,
            String lastName,
            int hotelId,
            String city,
            String hotelName,
            int stars,
            LocalDate startDate,
            LocalDate endDate,
            int adults,
            int children) {
    }

    // Fields declared here exist before start runs, because the toolkit
    // creates the Application instance through the no-argument constructor.
    private final ObservableList<Booking> bookings = FXCollections.observableArrayList();
    private final ListView<String> groupList = new ListView<>();
    private final ListView<String> detailList = new ListView<>();
    private final RadioButton byYear = new RadioButton("Years");
    private final RadioButton byHotel = new RadioButton("Hotels");
    private final Label status = new Label("Open a CSV file.");
    private Stage stage;

    @Override
    public void start(Stage primaryStage) {
        this.stage = primaryStage;

        // A radio without a group can be selected together with the others.
        ToggleGroup mode = new ToggleGroup();
        byYear.setToggleGroup(mode);
        byHotel.setToggleGroup(mode);
        byYear.setSelected(true);

        // Changing the mode only rebuilds the left list. The right list is
        // cleared inside refreshGroups, so no stale rows survive the switch.
        mode.selectedToggleProperty().addListener((observable, oldToggle, newToggle) -> {
            if (newToggle == null) {
                mode.selectToggle(oldToggle);   // keep one mode always selected
                return;
            }
            refreshGroups();
        });

        // Selection drives the detail list. The listener receives null when
        // the list is cleared, which happens on every file load.
        groupList.getSelectionModel().selectedItemProperty().addListener(
                (observable, oldValue, group) -> showDetails(group));

        BorderPane root = new BorderPane();
        root.setTop(new VBox(buildMenuBar(), buildToolbar()));
        root.setCenter(buildCenter());
        root.setBottom(statusBar());

        Scene scene = new Scene(root, 900, 600);
        addStylesheet(scene);

        // A close request is the last chance to ask the user. stop() is too late.
        primaryStage.setOnCloseRequest(event -> status.setText("Closing"));

        primaryStage.setTitle("BookingBrowser");
        primaryStage.setMinWidth(720);
        primaryStage.setMinHeight(420);
        primaryStage.setScene(scene);
        primaryStage.show();          // before this line nothing is visible
    }

    private MenuBar buildMenuBar() {
        MenuItem open = new MenuItem("Open...");
        open.setAccelerator(KeyCombination.keyCombination("Shortcut+O"));
        open.setOnAction(event -> openFile());

        MenuItem exit = new MenuItem("Exit");
        exit.setOnAction(event -> Platform.exit());

        Menu file = new Menu("File");
        file.getItems().addAll(open, new SeparatorMenuItem(), exit);

        MenuItem about = new MenuItem("About");
        about.setOnAction(event -> showInfo("BookingBrowser",
                "Rows: " + bookings.size()));

        Menu help = new Menu("Help");
        help.getItems().add(about);

        return new MenuBar(file, help);
    }

    private HBox buildToolbar() {
        Button reload = new Button("Rebuild lists");
        reload.setOnAction(event -> refreshGroups());

        HBox toolbar = new HBox(12, new Label("Group by:"), byYear, byHotel, reload);
        toolbar.setAlignment(Pos.CENTER_LEFT);
        toolbar.setPadding(new Insets(8, 12, 8, 12));
        toolbar.getStyleClass().add("toolbar");
        return toolbar;
    }

    private HBox buildCenter() {
        // Fixed width on the left list, free height.
        groupList.setPrefWidth(220);
        groupList.setMaxWidth(220);
        groupList.setMinWidth(220);
        groupList.setMaxHeight(Double.MAX_VALUE);
        groupList.setPlaceholder(new Label("No data loaded"));

        // The right list takes the remaining width and the full height.
        // A control's computed maximum is its preferred size, so lift it.
        detailList.setPrefWidth(480);
        detailList.setMaxWidth(Double.MAX_VALUE);
        detailList.setMaxHeight(Double.MAX_VALUE);
        detailList.setPlaceholder(new Label("Select a group"));
        HBox.setHgrow(detailList, Priority.ALWAYS);

        HBox center = new HBox(12, groupList, detailList);
        center.setPadding(new Insets(12));
        center.setFillHeight(true);   // children take the full available height
        return center;
    }

    private HBox statusBar() {
        HBox bar = new HBox(status);
        bar.setPadding(new Insets(6, 12, 6, 12));
        bar.setAlignment(Pos.CENTER_LEFT);
        bar.getStyleClass().add("status-bar");
        return bar;
    }

    private void openFile() {
        FileChooser chooser = new FileChooser();
        chooser.setTitle("Open bookings CSV");
        chooser.getExtensionFilters().add(
                new FileChooser.ExtensionFilter("CSV files", "*.csv"));

        // The dialog returns null when the user cancels. Cancel is not an error.
        File file = chooser.showOpenDialog(stage);
        if (file == null) {
            return;
        }

        try {
            bookings.setAll(readBookings(file));
            refreshGroups();
            stage.setTitle("BookingBrowser - " + file.getName());
            status.setText(bookings.size() + " rows loaded.");
        } catch (Exception error) {
            // Show the reason, not just the class name of the exception.
            showError("Could not read the file", String.valueOf(error.getMessage()));
        }
    }

    private void refreshGroups() {
        groupList.getItems().clear();
        detailList.getItems().clear();

        if (bookings.isEmpty()) {
            status.setText("No data loaded.");
            return;
        }

        if (byYear.isSelected()) {
            groupList.getItems().setAll(bookings.stream()
                    .map(b -> String.valueOf(b.startDate().getYear()))
                    .distinct()
                    .sorted(Comparator.naturalOrder())
                    .toList());
        } else {
            groupList.getItems().setAll(bookings.stream()
                    .map(Booking::hotelName)
                    .filter(name -> name != null && !name.isBlank())
                    .distinct()
                    .sorted(Comparator.naturalOrder())
                    .toList());
        }
        status.setText(groupList.getItems().size() + " groups.");
    }

    private void showDetails(String group) {
        detailList.getItems().clear();
        if (group == null) {
            return;
        }

        List<String> lines;
        if (byYear.isSelected()) {
            int year = Integer.parseInt(group);
            lines = bookings.stream()
                    .filter(b -> b.startDate().getYear() == year)
                    .sorted(Comparator.comparing(Booking::startDate))
                    .map(b -> b.hotelName() + " (" + b.city() + "), "
                            + b.stars() + " stars, " + b.startDate()
                            + " - " + b.endDate())
                    .toList();
        } else {
            lines = bookings.stream()
                    .filter(b -> b.hotelName().equals(group))
                    .sorted(Comparator.comparing(Booking::startDate))
                    .map(b -> b.lastName() + " " + b.firstName() + ", "
                            + b.startDate() + " - " + b.endDate()
                            + ", " + b.adults() + " adults, "
                            + b.children() + " children")
                    .toList();
        }
        detailList.getItems().setAll(lines);
        status.setText(lines.size() + " rows in " + group + ".");
    }

    private void showInfo(String header, String content) {
        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setTitle("Information");
        alert.setHeaderText(header);
        alert.setContentText(content);
        alert.showAndWait();          // blocks until the user closes it
    }

    private void showError(String header, String content) {
        Alert alert = new Alert(Alert.AlertType.ERROR);
        alert.setTitle("Error");
        alert.setHeaderText(header);
        alert.setContentText(content);
        alert.showAndWait();
    }

    private void addStylesheet(Scene scene) {
        // getResource returns null for a wrong path, and toExternalForm on
        // null throws. Guard it so a missing file does not kill the window.
        var resource = getClass().getResource("/app.css");
        if (resource != null) {
            scene.getStylesheets().add(resource.toExternalForm());
        }
    }

    /**
     * Plain parser, no JavaFX inside, so it can be tested from main.
     * A header line is detected by the presence of customer_email.
     */
    public static List<Booking> readBookings(File file) throws Exception {
        List<String> lines = Files.readAllLines(file.toPath(), StandardCharsets.UTF_8);
        List<Booking> result = new ArrayList<>();
        if (lines.size() < 2) {
            return result;
        }

        // Excel writes a byte order mark that breaks the first header name.
        if (lines.get(0).startsWith("\uFEFF")) {
            lines.set(0, lines.get(0).substring(1));
        }

        List<String> header = List.of(lines.get(0).split(","));
        List<String> names = new ArrayList<>();
        for (String cell : header) {
            names.add(cell.trim());
        }

        for (int i = 1; i < lines.size(); i++) {
            String line = lines.get(i);
            if (line.isBlank()) {
                continue;
            }
            String[] cells = line.split(",", -1);
            try {
                result.add(new Booking(
                        cell(names, cells, "customer_email"),
                        cell(names, cells, "first_name"),
                        cell(names, cells, "last_name"),
                        number(cell(names, cells, "hotel_id")),
                        cell(names, cells, "hotel_city"),
                        cell(names, cells, "hotel_name"),
                        number(cell(names, cells, "hotel_stars")),
                        LocalDate.parse(cell(names, cells, "start_date")),
                        LocalDate.parse(cell(names, cells, "end_date")),
                        number(cell(names, cells, "adults")),
                        number(cell(names, cells, "children"))));
            } catch (RuntimeException skipped) {
                // One bad row must not hide the rest of the file.
                System.err.println("Skipping line " + (i + 1) + ": " + skipped);
            }
        }
        return result;
    }

    private static String cell(List<String> names, String[] cells, String name) {
        int index = names.indexOf(name);
        if (index < 0 || index >= cells.length) {
            return "";
        }
        return cells[index].trim();
    }

    private static int number(String value) {
        if (value == null || value.isBlank()) {
            return 0;
        }
        return Integer.parseInt(value);
    }

    public static void main(String[] args) {
        launch(args);
    }
}
```

The parser splits on commas, so a quoted comma breaks it. The cheatsheet version with a quote-aware loop is worth copying into an exam where descriptions may contain commas. Everything else here is the minimum reliable skeleton: load, group, select, show, report errors.

## Common mistakes

- Building the scene but forgetting `stage.show()`. The program runs and no window appears.
- Calling `launch` from inside `start`, or calling it twice. It is an entry point, not a way to open windows.
- Creating controls in `init()`. `init` runs off the FX thread, so constructing a `Control` there can throw or corrupt the toolkit.
- Reading `getText()` when the button is created instead of inside the handler. The capture happens before the user types.
- Forgetting `setToggleGroup` on radio buttons, or leaving all of them unselected at startup.
- Adding a node to two parents. The exception names the node and one parent, and the fix is to remove it from the old one.
- `getResource("app.css")` with the file in `src/main/resources`. The path needs a leading slash there, and a `null` result throws at `toExternalForm()`.
- Updating a control from a background thread. Wrap the change in `Platform.runLater`.
- Leaving `FileChooser` cancel unhandled, which turns Cancel into a `NullPointerException`.
- Using `setOnAction` where you overwrite the previous handler. A second `setOnAction` silently replaces the first, so use `addEventHandler` when two actions must both run.

## Exam checklist

1. The class extends `Application`, overrides `start(Stage)`, and `main` calls `launch(args)`.
2. The window gets a title, a scene, and a `show()` call.
3. Every control the task names exists and is visible without resizing the window.
4. Radio buttons share one `ToggleGroup` and one is selected before `show()`.
5. Menu items have handlers, and Exit calls `Platform.exit()`.
6. `FileChooser` checks for `null` before using the file.
7. Every file read is inside a `try`, and the error path shows an `Alert` with a readable message.
8. Lists are cleared before they are refilled, so a screenshot after two clicks is still correct.
9. A second click on the same row still refreshes the right side, or the task explicitly says otherwise.
10. The CSS file loads, or its absence is guarded.
11. No UI call runs off the FX thread.
12. The parser method takes a `File` or `Path` and returns data, so it can be tested without a window.
