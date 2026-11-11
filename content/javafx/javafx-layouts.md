---
id: javafx-layouts
lang: JavaFX
title: JavaFX layouts and sizing
---

# JavaFX layouts and sizing

## Simplest form

```java
// Data shape: a pane holds an ordered list of children, plus a gap and insets.
// Sizes come from each child's preferred size unless you say otherwise.
VBox root = new VBox(8);                  // 8 px between children
root.setPadding(new Insets(12));          // 12 px inside the pane
root.getChildren().addAll(new Label("Name"), new TextField());
```

A layout pane decides two things for its children: where each one sits, and how big it becomes when the window resizes. The pane never invents a size out of nothing. It asks each child for a minimum, a preferred and a maximum, then distributes the available space according to its own rules and the grow priorities you set.

## What a layout pass does

JavaFX runs a layout pass after the scene is shown and again after anything that can change sizes: a resize, a text change, a child added or removed, a font change, a style class change. The pass walks the tree and calls `layout()` on each parent. A parent reads its children's preferred sizes, computes positions, and calls `resize` on them.

You normally do not call `layout()` yourself. You change properties and the toolkit marks the branch dirty. Two consequences follow.

Setting `prefWidth` on a child does not guarantee that width. The parent may hand out more or less. Forcing a size with `resize()` or `relocate()` on a managed child is pointless, because the next pass overwrites it.

A child that is not managed is skipped by the pass. `node.setManaged(false)` keeps the node visible but removes it from layout, which is how you place an overlay by hand inside a `Pane`.

## The three sizes

Every `Region` carries six values: `minWidth`, `prefWidth`, `maxWidth` and the same three for height. They are hints, not commands, and each has a default.

- `USE_COMPUTED_SIZE` (`-1`) means "ask my content and my skin". This is the default for all six.
- `USE_PREF_SIZE` (`-2`) means "use my preferred value".
- A number pins the value.

For many controls, the computed maximum resolves to the preferred size. That single fact explains the classic complaint: a list that refuses to get wider. The pane had space to give, the grow priority was set, and the child still said "my maximum is 320". Set the maximum to `Double.MAX_VALUE` before expecting growth.

```java
list.setPrefWidth(320);
list.setMinWidth(220);
list.setMaxWidth(Double.MAX_VALUE);   // now the parent may grow it
```

Use `Double.MAX_VALUE` for "no upper bound", not `Integer.MAX_VALUE`. The layout code compares doubles, and a rounded integer limit shows up as a few pixels of wasted space.

To stop a sidebar from shrinking below its preferred width, use the pref value itself:

```java
sidebar.setMinWidth(Region.USE_PREF_SIZE);
```

That keeps the width stable when the window narrows, and the centre area gives way instead.

## Padding, margin and insets

`setPadding(new Insets(top, right, bottom, left))` adds space inside the pane, around all children. `VBox.setMargin(child, insets)` adds space around one child, outside it. Both accept negative values, which is occasionally useful for pulling a caption closer to its field.

`setSpacing` on `VBox`, `HBox`, `FlowPane` and `GridPane` (`setHgap`, `setVgap`) is the gap between neighbours. Spacing is cheaper to read than a margin on every other child, so prefer it.

A pane with padding of 12 and spacing of 8 has 12 px at the edges and 8 px between rows, not 20 between the first two rows.

## Growth belongs to the parent

JavaFX puts the grow decision on the parent, through a static setter that takes the child:

```java
HBox.setHgrow(detailList, Priority.ALWAYS);
VBox.setVgrow(detailList, Priority.ALWAYS);
```

`Priority.ALWAYS` means "take all leftover space along this axis". `Priority.SOMETIMES` is the fallback when nothing has `ALWAYS`. `Priority.NEVER` is the default. With two growing children the leftover space is divided, weighted by their maximum sizes.

A static call in the parent class is easy to forget in the class that builds the child. When a component refuses to grow, check the parent, not the component.

## The six panes

### VBox

Children in one column, top to bottom. `setSpacing` for the gap, `setAlignment(Pos.CENTER)` to centre the whole column, `setFillWidth(true)` (the default) to stretch children to the pane width. Stretching still respects each child's maximum width, so a `Label` with a computed maximum stays at its text width.

`VBox.setVgrow(child, Priority.ALWAYS)` gives one child the vertical slack. Use it for the one list or table that should fill the window.

### HBox

Children in one row, left to right. `setFillHeight(true)` is the default, so children are stretched to the row height when their maximum height allows. `setAlignment(Pos.CENTER_LEFT)` positions the row content. For a toolbar with the buttons on the left and a status label on the right, insert an empty growing `Region` between them instead of computing widths.

```java
Region spacer = new Region();
HBox.setHgrow(spacer, Priority.ALWAYS);
HBox bar = new HBox(8, new Label("Filter:"), field, spacer, new Label("Ready"));
```

### BorderPane

Five slots: top, bottom, left, right, centre. Top and bottom take the full width and their preferred height. Left and right take their preferred width and the remaining height. The centre gets whatever is left, and it is the only slot that grows in both directions without extra calls.

```java
BorderPane root = new BorderPane();
root.setTop(menuBar);
root.setBottom(statusBar);
root.setLeft(sidebar);
root.setCenter(table);
```

`BorderPane.setAlignment(node, Pos.CENTER_LEFT)` controls where a child sits inside a slot narrower than the slot. `BorderPane.setMargin(node, insets)` separates a slot's content from the other slots.

This pane is the natural root for an exam task: menu on top, status at the bottom, content in the centre. Do not put the menu bar inside a `VBox` under a `BorderPane` and then wonder why it is not full width; it will be full width inside that `VBox`, which is fine, but the extra layer costs a layout pass and confuses the reader.

### GridPane

Rows and columns. `add(node, column, row)` places a child, `add(node, column, row, columnSpan, rowSpan)` spans cells. Row 0, column 0 is the top left.

```java
GridPane grid = new GridPane();
grid.setHgap(10);
grid.setVgap(8);
grid.add(new Label("Email:"), 0, 0);
grid.add(emailField, 1, 0);
grid.add(new Label("City:"), 0, 1);
grid.add(cityBox, 1, 1);
```

Column widths come from the widest preferred width in the column. Spare width is not handed out automatically. You either set `ColumnConstraints` with `setPercentWidth`, or mark a child with `GridPane.setHgrow(child, Priority.ALWAYS)` and a permissive maximum width. For a form where the input column absorbs the window growth:

```java
ColumnConstraints labelColumn = new ColumnConstraints();
labelColumn.setMinWidth(90);

ColumnConstraints inputColumn = new ColumnConstraints();
inputColumn.setHgrow(Priority.ALWAYS);
inputColumn.setFillWidth(true);

grid.getColumnConstraints().addAll(labelColumn, inputColumn);
```

Rows behave the same way through `RowConstraints`, most often used with `setVgrow(Priority.ALWAYS)` for the one row that holds a table or a text area. Without it, a `TextArea` in a grid keeps its preferred height and the window fills with empty grid.

`setGridLinesVisible(true)` draws cell borders. It is a debugging aid, not a design choice; turn it off before the screenshot.

`GridPane.setMargin(child, insets)` is the usual way to separate the button row from the fields. `GridPane.setHalignment` and `setValignment` position a child inside its cell.

### StackPane

Children on top of each other, last child on top. Used for overlays, loading masks, and centring one node in the window.

```java
Label mask = new Label("Loading...");
mask.setMaxSize(Double.MAX_VALUE, Double.MAX_VALUE);
mask.setStyle("-fx-background-color: rgba(255,255,255,0.7); -fx-alignment: center;");

StackPane root = new StackPane(table, mask);
```

Children are resized to fill the pane when their maximum allows. A `Label` with its default computed maximum stays small and centred, which is exactly what a message overlay needs. To pin a child to a corner, use `StackPane.setAlignment(child, Pos.TOP_RIGHT)` and `StackPane.setMargin`.

Z-order is child order, not a property. To bring something to the front, remove it and add it again, or use `toFront()`.

### FlowPane

Children in rows that wrap when the width runs out. `setHgap` and `setVgap` space them, `setOrientation(Orientation.VERTICAL)` makes the columns wrap instead, and `setPrefWrapLength(240)` tells the pane the width at which wrapping should be considered when it computes its own preferred size.

Children keep their preferred size in a `FlowPane`. Nothing stretches, which is why it suits cards, tags and thumbnails. `setRowValignment(Pos.CENTER)` aligns rows of unequal height.

For a wall of summary cards, each card is a `VBox` with its own padding and a fixed preferred width. The `FlowPane` handles the wrapping, and the number of columns follows the window.

### The rest, briefly

`AnchorPane` pins children to edges with `setTopAnchor` and friends, which is closer to absolute positioning than to flow layout. `TilePane` makes all cells the same size. `SplitPane` gives the user a draggable divider between two resizable panes, useful when two lists must share the width but the ratio is unknown. `ScrollPane` wraps content that is larger than the window; `setFitToWidth(true)` makes the content match the viewport width so long text wraps instead of forcing a horizontal scrollbar.

## Debugging a layout

The failure is almost always one of five things, and each has a fast check.

The child has a maximum equal to its preferred size. `getMaxWidth()` returns `-1` when the value is still computed, and a computed maximum usually resolves to the preferred size. Print it after the window is shown; anything other than `Double.MAX_VALUE` means the parent cannot give the child more even when space exists.

The parent has no grow priority for that child. `HBox.getHgrow(child)` returns `null` unless you set it, and the layout treats `null` as no growth.

A fixed minimum blocks shrinking. A window cannot get smaller than the sum of the minimums plus padding and spacing. If the stage refuses to shrink, the minimums are the reason; `stage.setMinWidth` is not always the culprit.

The child is inside a `ScrollPane` that does not fit to width. The content keeps its preferred width and a horizontal scrollbar appears.

Two panes fight over the same slot. A node added twice, or a `BorderPane` slot overwritten by a second `setCenter`, leaves the first child detached and invisible. `getChildren()` of the parent tells you what is actually there.

Calling `requestLayout()` after a change of your own is rarely needed, because property setters already do it. It is needed after mutating a list the pane cannot observe, for example replacing the children of a plain `Pane` through a backing collection.

## Examples

### Example 1: fixed sidebar, growing content, toolbar with a spacer

```java
import javafx.application.Application;
import javafx.beans.property.ReadOnlyStringWrapper;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.ListView;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Priority;
import javafx.scene.layout.Region;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

public class TwoPanelApp extends Application {

    @Override
    public void start(Stage stage) {
        ListView<String> filters = new ListView<>();
        filters.getItems().addAll("2023", "2024", "2025");
        // Width stays 180, height follows the window.
        filters.setPrefWidth(180);
        filters.setMinWidth(180);
        filters.setMaxWidth(180);
        filters.setMaxHeight(Double.MAX_VALUE);

        TableView<String> table = new TableView<>();
        // One column is enough to show the sizing behaviour.
        TableColumn<String, String> guest = new TableColumn<>("Guest");
        guest.setCellValueFactory(cell -> new ReadOnlyStringWrapper(cell.getValue()));
        table.getColumns().add(guest);
        // Widening the window must grow the table, so lift its maximum.
        table.setMaxWidth(Double.MAX_VALUE);
        table.setMaxHeight(Double.MAX_VALUE);
        HBox.setHgrow(table, Priority.ALWAYS);

        HBox content = new HBox(12, filters, table);
        content.setPadding(new Insets(12));
        content.setFillHeight(true);

        Region spacer = new Region();
        HBox.setHgrow(spacer, Priority.ALWAYS);

        HBox toolbar = new HBox(8,
                new Label("Group:"), new Button("Years"), new Button("Hotels"),
                spacer, new Label("Ready"));
        toolbar.setAlignment(Pos.CENTER_LEFT);
        toolbar.setPadding(new Insets(8, 12, 8, 12));

        VBox root = new VBox(toolbar, content);
        VBox.setVgrow(content, Priority.ALWAYS);   // the whole row fills the height

        stage.setTitle("Two panels");
        stage.setScene(new Scene(root, 900, 560));
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
```

Three deliberate choices: the sidebar pins all three widths, the table releases its maximum and asks the `HBox` for the slack, and the `HBox` itself is given the vertical slack inside the `VBox`. Remove any one of the three and the layout falls back to something that looks broken.

### Example 2: a form grid that grows in the right column

```java
GridPane form = new GridPane();
form.setHgap(10);
form.setVgap(8);
form.setPadding(new Insets(12));

ColumnConstraints labels = new ColumnConstraints();
labels.setMinWidth(110);
labels.setHalignment(HPos.RIGHT);

ColumnConstraints inputs = new ColumnConstraints();
inputs.setHgrow(Priority.ALWAYS);
inputs.setFillWidth(true);

form.getColumnConstraints().addAll(labels, inputs);

TextField email = new TextField();
ComboBox<String> hotel = new ComboBox<>();
hotel.getItems().addAll("Hotel Alfa", "Hotel Beta", "Hotel Gamma");
hotel.setMaxWidth(Double.MAX_VALUE);        // let the combo fill its column

TextArea note = new TextArea();
note.setWrapText(true);
note.setPrefRowCount(4);

form.addRow(0, new Label("Email:"), email);
form.addRow(1, new Label("Hotel:"), hotel);
form.addRow(2, new Label("Note:"), note);

// The note row takes the remaining vertical space.
RowConstraints noteRow = new RowConstraints();
noteRow.setVgrow(Priority.ALWAYS);
form.getRowConstraints().addAll(new RowConstraints(), new RowConstraints(), noteRow);
```

`ComboBox` is a control whose computed maximum equals its preferred width, so the line `hotel.setMaxWidth(Double.MAX_VALUE)` is what makes the column look finished. `TextField` already fills its cell by default in most themes, which is why only one of the two needs the call here.

### Example 3: a wrapping card wall

```java
FlowPane cards = new FlowPane();
cards.setHgap(12);
cards.setVgap(12);
cards.setPadding(new Insets(12));
cards.setPrefWrapLength(600);

for (String city : List.of("Budapest", "Debrecen", "Szeged", "Pecs", "Gyor")) {
    Label name = new Label(city);
    name.setStyle("-fx-font-size: 15px; -fx-font-weight: bold;");

    Label count = new Label("Bookings: " + (city.length() * 3));

    VBox card = new VBox(4, name, count);
    card.setPadding(new Insets(10));
    card.setPrefWidth(170);
    card.setStyle("-fx-background-color: white; -fx-border-color: #d1d5db;"
            + " -fx-border-radius: 6; -fx-background-radius: 6;");
    cards.getChildren().add(card);
}
```

Each card states a preferred width and nothing else. The `FlowPane` fits as many as the current width allows and wraps the rest. Narrowing the window moves cards to a new row; nothing clips, because the pane recomputes the wrap on every pass.

### Example 4: the complete exam layout, commented

```java
import javafx.application.Application;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.ComboBox;
import javafx.scene.control.Label;
import javafx.scene.control.ListView;
import javafx.scene.control.Menu;
import javafx.scene.control.MenuBar;
import javafx.scene.control.MenuItem;
import javafx.scene.control.TableView;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.FlowPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Priority;
import javafx.scene.layout.Region;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

/**
 * LayoutDemo builds the screen shell the exam asks for, with no data logic.
 *
 * Structure:
 *   BorderPane
 *     top    -> menu bar over a filter bar over a status line
 *     centre -> HBox of a fixed list and a growing table
 *     bottom -> FlowPane of summary cards
 *
 * Every sizing decision below is commented where it matters, because the
 * layout is the part that is hard to repair under time pressure.
 */
public class LayoutDemo extends Application {

    @Override
    public void start(Stage stage) {
        BorderPane root = new BorderPane();
        root.setTop(buildTop());
        root.setCenter(buildCenter());
        root.setBottom(buildCards());

        // A StackPane over the whole root would be the place for a modal mask.
        Scene scene = new Scene(root, 960, 620);

        stage.setTitle("Layout demo");
        stage.setMinWidth(760);        // below this the fixed list starts to clip
        stage.setMinHeight(480);
        stage.setScene(scene);
        stage.show();
    }

    private VBox buildTop() {
        MenuBar menuBar = new MenuBar(
                new Menu("File", null, new MenuItem("Open...")),
                new Menu("Help", null, new MenuItem("About")));

        // Filter row. The spacer pushes the button to the right edge, so no
        // width has to be guessed for the window size.
        ComboBox<String> city = new ComboBox<>(
                FXCollections.observableArrayList("Budapest", "Szeged"));
        city.setPromptText("City");
        city.setPrefWidth(180);

        Region spacer = new Region();
        HBox.setHgrow(spacer, Priority.ALWAYS);

        Button apply = new Button("Apply");
        HBox filter = new HBox(10, new Label("Filter:"), city, spacer, apply);
        filter.setAlignment(Pos.CENTER_LEFT);
        filter.setPadding(new Insets(10, 12, 10, 12));
        filter.getStyleClass().add("filter-bar");

        Label status = new Label("0 rows");
        HBox statusBar = new HBox(status);
        statusBar.setPadding(new Insets(4, 12, 4, 12));
        statusBar.getStyleClass().add("status-bar");

        // VBox with no grow: each child keeps its preferred height, so
        // the centre of the BorderPane gets all the leftover space.
        VBox top = new VBox(menuBar, filter, statusBar);
        top.setFillWidth(true);
        return top;
    }

    private HBox buildCenter() {
        ListView<String> groups = new ListView<>();
        groups.getItems().addAll("2023", "2024", "2025");
        groups.setPlaceholder(new Label("No groups"));
        // All three widths pinned: the sidebar never moves when the window
        // grows, and it does not shrink below 200 when the window narrows.
        groups.setPrefWidth(200);
        groups.setMinWidth(200);
        groups.setMaxWidth(200);
        // Height is free, so the list fills the row height.
        groups.setMaxHeight(Double.MAX_VALUE);

        TableView<String> table = new TableView<>();
        table.setPlaceholder(new Label("Select a group"));
        // A control's computed maximum is its preferred size. Without these
        // two lines the table would stay narrow and short inside a big window.
        table.setMaxWidth(Double.MAX_VALUE);
        table.setMaxHeight(Double.MAX_VALUE);
        HBox.setHgrow(table, Priority.ALWAYS);

        HBox center = new HBox(12, groups, table);
        center.setPadding(new Insets(12));
        // Stretch both children to the row height; each still obeys its max.
        center.setFillHeight(true);
        return center;
    }

    private FlowPane buildCards() {
        FlowPane cards = new FlowPane();
        cards.setHgap(10);
        cards.setVgap(10);
        cards.setPadding(new Insets(10, 12, 12, 12));
        // Preferred wrap length only affects the pane's own preferred width;
        // the actual wrapping follows the current width at every pass.
        cards.setPrefWrapLength(600);

        for (String label : new String[]{"Bookings", "Guests", "Nights"}) {
            VBox card = new VBox(2,
                    new Label(label),
                    new Label("0"));
            card.setPadding(new Insets(8, 12, 8, 12));
            card.setPrefWidth(150);
            card.getStyleClass().add("card");
            cards.getChildren().add(card);
        }
        return cards;
    }

    public static void main(String[] args) {
        launch(args);
    }
}
```

Two lines deserve a second look. `HBox.setHgrow(table, Priority.ALWAYS)` is called in the method that builds the `HBox`, not in the method that builds the table, because growth is a property of the relationship, not of the child. And the `VBox` for the top area has no `setVgrow`, which is what keeps the centre large.

The matching CSS. Style classes are added in the code above, so selectors stay short and specific.

```css
.root {
    -fx-font-family: "Segoe UI", Arial, sans-serif;
    -fx-font-size: 13px;
    -fx-background-color: #f3f5f8;
}

.filter-bar {
    -fx-background-color: #ffffff;
    -fx-border-color: #e5e7eb;
    -fx-border-width: 0 0 1 0;
}

.status-bar {
    -fx-background-color: #e9eef5;
    -fx-font-size: 12px;
    -fx-text-fill: #374151;
}

.card {
    -fx-background-color: #ffffff;
    -fx-background-radius: 8;
    -fx-border-color: #d1d5db;
    -fx-border-radius: 8;
}

.card .label {
    -fx-text-fill: #111827;
}
```

## Common mistakes

- Setting `setPrefWidth` and expecting the child to grow. Preference is a request; growth needs a lifted maximum and a parent priority.
- Calling `HBox.setHgrow` but leaving the maximum at its computed value. The pane offers space, the child refuses it, and the space stays empty.
- Putting a fixed-width list inside an `HBox` without pinning `minWidth` and `maxWidth`. The list drifts when the window resizes.
- Forgetting `setFillHeight(true)` (or `setFillWidth`) after turning it off once. Children then sit at their preferred height in a tall row.
- Using `setPadding` when a margin was meant. Padding moves every child; margin moves one.
- Mixing `BorderPane` slots with absolute placement. A child in the centre slot ignores `relocate`.
- Adding a `TableView` to a `GridPane` without a growing row. The table keeps its preferred height and the lower half of the window stays empty.
- Expecting `FlowPane` to stretch cards. It never does; give each card a preferred width.
- Putting a `ScrollPane` around a `VBox` and wondering why the text does not wrap. Set `fitToWidth(true)` and `setWrapText(true)` on the labels.
- Forcing a design with negative margins, then watching it break at a different font size. Spacing and constraints survive a font change; negative margins do not.
- Trusting `getWidth()` inside `start`. Before the first layout pass the value is 0.

## Exam checklist

1. One `BorderPane` root, with menu on top, content in the centre, status at the bottom.
2. The content area uses `HBox` for the two lists and one spatial gap, not absolute coordinates.
3. The left list has pinned widths and a free height; the right list grows in both directions.
4. Every growing child has `setMaxWidth(Double.MAX_VALUE)` or `setMaxHeight(Double.MAX_VALUE)`.
5. The parent pane states the grow priority for that child.
6. Forms use `GridPane` with a gap and a padding, and the input column grows.
7. `setPadding` and spacing are set on the pane, not faked with empty labels.
8. The window has a sensible minimum size, and no control clips at that size.
9. Cards or summary tiles use `FlowPane` so a narrow window wraps instead of scrolling sideways.
10. Resizing the window from small to maximised keeps the same visual hierarchy.
11. `setGridLinesVisible` and debug borders are removed.
12. The layout still reads correctly with the longest plausible text in every label.
