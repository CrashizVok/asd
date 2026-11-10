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
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * BookingsGui is a complete JavaFX template for the exam task.
 *
 * It shows a menu bar, two lists, and a Years / Hotels switch.
 * Open a CSV with File / Open. The left list shows either the years or the
 * hotel names. Selecting an item fills the right list.
 *
 * Run with Maven:
 *   mvn javafx:run
 *
 * Or add the JavaFX SDK to the project in IntelliJ and run this class.
 */
public class BookingsGui extends Application {

    /** The fields the GUI needs. The CSV parser fills them from the header. */
    public record Booking(
            String customerEmail,
            String firstName,
            String lastName,
            int hotelId,
            String hotelCity,
            String hotelName,
            String hotelDescription,
            int hotelStars,
            LocalDate startDate,
            LocalDate endDate,
            int adults,
            int children,
            int boylovers
    ) {
        public long nights() {
            return ChronoUnit.DAYS.between(startDate, endDate);
        }

        public String guestName() {
            return (firstName + " " + lastName).trim();
        }
    }

    private static final List<String> DEFAULT_HEADER = List.of(
            "customer_email", "first_name", "last_name", "phone", "birthday",
            "customer_image", "hotel_id", "hotel_city", "hotel_name",
            "hotel_description", "hotel_stars", "hotel_owner_email",
            "hotel_image", "start_date", "end_date", "adults", "children",
            "boylovers"
    );

    private final ObservableList<Booking> bookings = FXCollections.observableArrayList();
    private final ListView<String> leftList = new ListView<>();
    private final ListView<String> rightList = new ListView<>();
    private final RadioButton yearsButton = new RadioButton("Évek");
    private final RadioButton hotelsButton = new RadioButton("Hotelek");
    private final ToggleGroup modeGroup = new ToggleGroup();
    private Stage stage;

    @Override
    public void start(Stage primaryStage) {
        this.stage = primaryStage;

        yearsButton.setToggleGroup(modeGroup);
        hotelsButton.setToggleGroup(modeGroup);
        yearsButton.setSelected(true);

        BorderPane root = new BorderPane();
        root.setTop(new VBox(buildMenuBar(), buildToolbar()));
        root.setCenter(buildCenter());

        // Rebuild the left list when the user changes the mode.
        modeGroup.selectedToggleProperty().addListener((observable, oldValue, newValue) -> {
            if (newValue == null) {
                modeGroup.selectToggle(oldValue);
                return;
            }
            refreshLeftList();
        });

        wireSelection();

        Scene scene = new Scene(root, 900, 600);
        loadStylesheet(scene);

        primaryStage.setTitle("BookingsGUI");
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    private MenuBar buildMenuBar() {
        MenuBar menuBar = new MenuBar();

        Menu fileMenu = new Menu("Fájl");
        MenuItem openItem = new MenuItem("Megnyitás...");
        openItem.setAccelerator(KeyCombination.keyCombination("Shortcut+O"));
        openItem.setOnAction(event -> openFile());

        MenuItem exitItem = new MenuItem("Kilépés");
        exitItem.setOnAction(event -> Platform.exit());

        fileMenu.getItems().addAll(openItem, new SeparatorMenuItem(), exitItem);

        Menu helpMenu = new Menu("Súgó");
        MenuItem aboutItem = new MenuItem("Névjegy");
        aboutItem.setOnAction(event -> showAbout());
        helpMenu.getItems().add(aboutItem);

        menuBar.getMenus().addAll(fileMenu, helpMenu);
        return menuBar;
    }

    private HBox buildToolbar() {
        HBox toolbar = new HBox(12, new Label("Nézet:"), yearsButton, hotelsButton);
        toolbar.setAlignment(Pos.CENTER_LEFT);
        toolbar.setPadding(new Insets(10, 12, 10, 12));
        toolbar.getStyleClass().add("tool-bar");
        return toolbar;
    }

    private HBox buildCenter() {
        leftList.setPrefWidth(200);
        leftList.setMinWidth(200);
        leftList.setMaxWidth(200);
        leftList.setPrefHeight(350);
        leftList.setPlaceholder(new Label("Nincs megnyitott adat"));

        rightList.setPrefWidth(400);
        rightList.setMinWidth(400);
        rightList.setPrefHeight(350);
        rightList.setPlaceholder(new Label("Válassz egy elemet a bal oldalon"));

        // The right list takes the remaining width and both lists fill the height.
        HBox.setHgrow(rightList, Priority.ALWAYS);
        leftList.setMaxHeight(Double.MAX_VALUE);
        rightList.setMaxHeight(Double.MAX_VALUE);

        HBox center = new HBox(12, leftList, rightList);
        center.setPadding(new Insets(12));
        center.setFillHeight(true);
        return center;
    }

    private void wireSelection() {
        leftList.getSelectionModel().selectedItemProperty().addListener(
                (observable, oldValue, selected) -> {
                    rightList.getItems().clear();
                    if (selected == null) {
                        return;
                    }

                    if (yearsButton.isSelected()) {
                        int year;
                        try {
                            year = Integer.parseInt(selected);
                        } catch (NumberFormatException ex) {
                            return;
                        }
                        bookings.stream()
                                .filter(b -> b.startDate().getYear() == year)
                                .sorted(Comparator.comparing(Booking::hotelName))
                                .forEach(b -> rightList.getItems().add(String.format(
                                        "%s (%s), %d csillag, %s - %s",
                                        b.hotelName(), b.hotelCity(), b.hotelStars(),
                                        b.startDate(), b.endDate()
                                )));
                    } else {
                        bookings.stream()
                                .filter(b -> b.hotelName().equals(selected))
                                .sorted(Comparator.comparing(Booking::startDate))
                                .forEach(b -> rightList.getItems().add(String.format(
                                        "%s, %s - %s (%d éj), %d felnőtt, %d gyerek",
                                        b.guestName(), b.startDate(), b.endDate(),
                                        b.nights(), b.adults(), b.children()
                                )));
                    }
                });
    }

    private void refreshLeftList() {
        leftList.getItems().clear();
        rightList.getItems().clear();
        if (bookings.isEmpty()) {
            return;
        }

        if (yearsButton.isSelected()) {
            List<String> years = bookings.stream()
                    .map(b -> String.valueOf(b.startDate().getYear()))
                    .distinct()
                    .sorted()
                    .toList();
            leftList.getItems().setAll(years);
        } else {
            List<String> hotels = bookings.stream()
                    .map(Booking::hotelName)
                    .filter(name -> name != null && !name.isBlank())
                    .distinct()
                    .sorted()
                    .toList();
            leftList.getItems().setAll(hotels);
        }
    }

    private void openFile() {
        FileChooser chooser = new FileChooser();
        chooser.setTitle("CSV megnyitása");
        chooser.getExtensionFilters().add(
                new FileChooser.ExtensionFilter("CSV fájlok", "*.csv")
        );

        File file = chooser.showOpenDialog(stage);
        if (file == null) {
            return;
        }

        try {
            bookings.setAll(readBookings(file.toPath()));
            refreshLeftList();
            stage.setTitle("BookingsGUI - " + file.getName());
        } catch (IOException ex) {
            showError("Nem sikerült beolvasni a fájlt.", ex.getMessage());
        }
    }

    private void showAbout() {
        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setTitle("Névjegy");
        alert.setHeaderText("BookingsGUI");
        alert.setContentText("Foglalások böngészője\nKészült a vizsgafeladat mintájára.");
        alert.showAndWait();
    }

    private void showError(String header, String content) {
        Alert alert = new Alert(Alert.AlertType.ERROR);
        alert.setTitle("Hiba");
        alert.setHeaderText(header);
        alert.setContentText(content == null ? "" : content);
        alert.showAndWait();
    }

    private void loadStylesheet(Scene scene) {
        var resource = getClass().getResource("/app.css");
        if (resource != null) {
            scene.getStylesheets().add(resource.toExternalForm());
            return;
        }
        Path local = Path.of("app.css");
        if (Files.exists(local)) {
            scene.getStylesheets().add(local.toUri().toString());
        }
    }

    /** Read a CSV file. Bad rows are skipped. */
    public static List<Booking> readBookings(Path path) throws IOException {
        List<String> lines = Files.readAllLines(path, StandardCharsets.UTF_8);
        if (lines.isEmpty()) {
            return List.of();
        }

        if (lines.get(0).startsWith("\uFEFF")) {
            lines.set(0, lines.get(0).substring(1));
        }

        List<String> possibleHeader = parseCsvLine(lines.get(0));
        boolean hasHeader = possibleHeader.contains("customer_email");
        List<String> columnNames = hasHeader ? possibleHeader : DEFAULT_HEADER;

        Map<String, Integer> index = new HashMap<>();
        for (int i = 0; i < columnNames.size(); i++) {
            index.put(columnNames.get(i).trim(), i);
        }

        List<Booking> result = new ArrayList<>();
        int firstDataLine = hasHeader ? 1 : 0;
        for (int i = firstDataLine; i < lines.size(); i++) {
            if (lines.get(i).isBlank()) {
                continue;
            }
            try {
                List<String> row = parseCsvLine(lines.get(i));
                result.add(new Booking(
                        get(row, index, "customer_email"),
                        get(row, index, "first_name"),
                        get(row, index, "last_name"),
                        intValue(get(row, index, "hotel_id"), 0),
                        get(row, index, "hotel_city"),
                        get(row, index, "hotel_name"),
                        get(row, index, "hotel_description"),
                        intValue(get(row, index, "hotel_stars"), 0),
                        date(get(row, index, "start_date")),
                        date(get(row, index, "end_date")),
                        intValue(get(row, index, "adults"), 0),
                        intValue(get(row, index, "children"), 0),
                        intValue(get(row, index, "boylovers"), 0)
                ));
            } catch (RuntimeException ex) {
                System.err.println("Skipping line " + (i + 1) + ": " + ex.getMessage());
            }
        }
        return result;
    }

    /** Split a CSV line, including quoted commas. */
    public static List<String> parseCsvLine(String line) {
        List<String> fields = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        boolean inQuotes = false;

        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);
            if (c == '"') {
                if (inQuotes && i + 1 < line.length() && line.charAt(i + 1) == '"') {
                    current.append('"');
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (c == ',' && !inQuotes) {
                fields.add(current.toString());
                current.setLength(0);
            } else {
                current.append(c);
            }
        }
        fields.add(current.toString());
        return fields;
    }

    public static String get(List<String> row, Map<String, Integer> index, String name) {
        Integer position = index.get(name);
        if (position == null || position >= row.size()) {
            return "";
        }
        return row.get(position).trim();
    }

    public static int intValue(String value, int fallback) {
        if (value == null || value.isBlank()) {
            return fallback;
        }
        try {
            return Integer.parseInt(value.trim());
        } catch (NumberFormatException ex) {
            return fallback;
        }
    }

    public static LocalDate date(String value) {
        String text = value.trim();
        if (text.length() > 10) {
            text = text.substring(0, 10);
        }
        return LocalDate.parse(text);
    }

    public static void main(String[] args) {
        launch(args);
    }
}
