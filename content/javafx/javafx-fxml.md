---
id: javafx-fxml
lang: JavaFX
title: FXML in JavaFX
---

# FXML in JavaFX

## Simplest form

```xml
<!-- Data shape: one FXML file becomes one root Node plus one controller instance -->
<?xml version="1.0" encoding="UTF-8"?>
<?import javafx.scene.layout.VBox?>
<?import javafx.scene.control.Label?>

<VBox xmlns="http://javafx.com/javafx/17"
      xmlns:fx="http://javafx.com/fxml/1"
      fx:controller="sample.HelloController">
    <Label fx:id="greeting" text="Hello"/>
</VBox>
```

```java
// Two lines in start(Stage): resolve the file, then build the tree from it
FXMLLoader loader = new FXMLLoader(getClass().getResource("/fxml/hello.fxml"));
Parent root = loader.load();
```

The XML describes the object graph. The Java class named in `fx:controller` receives the parts marked with `fx:id`. Nothing else is required: no registration, no annotation processing, no generated code.

## What it does

FXML is an XML dialect that builds JavaFX objects by reflection. Each element name becomes a class, each attribute becomes a property setter or a read only property, and each child element is added to the parent's children list. The `fx:` namespace adds instructions that the loader understands: which field to inject, which class is the controller, which method handles an event.

The gain is layout work split from logic. A designer or an exam task can hand you a `.fxml` file, and your job is the controller class and the loader call. The cost is that every mistake shows up at runtime, since the compiler never reads the XML. That is why the error list near the end of this page matters more than it looks.

## Every part

### The root element and the two namespaces

The first element is the root of the tree. It can be any `Node` subclass with a no argument constructor, usually a layout such as `VBox`, `BorderPane`, `GridPane`, or `AnchorPane`.

Two namespace declarations belong on that root. `xmlns="http://javafx.com/javafx/17"` is the default namespace and matches the JavaFX version you compile against; the version number is not checked strictly, but keep it close to your runtime. `xmlns:fx="http://javafx.com/fxml/1"` registers the `fx:` prefix. Drop the second one and the parser rejects every `fx:id` in the file before the loader even runs.

Nested elements do not need their own namespace declarations. They inherit.

### Imports

The JavaFX runtime cannot guess a class from a short element name. Each class used as an element needs a processing instruction at the top of the file:

```xml
<?import javafx.scene.control.Button?>
<?import javafx.scene.layout.HBox?>
```

Only elements need imports. An attribute value like `text="Save"` is a string. An attribute that names a class, such as `fx:controller="sample.LoginController"`, uses the fully qualified name and needs no import. Imports also cover static fields and enums used as attribute values, for example `javafx.scene.text.FontWeight` if you write `fontWeight="BOLD"`.

Wildcards are legal (`<?import javafx.scene.control.*?>`), and they hide exactly the error you want to see: a typo inside a wildcard package gives a `ClassNotFoundException` at load time with no obvious source line.

### fx:id

`fx:id="emailField"` does three things. It stores the object in the loader namespace under that name, it sets the node's `id` property (which is what CSS `#emailField` selects on), and it makes the object a candidate for injection into a controller field with the same name.

The value must be a valid Java identifier: no spaces, no dots, no leading digit. `fx:id="email field"` fails at parse time.

Two nodes cannot share an `fx:id` inside one file. Use `fx:id` on every node you later read or change. A label that only shows static text needs none, which keeps the controller short.

### fx:controller

`fx:controller="sample.LoginController"` on the root names the class that receives the injected nodes. The loader creates it with `Class.getDeclaredConstructor().newInstance()`, so it needs a no argument constructor. A controller whose only constructor takes a database object cannot be named here; see the passing data section for the two ways out.

The controller class has to be on the classpath at runtime. In a modular project it must also be exported to `javafx.fxml`, otherwise reflection fails with an access error that looks like a missing class.

### Controller fields and injection order

A field is injected when its name equals an `fx:id` and the field is either public or annotated `@FXML`. Annotation is the normal choice because it works with private fields and survives any later refactor of the class into a package.

```java
@FXML private TextField emailField;   // filled by the loader
private int attempts;                 // never touched by FXML
```

The type must be assignable from the node. Declaring `@FXML private Object emailField;` compiles and works, but you lose the methods. Declaring a `Label` for a `TextField` in the file fails at injection.

Order inside one load: the objects are constructed, `fx:id` values are stored, controller fields are injected, then `initialize()` runs. A field read in a constructor is null. A field read in `initialize()` is ready.

A field with no matching `fx:id` stays null and no exception is raised. That silence is the most common source of a `NullPointerException` two screens later.

### initialize()

```java
@FXML
private void initialize() {
    // all fx:id fields are set here, the scene graph exists, the stage does not
}
```

`initialize()` is called once per load, after injection, before `load()` returns. It may be private, which keeps it out of the public API of the controller. It runs again on every new load, so a reload produces fresh state.

Inside it the nodes exist but are not yet on a scene, so `getScene()` is null and `getWidth()` of a control is often zero. Anything that needs real sizes belongs in a `Platform.runLater` or in a listener on the scene.

A controller can also implement `javafx.fxml.Initializable` and use `initialize(URL location, ResourceBundle resources)`. That older form gives you the location of the file and the bundle, which helps when you need to resolve a sibling resource. The no argument method is enough in most exam tasks; do not implement both without a reason, because the interface method runs and the annotated method also runs, and the order between them is not something to rely on.

### Event handlers with onAction

`onAction="#signIn"` connects a control event to a controller method. The `#` marks a name the loader resolves in the controller, not in the node.

```xml
<Button text="Sign in" onAction="#signIn"/>
```

The method may take no arguments or one argument of the event type or a supertype of it:

```java
@FXML private void signIn() { ... }
@FXML private void signIn(ActionEvent event) { ... }
```

It must be public or annotated `@FXML`. A private method without the annotation is invisible to reflection, and the load fails with a message naming the `onAction` value.

Other events follow the same pattern with their own attribute: `onMouseClicked`, `onKeyPressed`, `onAction` for buttons and text fields (Enter), `onShowing` for dialogs. For anything more complex than a handler name, register the listener in `initialize()` with a lambda and keep the XML clean.

### FXMLLoader

Two shapes, and the difference matters.

```java
// static helper: one line, no controller access
Parent root = FXMLLoader.load(getClass().getResource("/fxml/hello.fxml"));

// instance: the one you need when the controller needs data
FXMLLoader loader = new FXMLLoader(getClass().getResource("/fxml/hello.fxml"));
Parent root = loader.load();
HelloController controller = loader.getController();
```

`load()` returns the root and throws `IOException` when the file cannot be read or parsed. The static form is fine for a screen with no state to pass. The instance form is required for `getController()`, for `setController()`, for `setControllerFactory()`, and for setting a resource bundle.

A loader is single use in practice. Calling `load()` twice on the same instance rebuilds the tree and creates a second controller, which is rarely what you want; create a new loader per screen.

### getResource and where paths start

`getResource` is a `Class` method and resolution depends on the leading slash.

- `getClass().getResource("/fxml/login.fxml")` starts at the classpath root. This is the safe form, and the one to use in exams.
- `getClass().getResource("login.fxml")` starts in the package of the calling class.

The resource must be copied into the output directory by your build. With Maven or Gradle, `src/main/resources` is copied automatically; a file sitting in `src/main/java` may or may not be, depending on configuration, and that produces a file you can see in the IDE and the loader cannot find.

A wrong path returns null, not an exception. `new FXMLLoader(null)` then fails on `load()` with a message saying the location is not set, which sends people looking at FXML syntax when the real problem is the path. Print the URL once when you debug:

```java
System.out.println(getClass().getResource("/fxml/login.fxml"));
```

`null` in that line is the whole diagnosis.

### Passing data into a controller

Three patterns, in order of how often they are the right answer.

Set the data after `load()`, through a method on the controller. The controller exists and `initialize()` has already run, so the method has to render the data itself instead of relying on `initialize()` to read it.

```java
FXMLLoader loader = new FXMLLoader(getClass().getResource("/fxml/order.fxml"));
Parent root = loader.load();
loader.<OrderController>getController().setOrder(order);
```

Use a controller factory when the controller needs the data at construction time, for example to build a table model in `initialize()`. The factory receives the class named in `fx:controller` and returns an instance of it.

```java
FXMLLoader loader = new FXMLLoader(getClass().getResource("/fxml/order.fxml"));
loader.setControllerFactory(type -> new OrderController(order, repository));
Parent root = loader.load();
```

Pass the application itself (a reference to the object that owns the stage), not the stage directly, when a screen must navigate. The controller calls back into one method per screen, and the navigation logic lives in exactly one place.

Never call `setController` on a loader whose FXML also has `fx:controller`. The loader throws, because two controllers were specified.

### Nested FXML with fx:include

`<fx:include source="status-bar.fxml"/>` splices another FXML file into the tree at that point. The child file has its own root, its own `fx:controller`, and its own `initialize()`, which runs while the parent is still being built. So the parent's `initialize()` can safely push data into the child.

Give the include an `fx:id` and the loader exposes two fields in the parent controller: the child root node under the plain name, and the child controller under the name plus `Controller`.

```xml
<fx:include fx:id="statusBar" source="status-bar.fxml"/>
```

```java
@FXML private HBox statusBar;                       // the child root
@FXML private StatusBarController statusBarController;  // the child controller
```

The `source` path is resolved relative to the including file, so both files normally sit in the same folder. A leading `/` in `source` is not a classpath root marker here; keep the files together instead of fighting it.

Use includes for repeated chrome (toolbars, status bars, form sections), not for a screen that should load independently. A screen is loaded by code so it can be switched and given data; an include is loaded as part of its parent and shares its lifetime.

### Custom controls with fx:root

When the controller itself should be the node, use `<fx:root type="javafx.scene.layout.HBox">` as the root element and load into an existing object:

```java
public class Row extends HBox {
    @FXML private Label nameLabel;

    public Row(String name) {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/fxml/row.fxml"));
        loader.setRoot(this);
        loader.setController(this);
        try {
            loader.load();
        } catch (IOException e) {
            throw new IllegalStateException("row.fxml is broken", e);
        }
        nameLabel.setText(name);
    }
}
```

With `fx:root` there is no `fx:controller` attribute. The instance that calls `setController(this)` is the controller, which is what lets a list cell or a table row build its own view and keep a typed constructor.

### CSS with FXML

Two attributes and one method cover nearly everything.

```xml
<VBox xmlns="http://javafx.com/javafx/17" xmlns:fx="http://javafx.com/fxml/1"
      stylesheets="@app.css" styleClass="panel">
```

`stylesheets="@app.css"` is resolved relative to the FXML file. `styleClass="panel error"` adds class names, space separated, which is how one node gets several rules. Inline `style="-fx-text-fill: red;"` wins over stylesheet rules and should stay rare, because it cannot be themed or overridden.

From code, attach the sheet to the scene once instead of to every root:

```java
scene.getStylesheets().add(getClass().getResource("/css/app.css").toExternalForm());
```

`toExternalForm()` is required: `getStylesheets()` takes strings, and a `URL` object will not compile there. A scene level sheet survives `scene.setRoot(...)`, which is why scene switching and styling work well together.

`fx:id` doubles as the node id, so `#signInButton` selects it. Prefer style classes anyway; an id belongs to one node, and CSS built on ids does not survive reuse.

### Scene switching

Keep one `Stage` and one `Scene`, and replace the root:

```java
Parent root = new FXMLLoader(getClass().getResource("/fxml/dashboard.fxml")).load();
scene.setRoot(root);
```

This keeps window size, position, and scene stylesheets. Building a new `Scene` per screen loses the stylesheet list and resets the size unless you set it again.

Whoever owns the stage owns navigation. Give controllers a method to ask for the next screen, never a `Stage` field they mutate themselves, or two screens will fight over the title.

If the target screen needs a fresh window, open a second `Stage` and pass the owner; use that for dialogs, not for main navigation.

### Resource bundles

`text="%save.label"` looks the key up in the bundle given to the loader, and `resources="..."` on the root can name a bundle file directly. `FXMLLoader.setResources(ResourceBundle)` supplies one from code, which is the usual case when the bundle depends on a logged in user's locale.

Without a bundle, a `%key` value is displayed literally, so a missing bundle is visible rather than fatal.

## Examples

### Example 1: a counter window

The whole pair, smallest useful size. `CounterController` is named in the FXML, so it needs a no argument constructor.

`counter.fxml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>

<?import javafx.scene.control.Button?>
<?import javafx.scene.control.Label?>
<?import javafx.scene.layout.VBox?>

<!-- fx:controller names the class; every fx:id must match one field there -->
<VBox xmlns="http://javafx.com/javafx/17"
      xmlns:fx="http://javafx.com/fxml/1"
      fx:controller="sample.CounterController"
      spacing="8" styleClass="panel">

    <Label fx:id="countLabel" text="0"/>
    <Button text="Add one" onAction="#addOne"/>
</VBox>
```

`CounterController.java`:

```java
package sample;

import javafx.fxml.FXML;
import javafx.scene.control.Label;

public class CounterController {

    @FXML private Label countLabel;   // injected, name matches countLabel in the FXML
    private int count;                // plain state, FXML never sees it

    @FXML
    private void addOne() {
        count++;
        countLabel.setText(Integer.toString(count));
    }
}
```

`Main.java`:

```java
package sample;

import java.io.IOException;
import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;

public class Main extends Application {

    @Override
    public void start(Stage stage) throws IOException {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/fxml/counter.fxml"));
        Parent root = loader.load();
        stage.setScene(new Scene(root, 240, 120));
        stage.setTitle("Counter");
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
```

Four files here (FXML, controller, launcher, and the folder that holds them) and not one line of layout in Java. That trade is the point of FXML.

### Example 2: passing an object after load

The order is the whole lesson: `load()`, then `getController()`, then set the data, then render.

`order.fxml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>

<?import javafx.scene.control.Label?>
<?import javafx.scene.layout.VBox?>

<VBox xmlns="http://javafx.com/javafx/17"
      xmlns:fx="http://javafx.com/fxml/1"
      fx:controller="sample.OrderController"
      spacing="6">

    <Label fx:id="totalLabel" text="no order"/>
    <Label fx:id="lineCountLabel" text="0 lines"/>
</VBox>
```

`OrderController.java`:

```java
package sample;

import javafx.fxml.FXML;
import javafx.scene.control.Label;

public class OrderController {

    @FXML private Label totalLabel;
    @FXML private Label lineCountLabel;

    private Order order;

    // Called from outside, after the loader returned. initialize() cannot use
    // the order, because the order does not exist yet when it runs.
    public void setOrder(Order order) {
        this.order = order;
        totalLabel.setText(order.total() + " EUR");
        lineCountLabel.setText(order.lines().size() + " lines");
    }

    @FXML
    private void refresh() {
        if (order != null) {
            setOrder(order);   // same path for the button and the first paint
        }
    }
}
```

Caller:

```java
FXMLLoader loader = new FXMLLoader(getClass().getResource("/fxml/order.fxml"));
Parent root = loader.load();
OrderController controller = loader.getController();
controller.setOrder(repository.find(orderId));   // data last
```

If the controller has to build a table model in `initialize()`, the order has to be there before the constructor returns, and then the controller factory is the tool:

```java
FXMLLoader loader = new FXMLLoader(getClass().getResource("/fxml/order.fxml"));
loader.setControllerFactory(type -> new OrderController(order, repository));
Parent root = loader.load();
```

The lambda must return an instance of `type`, the class named in `fx:controller`. Returning a subclass is fine; returning something else throws ClassCastException during load.

### Example 3: two screens, a shared stylesheet, and an include

A complete small application. A login screen switches to a dashboard, the dashboard includes a status bar, and one stylesheet attached to the scene styles both screens. Read it from top to bottom; the comments explain the choices, not the syntax.

`app.css`:

```css
/* Attached to the scene once. Because the scene survives setRoot, every screen shares it. */
.root {
    -fx-font-family: "System";
    -fx-font-size: 13px;
    -fx-background-color: #f7f7f8;
}

.panel {
    -fx-padding: 18;
}

.bar {
    -fx-padding: 8;
    -fx-background-color: #e8e8ec;
}

.error {
    -fx-text-fill: #b00020;
}
```

`login.fxml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>

<?import javafx.scene.control.Button?>
<?import javafx.scene.control.Label?>
<?import javafx.scene.control.PasswordField?>
<?import javafx.scene.control.TextField?>
<?import javafx.scene.layout.GridPane?>

<!-- GridPane attributes on children (rowIndex, columnIndex) need the imported type. -->
<GridPane xmlns="http://javafx.com/javafx/17"
          xmlns:fx="http://javafx.com/fxml/1"
          fx:controller="sample.LoginController"
          styleClass="panel" hgap="10" vgap="10">

    <Label text="Email" GridPane.rowIndex="0" GridPane.columnIndex="0"/>
    <TextField fx:id="emailField" promptText="name@example.test"
               GridPane.rowIndex="0" GridPane.columnIndex="1"/>

    <Label text="Password" GridPane.rowIndex="1" GridPane.columnIndex="0"/>
    <PasswordField fx:id="passwordField"
                   GridPane.rowIndex="1" GridPane.columnIndex="1"/>

    <!-- onAction="#signIn" is resolved in LoginController, not here -->
    <Button fx:id="signInButton" text="Sign in" defaultButton="true"
            onAction="#signIn"
            GridPane.rowIndex="2" GridPane.columnIndex="1"/>

    <!-- Hidden at start. managed="false" removes the space it would take. -->
    <Label fx:id="errorLabel" styleClass="error" visible="false" managed="false"
           GridPane.rowIndex="3" GridPane.columnIndex="0" GridPane.columnSpan="2"/>
</GridPane>
```

`LoginController.java`:

```java
package sample;

import javafx.fxml.FXML;
import javafx.scene.control.Label;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;

public class LoginController {

    @FXML private TextField emailField;
    @FXML private PasswordField passwordField;
    @FXML private Label errorLabel;

    // The app owns the stage, so navigation is one call away. Set after load(),
    // never in the FXML, because FXML only fills nodes.
    private App app;

    void setApp(App app) {
        this.app = app;
    }

    @FXML
    private void signIn() {
        String email = emailField.getText().trim();
        String password = passwordField.getText();

        if (email.isEmpty() || password.isEmpty()) {
            errorLabel.setText("Fill in both fields.");
            errorLabel.setVisible(true);
            errorLabel.setManaged(true);   // visible alone leaves an empty gap
            return;
        }

        errorLabel.setVisible(false);
        errorLabel.setManaged(false);
        app.showDashboard(email);          // the only line that changes screen
    }
}
```

`status-bar.fxml`, included by the dashboard:

```xml
<?xml version="1.0" encoding="UTF-8"?>

<?import javafx.scene.control.Label?>
<?import javafx.scene.layout.HBox?>

<HBox xmlns="http://javafx.com/javafx/17"
      xmlns:fx="http://javafx.com/fxml/1"
      fx:controller="sample.StatusBarController"
      spacing="6" styleClass="bar">

    <Label fx:id="statusLabel" text="Ready"/>
</HBox>
```

`StatusBarController.java`:

```java
package sample;

import javafx.fxml.FXML;
import javafx.scene.control.Label;

public class StatusBarController {

    @FXML private Label statusLabel;

    // Public, because the parent controller talks to this object, not to its nodes.
    public void show(String text) {
        statusLabel.setText(text);
    }
}
```

`dashboard.fxml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>

<?import javafx.scene.control.Button?>
<?import javafx.scene.control.Label?>
<?import javafx.scene.layout.BorderPane?>
<?import javafx.scene.layout.HBox?>
<?import javafx.scene.layout.VBox?>

<BorderPane xmlns="http://javafx.com/javafx/17"
            xmlns:fx="http://javafx.com/fxml/1"
            fx:controller="sample.DashboardController"
            styleClass="panel">

    <top>
        <HBox spacing="12" styleClass="bar">
            <Label fx:id="welcomeLabel" text="Welcome"/>
            <Button text="Sign out" onAction="#signOut"/>
        </HBox>
    </top>

    <center>
        <VBox spacing="8">
            <Label text="No tasks for today."/>
        </VBox>
    </center>

    <bottom>
        <!-- fx:id on the include gives the parent both the node and the child controller -->
        <fx:include fx:id="statusBar" source="status-bar.fxml"/>
    </bottom>
</BorderPane>
```

`DashboardController.java`:

```java
package sample;

import javafx.fxml.FXML;
import javafx.scene.control.Label;
import javafx.scene.layout.HBox;

public class DashboardController {

    @FXML private Label welcomeLabel;

    // fx:include fx:id="statusBar" produces exactly these two field names.
    @FXML private HBox statusBar;
    @FXML private StatusBarController statusBarController;

    private App app;

    void setApp(App app) {
        this.app = app;
    }

    // Called after load(), so the injected child controller is already there.
    void setUser(String email) {
        welcomeLabel.setText("Signed in as " + email);
        statusBarController.show("Session started");
    }

    @FXML
    private void signOut() {
        app.showLogin();
    }
}
```

`App.java`:

```java
package sample;

import java.io.IOException;
import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.layout.StackPane;
import javafx.stage.Stage;

public class App extends Application {

    private Stage stage;
    private Scene scene;

    @Override
    public void start(Stage stage) throws IOException {
        this.stage = stage;
        scene = new Scene(new StackPane(), 420, 320);

        // One sheet, attached to the scene, so setRoot keeps it.
        scene.getStylesheets().add(getClass().getResource("/css/app.css").toExternalForm());

        stage.setScene(scene);
        showLogin();
        stage.show();
    }

    void showLogin() {
        load("/fxml/login.fxml", null);
        stage.setTitle("Sign in");
    }

    void showDashboard(String email) {
        load("/fxml/dashboard.fxml", email);
        stage.setTitle("Dashboard");
    }

    // One place that knows how a screen is built, wired, and shown.
    private void load(String path, String email) {
        FXMLLoader loader = new FXMLLoader(getClass().getResource(path));
        try {
            Parent root = loader.load();
            Object controller = loader.getController();

            // Type check, because the same loader serves two different screens.
            if (controller instanceof LoginController login) {
                login.setApp(this);
            } else if (controller instanceof DashboardController dashboard) {
                dashboard.setApp(this);
                if (email != null) {
                    dashboard.setUser(email);
                }
            }

            scene.setRoot(root);
        } catch (IOException e) {
            // A broken FXML file is a bug, not a user input problem.
            throw new IllegalStateException("Cannot load " + path, e);
        }
    }

    public static void main(String[] args) {
        launch(args);
    }
}
```

Why this holds together: the stage exists before any screen, the scene exists before any stylesheet, and each load builds a fresh controller with fresh state. A second sign in produces a second dashboard controller with no leftovers from the first. The include is not a screen, so it has no loader of its own and no navigation code.

### Example 4: a row that is its own controller

`fx:root` exists for one situation: the controller is the node subclass and wants a typed constructor.

`row.fxml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>

<?import javafx.scene.control.Label?>
<?import javafx.scene.layout.HBox?>

<!-- fx:root means: build into the instance given with setRoot, do not create a new one. -->
<fx:root type="javafx.scene.layout.HBox"
         xmlns="http://javafx.com/javafx/17"
         xmlns:fx="http://javafx.com/fxml/1"
         spacing="8" styleClass="row">

    <Label fx:id="nameLabel"/>
</fx:root>
```

`Row.java`:

```java
package sample;

import java.io.IOException;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.control.Label;
import javafx.scene.layout.HBox;

public class Row extends HBox {

    @FXML private Label nameLabel;

    public Row(String name) {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/fxml/row.fxml"));
        loader.setRoot(this);         // the object being built is this Row
        loader.setController(this);   // and it is also the controller
        try {
            loader.load();
        } catch (IOException e) {
            throw new IllegalStateException("row.fxml is broken", e);
        }
        nameLabel.setText(name);
    }
}
```

Using `setController(this)` with `fx:root` and no `fx:controller` attribute is the supported pair. Adding `fx:controller` as well gives you "controller already specified" at load time.

## Errors you will actually hit

Most FXML failures arrive as `javafx.fxml.LoadException` with a nested cause. The message usually names the element or attribute, so read the last part first.

A `ClassNotFoundException` under the load exception means a missing or misspelled `<?import?>` or a class name typo in `fx:controller`. Check the import line before you check anything else.

"Location is not set" means the URL passed to the loader was null: the path is wrong, the slash is missing, or the resource was never copied to the output directory.

A `NullPointerException` in `initialize()` on a field you are sure you declared means the injection did not happen. Either the `fx:id` and the field name differ by one character, the field is private without `@FXML`, or the node is in a different FXML file than you think.

A load exception about `onAction` means the handler method is missing, not public, or not annotated. The check is mechanical: name, visibility, parameter list.

"Controller value already specified" comes from calling `setController` on a loader whose file declares `fx:controller`.

A controller without a no argument constructor fails during load, before any field is injected, so the stack trace points at the loader and not at the constructor you forgot.

`javax.xml.stream.XMLStreamException` or a SAX parse error comes from malformed XML: an unclosed tag, an attribute without quotes, or an `&` inside text. Escape `&` as `&amp;` and `<` as `&lt;` in attribute values.

An access error on a modular project means the controller's package is not open to `javafx.fxml`. Add the `opens` directive; the class is present and unreachable at the same time.

## Common mistakes

Putting layout in Java anyway, then wondering why the FXML edits do nothing. The loader builds a new tree from the file; changes made to a loaded node are lost on the next load.

Calling `stage.show()` inside a controller. Show once in `start()`, then swap roots.

Reading a field in the controller constructor. Field injection happens after construction, so it is null there.

Setting data on the controller before `load()`. `getController()` returns null until the load completed.

Mixing `fx:controller` with `setController`. Pick one.

Forgetting that `visible="false"` still reserves space, while `managed="false"` does not. A hidden error label with default `managed` leaves a hole in the layout.

Reusing one `FXMLLoader` for two screens, or keeping one controller across screens. Both carry state that the next screen should not inherit.

Assuming an `fx:id` typo throws. It does not: the field stays null and the failure happens later, away from the cause.

Adding a stylesheet to a scene created after the fact, or forgetting `toExternalForm()`. A `URL` in `getStylesheets().add(...)` does not compile, and a stylesheet added to an old scene disappears with that scene.

Using an id selector for styling many nodes. Ids are unique per node by definition, and the same `fx:id` in two files means two nodes competing for one rule.

Loading a screen through `fx:include` when the screen is supposed to be switched to. Includes cannot be swapped independently of their parent.

## Exam checklist

- The FXML file starts with the XML declaration, the needed `<?import?>` lines, then one root element carrying both namespaces.
- Every node that the controller touches has an `fx:id` that is a valid Java identifier and matches a field exactly.
- Every injected field is `@FXML`, private is fine, and the declared type matches the node.
- `fx:controller` holds the fully qualified class name, and that class has a public no argument constructor.
- State that comes from outside is set after `load()`, through a method, or through `setControllerFactory` when `initialize()` needs it.
- `initialize()` contains wiring, not layout, and reads no field that is still null.
- The loader is an instance when you need `getController()`, and the URL starts with `/` for classpath root.
- `load()` is wrapped or declared: `IOException` is checked and must be handled.
- Navigation goes through one owner of the stage, and `scene.setRoot` is used instead of a new `Scene`.
- Includes use `fx:id` plus the `<name>Controller` field when the parent talks to the child controller.
- A stylesheet is attached once to the scene, and inline styles are used only for a deliberate exception.
- Event handler methods exist, are public or `@FXML`, and take either no argument or one event argument.
- A wrong path, a wrong handler name, and a missing import are the first three things you check when the window does not open.
